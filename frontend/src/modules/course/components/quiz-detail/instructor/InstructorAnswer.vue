<template>
    <div class="d-flex flex-row align-items-center gap-3">
        <el-checkbox @change="toggleCheckbox" v-model="answer.isCorrect" size="large" />
        <div v-if="!isEditingAnswer">
            {{ answer.content ? answer.content : 'Add your answer' }}
        </div>
        <el-input
            :placeholder="$t('course.quiz.form.title')"
            v-model="answer.content"
            @change="toggleEditAnswer"
            autocomplete="off"
            v-else
        />
        <div class="d-flex flex-row gap-2" v-if="!isEdit">
            <img
                src="@/assets/course/icons/edit.svg"
                width="16"
                alt=""
                style="cursor: pointer"
                @click="toggleEditAnswer"
            />
            <img
                v-if="!isEditingAnswer"
                src="@/assets/course/icons/cancel.svg"
                width="16"
                alt=""
                style="cursor: pointer"
                @click="handleDeleteAnswer"
            />
        </div>
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

    isEditingAnswer = false;

    toggleEditAnswer() {
        this.isEditingAnswer = !this.isEditingAnswer;
        if (!this.isEditingAnswer) {
            this.$emit('edit-answer', this.answer);
        }
    }

    toggleCheckbox() {
        this.$emit('edit-answer', this.answer);
    }

    handleDeleteAnswer() {
        this.$emit('delete-answer', this.answer, this.index);
    }
}
</script>
