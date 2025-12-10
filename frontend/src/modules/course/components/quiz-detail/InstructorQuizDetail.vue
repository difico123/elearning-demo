<template>
    <div class="quiz-detail-wrapper d-flex flex-column gap-4 w-100">
        <div v-if="quizList && quizList.length === 0">
            {{ $t('course.errors.emptyQuizList') }}
        </div>
        <div @click="handleAddQuizButton" class="add-button d-flex flex-row gap-2">
            <img src="@/assets/course/icons/plus.svg" width="18" alt="" />
            <span>{{ $t('course.quiz.form.addQuiz') }}</span>
        </div>
        <div class="add-quiz-area d-flex flex-column gap-4" v-if="isAddingQuiz">
            <div class="field-wrapper">
                <div class="label pb-3">{{ $t('course.quiz.form.title') }}:</div>
                <BaseInputText
                    :placeholder="$t('course.quiz.form.title')"
                    v-model:value="newQuizForm.name"
                    autocomplete="off"
                />
            </div>
            <InstructorQuiz :quiz="newQuizForm" :isShowDetail="true" />

            <div class="action-buttons d-flex flex-row gap-2">
                <div @click="handleSaveAddQuiz" class="button save-add-quiz">
                    {{ $t('course.quiz.form.save') }}
                </div>
                <div @click="handleCancelAddQuiz" class="button cancel-add-quiz">
                    {{ $t('course.quiz.form.cancel') }}
                </div>
            </div>
        </div>

        <div class="quiz-card" v-for="quiz in quizList" :key="quiz.id">
            <InstructorQuiz
                :quiz="quiz"
                isShowTitle="true"
                :isEdit="quiz.isEdit"
                @delete-answer="handleDeleteAnswer"
                @delete-question="handleDeleteQuestion"
                @delete-quiz="handleDeleteQuiz"
                @toggle-show-quiz="handleToggleQuiz"
                @edit-quiz="handleEditQuiz"
                @edit-answer="handleEditAnswer"
                @edit-question="handleEditQuestion"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { SystemRole } from '@/common/constants';
import { Options, Vue } from 'vue-class-component';
import {
    IAnswer,
    IAnswerDetail,
    IQuestion,
    IQuestionDetail,
    IQuizDetail,
} from '../../constants/course.interfaces';
import { courseModule } from '../../store/course.store';
import InstructorQuiz from '../quiz-detail/instructor/InstructorQuiz.vue';
import { commonModule } from '@/modules/common/store/common.store';
import moment from 'moment';
import { createQuiz, deleteQuiz, editQuiz, getQuizList } from '../../services/course';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
@Options({
    components: { InstructorQuiz },
})
export default class InstructorQuizDetail extends Vue {
    SystemRole = SystemRole;

    newQuizForm = {
        name: '',
        startTime: '',
        isEdit: false,
        duration: 0,
        topicId: this.topicId,
        questionList: [],
    };

    get topicId() {
        return courseModule.topicId;
    }

    get quizList(): Array<IQuizDetail> {
        return courseModule.quizList;
    }

    get isAddingQuiz() {
        return courseModule.isAddingQuiz;
    }

    resetNewQuiz() {
        this.newQuizForm = {
            name: '',
            startTime: '',
            isEdit: false,
            duration: 0,
            topicId: this.topicId,
            questionList: [],
        };
    }

    async getQuizList() {
        const courseId = +this.$route.params.courseId;
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
        courseModule.setAddingQuiz(true);
    }

    async handleSaveAddQuiz() {
        commonModule.setLoadingIndicator(true);
        const courseId = +this.$route.params.courseId;
        const params = {
            ...this.newQuizForm,
            startTime: moment(this.newQuizForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
            duration: `${this.newQuizForm.duration}`,
        };

        const response = await createQuiz(courseId, this.topicId, params);
        if (response?.success) {
            showSuccessNotificationFunction(this.$t('course.success.quiz.createQuiz'));
            courseModule.setQuizList([...this.quizList, response.data || {}]);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.createNewQuizError') },
            ];
            showErrorNotificationFunction(res[0].message);
        }
        this.resetNewQuiz();
        courseModule.setAddingQuiz(false);
        commonModule.setLoadingIndicator(false);
    }

