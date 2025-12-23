<template>
    <div class="question-card d-flex flex-row gap-3 pb-2">
        <div class="d-flex flex-row gap-4">
            <span>{{ `${$t('course.quiz.field.question')} ${index + 1}:` }}</span>
            <span>{{ question?.name }}</span>
            <span>{{ $t('course.quiz.form.mark', { mark: question?.mark }) }}</span>
        </div>
    </div>
    <div class="answer-wrapper px-3" v-if="question?.type === 'short_answer'">
        <StudentAnswer 
            :answer="question.answerList && question.answerList[0] ? question.answerList[0] : null" 
            :question="question"
            :index="0" 
        />
    </div>
    <div class="answer-wrapper px-3" v-else-if="question?.type === 'single_choice'">
        <div
            class="answer-card d-flex flex-row gap-3"
            v-for="(answer, index) in question?.answerList"
            :key="index"
        >
            <StudentAnswer :answer="answer" :question="question" :index="index" />
        </div>
    </div>
    <div class="answer-wrapper px-3" v-else>
        <div
            class="answer-card d-flex flex-row gap-3"
            v-for="(answer, index) in question?.answerList"
            :key="index"
        >
            <StudentAnswer :answer="answer" :question="question" :index="index" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { IQuestionDetail } from '../../../constants/course.interfaces';
import { Prop } from 'vue-property-decorator';
import StudentAnswer from './StudentAnswer.vue';

@Options({
    components: { StudentAnswer },
})
export default class StudentQuestion extends Vue {
    @Prop({ default: {} }) readonly question!: IQuestionDetail;
    @Prop({ default: 0 }) readonly index!: number;
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
