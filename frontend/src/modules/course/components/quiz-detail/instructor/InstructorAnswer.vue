<template>
    <div class="d-flex flex-row align-items-center gap-3">
        <template v-if="questionType === 'short_answer'">
            <div class="short-answer-display">
                <span class="correct-answer-label">{{ $t('course.quiz.questionType.correctAnswer') }}:</span>
                <span>{{ answer.content ? answer.content : '—' }}</span>
            </div>
        </template>
        <template v-else>
            <input
                v-if="questionType === 'single_choice'"
                type="radio"
                :checked="answer.isCorrect"
                disabled
            />
            <el-checkbox v-else-if="questionType === 'multiple_choice'" :model-value="answer.isCorrect" disabled />
            <div>{{ answer.content ? answer.content : '—' }}</div>
        </template>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { IAnswerDetail, IQuestionDetail } from '../../../constants/course.interfaces';
import { Prop } from 'vue-property-decorator';

export default class InstructorAnswer extends Vue {
    @Prop({ default: {} }) readonly answer!: IAnswerDetail;
    @Prop({ default: {} }) readonly question!: IQuestionDetail;
    @Prop({ default: 0 }) readonly index!: number;
    @Prop({ default: false }) readonly isEdit!: false;

    get questionType(): string {
        return this.question?.type || 'multiple_choice';
    }
}
</script>

<style lang="scss" scoped>
.short-answer-display {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    
    .correct-answer-label {
        font-weight: 600;
        color: #409eff;
    }
}
</style>
