<template>
    <div class="question-card d-flex flex-row gap-3 pb-2">
        <div v-if="!isEditingQuestion" class="d-flex flex-row gap-4">
            <span>{{ `${$t('course.quiz.field.question')} ${index + 1}:` }}</span>
            <span>{{
                question?.name
                    ? question?.name
                    : $t('course.quiz.field.addQuestionPlaceholder')
            }}</span>
            <span>{{ $t('course.quiz.form.mark', { mark: question?.mark }) }}</span>
        </div>

        <div v-else class="question-card d-flex flex-row gap-4 pb-2">
            <el-input
                :placeholder="$t('course.quiz.form.title')"
                v-model="question.name"
                autocomplete="off"
            />
            <el-input
                :placeholder="$t('course.quiz.form.title')"
                v-model.number="question.mark"
                autocomplete="off"
            />
        </div>
        <div class="d-flex flex-row gap-2" style="padding-left: 10px" v-if="!isEdit">
            <img
                src="@/assets/course/icons/edit.svg"
                width="16"
                alt=""
                style="cursor: pointer"
                @click="toggleEditQuestion"
            />
            <img
                src="@/assets/course/icons/cancel.svg"
                width="16"
                alt=""
                style="cursor: pointer"
                v-if="!isEditingQuestion"
                @click="handleDeleteQuestion"
            />
        </div>
    </div>
    <div class="answer-wrapper px-3">
        <div
            class="answer-card d-flex flex-row gap-3"
            v-for="(answer, index) in question?.answerList"
            :key="index"
        >
            <InstructorAnswer
                :answer="answer"
                :index="index"
                @delete-answer="handleDeteleAnswer"
                @edit-answer="handleEditAnswer"
                :isEdit="isEdit"
            />
        </div>
        <div class="add-button d-flex flex-row gap-2 py-2" v-if="!isEdit">
            <img
                @click="handleAddAnswer()"
                src="@/assets/course/icons/plus.svg"
                style="cursor: pointer"
                width="18"
                alt=""
            />
            <div @click="handleAddAnswer()" style="cursor: pointer">
                {{ $t('course.quiz.form.addAnswer') }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
    IAnswer,
    IAnswerDetail,
    IQuestionDetail,
} from '../../../constants/course.interfaces';
import { Prop } from 'vue-property-decorator';
import InstructorAnswer from './InstructorAnswer.vue';

@Options({
    components: { InstructorAnswer },
})
export default class InstructorQuestion extends Vue {
    @Prop({ default: {} }) readonly question!: IQuestionDetail;
    @Prop({ default: 0 }) readonly index!: number;
    @Prop({ default: false }) readonly isEdit!: false;

    isEditingQuestion = false;

    handleAddAnswer() {
        this.question.answerList?.push({
            questionId: this.question.id,
            content: '',
            isCorrect: false,
        });
    }

    toggleEditQuestion() {
        this.isEditingQuestion = !this.isEditingQuestion;
        if (!this.isEditingQuestion) {
            this.$emit('edit-question', this.question);
        }
    }

    handleDeteleAnswer(answer: IAnswerDetail, index: number) {
        this.question.answerList?.splice(index, 1);
        this.$emit('delete-answer', answer, index, this.index);
    }

    handleDeleteQuestion() {
        this.$emit('delete-question', this.question, this.index);
    }

    handleEditAnswer(answer: IAnswer) {
        this.$emit('edit-answer', answer, this.question.id);
    }
}
</script>

<style lang="scss" scoped>
.answer {
    &-wrapper {
        flex-wrap: wrap;
    }

    &-card {
        font-size: 16px;
        line-height: 200%;
    }
}
</style>
