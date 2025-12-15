<template>
    <div class="quiz-detail-wrapper d-flex flex-column gap-4 w-100">
        <div v-if="quizList && quizList.length === 0">
            {{ $t('course.errors.emptyQuizList') }}
        </div>

        <div class="quiz-card" v-for="quiz in quizList" :key="quiz.id">
            <StudentQuiz :quiz="quiz" isShowTitle="true" />
        </div>
    </div>
</template>

<script lang="ts">
import { SystemRole } from '@/common/constants';
import { Options, Vue } from 'vue-class-component';
import { IQuizDetail } from '../../constants/course.interfaces';
import { courseModule } from '../../store/course.store';
import StudentQuiz from '../quiz-detail/student/StudentQuiz.vue';
import { getQuizList } from '../../services/course';
import { showErrorNotificationFunction } from '@/common/helpers';
@Options({
    components: { StudentQuiz },
})
export default class StudentQuizDetail extends Vue {
    SystemRole = SystemRole;

    get topicId() {
        return courseModule.topicId;
    }

    get quizList(): Array<IQuizDetail> {
        return courseModule.quizList;
    }

    get quizAnswerList() {
        return courseModule.quizAnswerList;
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
}
</script>
<style lang="scss" scoped>
.quiz-detail {
    &-wrapper {
        margin: 4vh 3vw;
    }
}
</style>
