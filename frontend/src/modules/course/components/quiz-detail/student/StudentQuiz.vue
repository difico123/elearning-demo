<template>
    <div class="d-flex flex-column">
        <div
            class="d-flex flex-row gap-4 mb-3 quiz-title w-100"
            style="position: relative"
            :style="[
                { 'background-color': quiz.score >= 0 ? '#4057d08d' : '#f2f2f2' },
                {
                    'border-left-color': quiz.score >= 0 ? '#6d79e8' : '#c4c4c4',
                },
            ]"
            v-if="isShowTitle"
        >
            <div class="d-flex flex-row gap-4 align-items-center w-100">
                <div class="quiz-name text-ellipsis">
                    {{ quiz.name }}
                </div>
                <div class="quiz-duration">
                    {{ $t('course.quiz.form.duration', { time: quiz.duration }) }}
                </div>
                <div v-if="quiz.score >= 0" class="quiz-duration">
                    {{ $t('course.quiz.quizScore', { score: quiz.score }) }}
                </div>
            </div>
            <div class="down-arrow" @click="toggleDetail">
                <img
                    v-if="!isShowDetail"
                    width="16"
                    src="@/assets/course/icons/down-arrow.png"
                    alt=""
                />
                <img v-else width="16" src="@/assets/course/icons/up-arrow.png" alt="" />
            </div>
        </div>
        <div v-if="isShowDetail" class="question-wrapper">
            <div class="d-flex flex-column gap-3" v-if="quiz.score < 0">
                <div v-for="(question, index) in quiz.questionList" :key="index">
                    <StudentQuestion
                        :question="question"
                        :index="index"
                        :isShowDetail="isShowDetail"
                    />
                </div>
                <div class="submit-quiz-button" @click="submitQuiz">
                    {{ $t('course.quiz.submitQuiz') }}
                </div>
            </div>
            <div class="quiz-done d-flex w-100 justify-content-center" v-else>
                {{ $t('course.quiz.doneQuiz') }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { IQuizDetail } from '../../../constants/course.interfaces';
import { Prop } from 'vue-property-decorator';
import StudentQuestion from './StudentQuestion.vue';
import { courseModule } from '@/modules/course/store/course.store';
import { commonModule } from '@/modules/common/store/common.store';
import { getQuizList, submitQuiz } from '@/modules/course/services/course';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';

@Options({
    components: { StudentQuestion },
})
export default class StudentQuiz extends Vue {
    @Prop({ default: {} }) readonly quiz!: IQuizDetail;
    @Prop({ default: false }) readonly isShowTitle: boolean;

    isShown = true;
    isShowDetail = false;

    get topicId() {
        return courseModule.topicId;
    }

    get quizAnswerList() {
        return courseModule.quizAnswerList;
    }

    toggleDetail() {
        this.isShowDetail = !this.isShowDetail;
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

    async submitQuiz() {
        const courseId = +this.$route.params.courseId;
        commonModule.setLoadingIndicator(true);

        // Build answer payload based on question types
        const answers: Array<{
            questionId: number;
            answerIds?: number[];
            answerText?: string;
        }> = [];

        if (this.quiz?.questionList) {
            for (const question of this.quiz.questionList) {
                const questionId = question.id;
                if (!questionId) continue;

                const type = question.type || 'multiple_choice';
                const answerData: {
                    questionId: number;
                    answerIds?: number[];
                    answerText?: string;
                } = { questionId };

                if (type === 'short_answer' || type === 'single_choice') {
                    // Both short_answer and single_choice work the same way - select one answer
                    const answerId = courseModule.getSingleChoiceAnswer(questionId);
                    if (answerId) {
                        answerData.answerIds = [answerId];
                        answers.push(answerData);
                    }
                } else {
                    // Multiple choice: use existing quizAnswerList
                    const selectedAnswers = this.quizAnswerList
                        .filter((item) => {
                            // Check if this answer belongs to this question
                            return question.answerList?.some(
                                (a) => a.id === item.id,
                            );
                        })
                        .map((item) => item.id as number);
                    if (selectedAnswers.length > 0) {
                        answerData.answerIds = selectedAnswers;
                        answers.push(answerData);
                    }
                }
            }
        }

        const response = await submitQuiz(
            courseId,
            this.quiz?.id as number,
            answers,
        );
        if (response?.success) {
            showSuccessNotificationFunction(this.$t('course.success.quiz.submitQuiz'));
            courseModule.clearQuizAnswers();
            await this.getQuizList();
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.quiz.submitQuizError') },
            ];
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }
}
</script>

<style lang="scss" scoped>
.quiz {
    &-title {
        border-left: 3px solid #c4c4c4;
        padding: 8px 12px;
        text-align: center;
        align-items: center;
        background-color: #f2f2f2;
    }

    &-name {
        font-size: 22px;
        font-weight: 600;
        max-width: 70%;
        text-align: start;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &-duration {
        font-size: 15px;
        font-weight: 600;
    }
}

.question {
    &-wrapper {
        padding-left: 24px;
    }
}

.down-arrow {
    cursor: pointer;
    position: absolute;
    right: 20px;
}

.submit-quiz-button {
    flex-grow: 0;
    align-self: center;
    padding: 10px 20px;
    font-weight: 500;
    background: $color-violet-new-1;
    &:hover {
        background: $color-violet-new;
    }
    border-radius: 5px;
    color: $color-white;
    transition: all 0.5s ease;
    cursor: pointer;
}

.quiz-done {
    padding: 30px 0;
    font-style: italic;
    font-size: 15px;
}
</style>
