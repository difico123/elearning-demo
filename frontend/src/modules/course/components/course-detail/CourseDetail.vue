<template>
    <div class="course-detail-wrapper d-flex flex-column w-100">
        <CourseGeneralInfo />
        <div class="course-detail d-flex flex-row">
            <CourseSidebar @reload="getCourseGeneralInfo" />
            <div class="d-flex flex-row w-100" v-if="courseArea === CourseArea.COURSE">
                <TopicSidebar />
                <TopicDetail />
            </div>
            <div class="d-flex flex-row w-100" v-if="courseArea === CourseArea.QUIZ">
                <QuizSidebar />
                <InstructorQuizDetail v-if="userRole === SystemRole.INSTRUCTOR" />
                <StudentQuizDetail v-if="userRole === SystemRole.STUDENT" />
            </div>
        </div>
        <CourseStudentListPopup v-if="isShowStudentListPopup" />
        <TopicFormPopup v-if="isShowTopicFormPopup" />
    </div>
</template>

<script lang="ts">
import localStorageTokenService from '@/common/tokenService';
import { PageName, SystemRole } from '@/common/constants';
import { commonModule } from '@/modules/common/store/common.store';
import { userModule } from '@/modules/user/store/user.store';
import { Options, Vue } from 'vue-class-component';
import { courseModule } from '../../store/course.store';
import { getCoursePreviewData, getTopicList } from '../../services/course';
import { showErrorNotificationFunction } from '@/common/helpers';
import { CourseArea } from '../../constants/course.constants';

import CourseStudentListPopup from './CourseStudentListPopup.vue';
import CourseSidebar from './CourseSidebar.vue';
import TopicSidebar from './TopicSidebar.vue';
import TopicDetail from './TopicDetail.vue';
import CourseGeneralInfo from './CourseGeneralInfo.vue';
import TopicFormPopup from './TopicFormPopup.vue';
import InstructorQuizDetail from '../quiz-detail/InstructorQuizDetail.vue';
import StudentQuizDetail from '../quiz-detail/StudentQuizDetail.vue';
import QuizSidebar from '../quiz-detail/QuizSidebar.vue';

@Options({
    components: {
        CourseSidebar,
        CourseStudentListPopup,
        TopicSidebar,
        TopicDetail,
        CourseGeneralInfo,
        TopicFormPopup,
        InstructorQuizDetail,
        StudentQuizDetail,
        QuizSidebar,
    },
})
export default class CourseDetail extends Vue {
    SystemRole = SystemRole;

    CourseArea = CourseArea;

    get courseArea() {
        return courseModule.courseArea;
    }

    get isShowStudentListPopup() {
        return commonModule.isShowStudentListPopup;
    }

    get isShowTopicFormPopup() {
        return courseModule.isShowTopicFormPopup;
    }

    get isShowChatPopup() {
        return commonModule.isShowChatPopup;
    }

    get userRole() {
        return userModule.userData.role;
    }

    async getCourseGeneralInfo() {
        const id: number = +this.$route.params.courseId;
        const response = await getCoursePreviewData(id);
        if (response?.success) {
            courseModule.setCoursePreviewData(response?.data || {});
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getCoursePreviewError') },
            ];
            courseModule.setCoursePreviewData({});
            showErrorNotificationFunction(res[0].message);
        }
    }

    async getTopicList() {
        const id: number = +this.$route.params.courseId;
        const response = await getTopicList(id);
        if (response.success) {
            courseModule.setTopicList(response?.data?.items || []);
            if (response?.data?.items && response?.data?.items.length > 0) {
                const firstTopic = response.data.items[0];
                courseModule.setSelectedTopic(firstTopic);
                courseModule.setTopicId(firstTopic.id as number);
                courseModule.setCurrentChatTopicId(firstTopic?.id || -1);
            } else {
                courseModule.setSelectedTopicObject({});
                courseModule.setTopicId(-1);
            }
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getTopicListError') },
            ];
            courseModule.setTopicList([]);
            courseModule.setTopicId(-1);
            showErrorNotificationFunction(res[0].message);
        }
    }

    async initCourseDetail() {
        commonModule.setLoadingIndicator(true);
        await this.getCourseGeneralInfo();
        await this.getTopicList();
        commonModule.setLoadingIndicator(false);
    }

    async created() {
        if (!localStorageTokenService.getAccessToken()) {
            this.$router.push({ name: PageName.LOGIN_PAGE });
        } else {
            await this.initCourseDetail();
        }
    }
}
</script>
<style lang="scss" scoped></style>
