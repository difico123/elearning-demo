<template>
    <div class="d-flex flex-row align-items-center gap-3">
        <input type="checkbox" v-model="quizAnswerList" size="large" :value="answer.id" />
        <div>
            {{ answer?.content }}
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { IAnswerDetail } from '../../../constants/course.interfaces';
import { Prop } from 'vue-property-decorator';
import { courseModule } from '@/modules/course/store/course.store';

export default class StudentAnswer extends Vue {
    @Prop({ default: {} }) readonly answer!: IAnswerDetail;
    @Prop({ default: 0 }) readonly index!: number;

    get quizAnswerList() {
        return courseModule.quizAnswerList;
    }

    set quizAnswerList(value) {
        courseModule.setQuizAnswerList(value);
    }
}
</script>