    handleCancelAddQuiz() {
        this.resetNewQuiz();
        courseModule.setAddingQuiz(false);
    }

    async handleDeleteAnswer(answer: IAnswerDetail, quizId: number) {
        if (answer?.id) {
            let response = await deleteQuiz(
                +this.$route.params.courseId,
                quizId,
                answer.id,
                'answer',
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
    }
    async handleDeleteQuestion(question: IQuestionDetail, quizId: number) {
        if (question?.id) {
            let response = await deleteQuiz(
                +this.$route.params.courseId,
                quizId,
                question.id,
                'question',
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
    }

    async handleDeleteQuiz(quiz: IQuizDetail, quizId: number) {
        if (quiz?.id) {
            let quizes = this.quizList;
            let quizIndex = this.quizList.findIndex((item) => item.id === quiz.id);
            quizes.splice(quizIndex, 1);
            courseModule.setQuizList([...quizes]);

            let response = await deleteQuiz(
                +this.$route.params.courseId,
                quizId,
                quiz.id,
                'quiz',
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.deleteQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
    }

    async handleToggleQuiz(quiz: IQuizDetail) {
        if (quiz?.id) {
            let response = await editQuiz(
                +this.$route.params.courseId,
                quiz.id,
                quiz.id,
                'quiz',
                {
                    quiz: {
                        shown: quiz.shown,
                    },
                },
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
        this.getQuizList();
    }

    async handleEditQuiz(quiz: IQuizDetail) {
        if (quiz?.id) {
            console.log('coursexzxzczx', +this.$route.params.courseId);

            let response = await editQuiz(
                +this.$route.params.courseId,
                quiz.id,
                quiz.id,
                'quiz',
                {
                    quiz: {
                        name: quiz.name,
                        duration: quiz.duration,
                    },
                },
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
    }

    async handleEditAnswer(answer: IAnswer, questionId: number, quizId: number) {
        if (answer?.id) {
            let response = await editQuiz(
                +this.$route.params.courseId,
                answer.id,
                quizId,
                'answer',
                {
                    answer: {
                        content: answer.content,
                        isCorrect: answer.isCorrect,
                    },
                },
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        } else if (questionId) {
            let response = await editQuiz(
                +this.$route.params.courseId,
                questionId,
                quizId,
                'addAnswer',
                {
                    answer: {
                        content: answer.content,
                        isCorrect: answer.isCorrect,
                    },
                },
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
        this.getQuizList();
    }

    async handleEditQuestion(question: IQuestion, quizId: number) {
        if (question?.id) {
            let response = await editQuiz(
                +this.$route.params.courseId,
                question.id,
                quizId,
                'question',
                {
                    question: {
                        name: question.name,
                        mark: question.mark,
                    },
                },
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        } else if (quizId) {
            let response = await editQuiz(
                +this.$route.params.courseId,
                quizId,
                quizId,
                'addQuestion',
                {
                    question: {
                        name: question.name,
                        mark: question.mark,
                    },
                },
            );
            if (response?.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.quiz.updateQuiz'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.quiz.updateTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
        this.getQuizList();
    }
}
</script>
<style lang="scss" scoped>
.quiz-detail {
    &-wrapper {
        margin: 4vh 3vw;
    }
}

.button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 6px;
    padding: 8px 20px;
    transition: all 0.44s ease 0s;
    cursor: pointer;
}

.save-add-quiz {
    color: $color-white;
    background-color: $color-violet-new-1;

    &:hover {
        background-color: $color-violet-new-opacity-50;
    }
}

.cancel-add-quiz {
    color: #000;
    background-color: #e8e8e8;

    &:hover {
        background-color: #f3f3f3;
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

.text-ellipsis {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.field-wrapper {
    display: flex;
    flex-direction: row;
    font-weight: 600;
    align-items: center;
    gap: 12px;
    width: 80%;
}

.label {
    width: 100px;
}
</style>
