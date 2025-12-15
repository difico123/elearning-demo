<template>
    <div class="d-flex flex-row align-items-center gap-3">
        <el-checkbox :model-value="answer.isCorrect" disabled />
        <div>{{ answer.content ? answer.content : '—' }}</div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { IAnswerDetail } from '../../../constants/course.interfaces';
import { Prop } from 'vue-property-decorator';

export default class InstructorAnswer extends Vue {
    @Prop({ default: {} }) readonly answer!: IAnswerDetail;
    @Prop({ default: 0 }) readonly index!: number;
    @Prop({ default: false }) readonly isEdit!: false;
}
</script>
