<template>
    <div class="question-card d-flex flex-row gap-3 pb-2">
        <div class="d-flex flex-row gap-4">
            <span>{{ `${$t('course.quiz.field.question')} ${index + 1}:` }}</span>
            <span>{{ question?.name }}</span>
            <span>{{ $t('course.quiz.form.mark', { mark: question?.mark }) }}</span>
        </div>
    </div>
    <div class="answer-wrapper px-3">
        <div
            class="answer-card d-flex flex-row gap-3"
            v-for="(answer, index) in question?.answerList"
            :key="index"
        >
            <StudentAnswer :answer="answer" :index="index" />
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
