<template>
    <div
        class="d-flex flex-row gap-4 mb-3 quiz-title w-100"
        style="position: relative"
        v-if="isShowTitle"
    >
        <div v-if="!isEditingQuiz" class="d-flex flex-row gap-4 align-items-center">
            <div class="quiz-name text-ellipsis">
                {{
                    quiz.name
                        ? quiz?.name
                        : $t('course.quiz.field.addQuestionPlaceholder')
                }}
            </div>
            <div class="quiz-duration">
                {{ $t('course.quiz.form.duration', { time: quiz.duration }) }}
            </div>
            <div class="d-flex align-items-center justify-content-center">
                <el-icon
                    v-if="!quiz.shown"
                    style="cursor: pointer"
                    @click="toggleShownQuiz"
                >
                    <Lock color="red" />
                </el-icon>
                <el-icon v-else style="cursor: pointer" @click="toggleShownQuiz">
                    <Unlock color="green" />
                </el-icon>
            </div>
            <div
                class="d-flex align-items-center justify-content-center"
                v-if="quiz.isEdit"
            >
                <el-icon><View color="gray" /></el-icon>
            </div>
        </div>
        <div v-else class="d-flex flex-row gap-4 align-items-center">
            <el-input
                :placeholder="$t('course.quiz.form.title')"
                v-model.trim="quiz.name"
                @change="toggleEditQuiz"
                autocomplete="off"
            />
            <el-input
                :placeholder="$t('course.quiz.form.title')"
                v-model.number="quiz.duration"
                @change="toggleEditQuiz"
                autocomplete="off"
            />
        </div>
        <div class="d-flex flex-row gap-3">
            <img
                src="@/assets/course/icons/edit.svg"
                width="16"
                alt=""
                style="cursor: pointer"
                @click="toggleEditQuiz"
            />
            <img
                src="@/assets/course/icons/cancel.svg"
                width="16"
                alt=""
                style="cursor: pointer"
                @click="handleDeleteQuiz"
            />
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
    <div v-if="!isShowDetail" class="question-wrapper d-flex flex-column gap-3">
        <div v-for="(question, index) in quiz.questionList" :key="index">
            <InstructorQuestion
                :question="question"
                :index="index"
                :isShowDetail="isShowDetail"
                :isEdit="quiz.isEdit"
                @delete-question="handleDeleteQuestion"
                @delete-answer="handleDeleteAnswer"
                @edit-question="handleEditQuestion"
                @edit-answer="handleEditAnswer"
            />
        </div>
        <div class="add-button d-flex flex-row gap-2" v-if="!quiz.isEdit">
            <img
                style="cursor: pointer"
                @click="handleAddQuestion"
                src="@/assets/course/icons/plus.svg"
                width="18"
                alt=""
            />
            <div style="cursor: pointer" @click="handleAddQuestion">
                {{ $t('course.quiz.form.addQuestion') }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import {
    IAnswer,
    IAnswerDetail,
    IQuestion,
    IQuestionDetail,
    IQuizDetail,
} from '../../../constants/course.interfaces';
import { Prop } from 'vue-property-decorator';
import InstructorQuestion from './InstructorQuestion.vue';
import { courseModule } from '@/modules/course/store/course.store';

@Options({
    components: { InstructorQuestion },
})
export default class InstructorQuiz extends Vue {
    @Prop({ default: {} }) readonly quiz!: IQuizDetail;
    @Prop({ default: false }) readonly isShowTitle: boolean;

    isShown = true;
    isEditingQuiz = false;
    isShowDetail = false;

    get topicId() {
        return courseModule.topicId;
    }

    toggleShownQuiz() {
        this.quiz.shown = !this.quiz.shown;
        this.$emit('toggle-show-quiz', this.quiz);
    }

    toggleEditQuiz() {
        this.isEditingQuiz = !this.isEditingQuiz;
        if (!this.isEditingQuiz) {
            this.$emit('edit-quiz', this.quiz);
        }
    }

    handleAddQuestion() {
        this.quiz.questionList?.push({
            name: '',
            mark: 0,
            quizId: this.quiz.id,
            answerList: [],
        });
    }

    handleDeleteQuestion(question: IQuestionDetail, index: number) {
        this.quiz.questionList?.splice(index, 1);
        this.$emit('delete-question', question, this.quiz.id);
    }

    handleDeleteAnswer(answer: IAnswerDetail) {
        this.$emit('delete-answer', answer, this.quiz.id);
    }

    handleDeleteQuiz() {
        this.$emit('delete-quiz', this.quiz);
    }

    handleEditQuestion(question: IQuestion) {
        this.$emit('edit-question', question, this.quiz.id);
    }

    handleEditAnswer(answer: IAnswer, questionId: number) {
        this.$emit('edit-answer', answer, questionId, this.quiz.id);
    }

    toggleDetail() {
        this.isShowDetail = !this.isShowDetail;
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
</style>
