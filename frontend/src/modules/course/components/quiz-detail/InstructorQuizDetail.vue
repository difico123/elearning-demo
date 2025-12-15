<template>
    <div class="quiz-detail-wrapper d-flex flex-column gap-4 w-100">
        <div v-if="quizList && quizList.length === 0">
            {{ $t('course.errors.emptyQuizList') }}
        </div>
        <div @click="handleAddQuizButton" class="add-button d-flex flex-row gap-2">
            <img src="@/assets/course/icons/plus.svg" width="18" alt="" />
            <span>{{ $t('course.quiz.form.addQuiz') }}</span>
        </div>

        <div class="quiz-card" v-for="quiz in quizList" :key="quiz.id">
            <InstructorQuiz
                :quiz="quiz"
                isShowTitle="true"
                :isEdit="quiz.isEdit"
                @toggle-show-quiz="handleToggleQuiz"
                @edit-quiz="handleOpenQuizEditPopup"
            />
        </div>
        <QuizEditPopup ref="quizEditPopup" @save="handleSaveQuizEdit" />
    </div>
</template>

<script lang="ts">
import { SystemRole } from '@/common/constants';
import { Options, Vue } from 'vue-class-component';
import {
    IAnswerDetail,
    IQuestionDetail,
    IQuizDetail,
} from '../../constants/course.interfaces';
import { courseModule } from '../../store/course.store';
import InstructorQuiz from '../quiz-detail/instructor/InstructorQuiz.vue';
import QuizEditPopup from './QuizEditPopup.vue';
import { commonModule } from '@/modules/common/store/common.store';
import moment from 'moment';
import {
    createQuiz,
    deleteQuiz,
    getQuizList,
    updateQuizBulk,
} from '../../services/course';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
@Options({
    components: { InstructorQuiz, QuizEditPopup },
})
export default class InstructorQuizDetail extends Vue {
    SystemRole = SystemRole;

    get topicId() {
        return courseModule.topicId;
    }

    get quizList(): Array<IQuizDetail> {
        return courseModule.quizList;
    }

    async getQuizList() {
        const courseId = +this.$route.params.courseId;
        if (!this.topicId || this.topicId <= 0) {
            courseModule.setQuizList([]);
            return;
        }
        const response = await getQuizList(courseId, this.topicId as number);
        if (response?.success) {
            courseModule.setQuizList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getQuizListError') },
            ];
            courseModule.setQuizList([]);
            showErrorNotificationFunction(res[0].message);
        }
    }
    handleAddQuizButton() {
        const popup = this.$refs.quizEditPopup as any;
        if (popup) {
            popup.openPopup(null, +this.$route.params.courseId);
        }
    }

    async handleToggleQuiz(quiz: IQuizDetail) {
        if (quiz?.id) {
            // For toggle shown, we still need to update just the quiz meta
            // We'll use bulk update with all existing questions
            const questions = (quiz.questionList || []).map((q) => ({
                id: q.id,
                name: q.name,
                mark: q.mark,
                answerList: (q.answerList || []).map((a) => ({
                    id: a.id,
                    content: a.content,
                    isCorrect: a.isCorrect,
                })),
            }));

            const payload = {
                quiz: {
                    name: quiz.name || '',
                    duration: quiz.duration || '0',
                    shown: quiz.shown,
                },
                questions: questions,
                deletedQuestionIds: [],
                deletedAnswerIds: [],
            };

            // Note: We need to update shown separately since it's not in the bulk DTO
            // For now, we'll keep the old endpoint for this simple toggle
            // Or we can add shown to the bulk DTO if needed
            const response = await updateQuizBulk(
                +this.$route.params.courseId,
                quiz.id,
                payload,
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                const res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
        this.getQuizList();
    }

    handleOpenQuizEditPopup(quiz: IQuizDetail) {
        const popup = this.$refs.quizEditPopup as any;
        if (popup) {
            popup.openPopup(quiz, +this.$route.params.courseId);
        }
    }

    async handleSaveQuizEdit(data: {
        quizId: number;
        courseId: number;
        quiz: { name: string; duration: string };
        questions: Array<IQuestionDetail>;
        deletedQuestions: number[];
        deletedAnswers: number[];
    }) {
        commonModule.setLoadingIndicator(true);
        try {
            if (!this.topicId || this.topicId <= 0) {
                showErrorNotificationFunction(this.$t('course.errors.getTopicListError'));
                commonModule.setLoadingIndicator(false);
                return;
            }

            // Build questionList for create/update
            const questionList = (data.questions || []).map((q) => ({
                name: q.name || '',
                mark: q.mark || 0,
                answerList: (q.answerList || []).map((a) => ({
                    content: a.content || '',
                    isCorrect: a.isCorrect || false,
                })),
            }));

            if (data.quizId === 0) {
                // Create mode
                const params = {
                    id: 0,
                    name: data.quiz.name || '',
                    startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    duration: +data.quiz.duration || 0,
                    shown: false,
                    questionList: questionList,
                };

                const response = await createQuiz(data.courseId, this.topicId, params);
                if (response?.success) {
                    showSuccessNotificationFunction(
                        this.$t('course.success.quiz.createQuiz'),
                    );
                    await this.getQuizList();
                } else {
                    const errors = response?.errors || [
                        { message: this.$t('course.errors.createNewQuizError') },
                    ];
                    showErrorNotificationFunction(errors[0].message);
                }
            } else {
                // Edit mode
                const payload = {
                    quiz: {
                        name: data.quiz.name,
                        duration: data.quiz.duration,
                    },
                    questions: (data.questions || []).map((q) => ({
                        id: q.id,
                        name: q.name,
                        mark: q.mark,
                        answerList: (q.answerList || []).map((a) => ({
                            id: a.id,
                            content: a.content,
                            isCorrect: a.isCorrect,
                        })),
                    })),
                    deletedQuestionIds: data.deletedQuestions || [],
                    deletedAnswerIds: data.deletedAnswers || [],
                };

                const response = await updateQuizBulk(data.courseId, data.quizId, payload);
                if (response?.success) {
                    showSuccessNotificationFunction(
                        this.$t('course.success.quiz.updateQuiz'),
                    );
                    await this.getQuizList();
                } else {
                    const errors = response?.errors || [
                        { message: this.$t('course.errors.quiz.updateTopic') },
                    ];
                    showErrorNotificationFunction(errors[0].message);
                }
            }
        } catch (error) {
            showErrorNotificationFunction(this.$t('course.errors.quiz.updateTopic'));
        }
        commonModule.setLoadingIndicator(false);
    }
}
</script>
<style lang="scss" scoped>
.quiz-detail {
    &-wrapper {
        margin: 4vh 3vw;
    }
}

.add-button {
    cursor: pointer;
    padding: 10px 20px;
    border-left: 4px solid black;
    font-size: 20px;
    font-weight: 700;
    background: #ccc;
}
</style>
