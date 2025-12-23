<template>
    <div class="d-flex flex-row align-items-center gap-3" v-if="questionType === 'short_answer' || questionType === 'single_choice'">
        <input 
            type="radio" 
            :name="`question-${questionId}`"
            :value="answer?.id" 
            @change="handleRadioChange"
            :checked="isSelected"
            :disabled="questionType === 'short_answer'"
        />
        <div>
            {{ answer?.content }}
        </div>
    </div>
    <div class="d-flex flex-row align-items-center gap-3" v-else>
        <input type="checkbox" v-model="quizAnswerList" size="large" :value="answer?.id" />
        <div>
            {{ answer?.content }}
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { IAnswerDetail, IQuestionDetail } from '../../../constants/course.interfaces';
import { Prop } from 'vue-property-decorator';
import { courseModule } from '@/modules/course/store/course.store';

export default class StudentAnswer extends Vue {
    @Prop({ default: {} }) readonly answer!: IAnswerDetail | null;
    @Prop({ default: {} }) readonly question!: IQuestionDetail;
    @Prop({ default: 0 }) readonly index!: number;

    get questionType(): string {
        return this.question?.type || 'multiple_choice';
    }

    get questionId(): number {
        return this.question?.id || 0;
    }

    get quizAnswerList() {
        return courseModule.quizAnswerList;
    }

    set quizAnswerList(value) {
        courseModule.setQuizAnswerList(value);
    }


    get isSelected(): boolean {
        if (this.questionType === 'short_answer') {
            // Short answer always shows the answer as checked (read-only)
            return true;
        } else if (this.questionType === 'single_choice') {
            const selected = courseModule.getSingleChoiceAnswer(this.questionId);
            return selected === this.answer?.id;
        }
        return false;
    }

    handleRadioChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.checked && this.answer?.id && (this.questionType === 'single_choice' || this.questionType === 'short_answer')) {
            courseModule.setSingleChoiceAnswer(this.questionId, this.answer.id);
        }
    }
}
</script>
