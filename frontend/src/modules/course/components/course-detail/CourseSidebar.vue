<template>
    <div class="course-sidebar-wrapper d-flex flex-column justify-content-between">
        <div class="d-flex flex-column">
            <div
                class="sidebar-button collapse-toggle"
                style="background-color: #e6e6f0; height: 48px"
                :class="{ collapsed: isCollapsed }"
                @click="handleToggleSidebar"
            >
                <div v-if="!isCollapsed" class="d-flex justify-content-end w-100">
                    <img src="@/assets/course/icons/collapse.png" width="24" alt="" />
                </div>

                <img v-else src="@/assets/course/icons/expand.png" width="24" alt="" />
            </div>
            <div
                class="sidebar-button"
                :class="{ collapsed: isCollapsed }"
                :style="{
                    'background-color':
                        courseArea === CourseArea.COURSE ? '#6d79e8' : '#4057d0',
                }"
                @click="setCourseArea(CourseArea.COURSE)"
            >
                <div>
                    <span v-if="!isCollapsed">{{
                        $t('course.courseSidebar.courseDetail')
                    }}</span>
                    <img
                        v-else
                        src="@/assets/course/icons/course-detail.png"
                        width="24"
                        alt=""
                    />
                </div>
            </div>
            <div
                class="sidebar-button"
                :class="{ collapsed: isCollapsed }"
                :style="{
                    'background-color':
                        courseArea === CourseArea.QUIZ ? '#6d79e8' : '#4057d0',
                }"
                @click="setCourseArea(CourseArea.QUIZ)"
            >
                <div>
                    <span v-if="!isCollapsed">
                        {{ $t('course.courseSidebar.quiz') }}</span
                    >
                    <img v-else src="@/assets/course/icons/quiz.png" width="24" alt="" />
                </div>
            </div>
            <div
                v-if="userRole === SystemRole.INSTRUCTOR"
                @click="showStudentListPopup"
                :class="{ collapsed: isCollapsed }"
                class="sidebar-button"
            >
                <div>
                    <span v-if="!isCollapsed">
                        {{ $t('course.courseSidebar.studentList') }}</span
                    >
                    <img
                        v-else
                        src="@/assets/course/icons/student-list.png"
                        width="24"
                        alt=""
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PageName, SupportLanguage, SystemRole } from '@/common/constants';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { commonModule } from '@/modules/common/store/common.store';
import { userModule } from '@/modules/user/store/user.store';
import { Options, Vue } from 'vue-class-component';
import { CourseArea, SidebarMode } from '../../constants/course.constants';
import {
    deleteCourse,
    getTopicList,
    updateCourse,
    updateTopic,
} from '../../services/course';
import { courseModule } from '../../store/course.store';
import { ElMessageBox } from 'element-plus';
import { appModule } from '@/plugins/vuex/appModule';

@Options({
    components: {},
})
export default class CourseSidebar extends Vue {
    SystemRole = SystemRole;
    CourseArea = CourseArea;

    get currentLanguage() {
        return appModule.currentLanguage;
    }

    get isShowStudentListPopup() {
        return commonModule.isShowStudentListPopup;
    }

    get userRole() {
        return userModule.userData.role;
    }

    get courseArea() {
        return courseModule.courseArea;
    }

    get courseSidebarMode() {
        return courseModule.courseSidebarMode;
    }

    get isCollapsed() {
        return this.courseSidebarMode === SidebarMode.COLLAPSED;
    }

    get courseState() {
        return courseModule.coursePreviewData?.course?.isPublished;
    }

    showStudentListPopup() {
        commonModule.toggleShowStudentListPopup(true);
    }

    setCourseArea(area: string) {
        courseModule.setCourseArea(area);
    }

    handleToggleSidebar() {
        if (this.courseSidebarMode === SidebarMode.EXPANDED) {
            courseModule.setCourseSidebarMode(SidebarMode.COLLAPSED);
        } else {
            courseModule.setCourseSidebarMode(SidebarMode.EXPANDED);
        }
    }

    created(): void {
        window.addEventListener('resize', this.showFullScreenOnMobile);
        this.showFullScreenOnMobile();
    }
    showFullScreenOnMobile() {
        if (document.documentElement.clientWidth <= 800) {
            courseModule.setCourseSidebarMode(SidebarMode.COLLAPSED);
        }
    }

    showDeletePopup() {
        ElMessageBox.confirm(
            this.currentLanguage === SupportLanguage.VI
                ? 'Bạn có chắc chắn muốn xóa khóa học này không?'
                : 'Are you sure you want to delete this course?',
        ).then(() => {
            return this.handleDeleteCourse();
        });
    }

    async handleDeleteCourse() {
        const courseId = +this.$route.params.courseId;
        console.log(courseId);
        commonModule.setLoadingIndicator(true);
        const response = await deleteCourse(courseId);
        if (response.success) {
            showSuccessNotificationFunction(this.$t('course.success.deleteCourse'));
            setTimeout(
                () =>
                    this.$router.push({
                        name: PageName.USER_COURSE_LIST_PAGE,
                    }),
                2000,
            );
        } else {
            showErrorNotificationFunction(this.$t('course.errors.deleteCourse'));
        }
        commonModule.setLoadingIndicator(false);
    }

    async toggleCourseState(state: boolean) {
        commonModule.setLoadingIndicator(true);
        let formData = new FormData();
        const courseId = +this.$route.params.courseId;

        formData.append('isPublished', state.toString());
        const response = await updateCourse(formData, courseId);
        if (response.success) {
            showSuccessNotificationFunction(this.$t('course.success.toggleCourse'));
            await this.$emit('reload');
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.toggleCourse') },
            ];
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }
}
</script>
<style lang="scss" scoped>
.course-sidebar-wrapper {
    min-height: 169px;
    background-color: $color-violet-new;
}
.sidebar-button {
    width: 240px;
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    white-space: nowrap;
    padding: 12px 24px;
    transition: all 0.6s ease 0s;
    cursor: pointer;
    color: $color-white;
    &:hover {
        background-color: #5868d9 !important;
    }
}

.collapsed {
    display: flex;
    width: 60px;
    padding: 12px 0;
    justify-content: center !important;
}

.collapse-toggle {
    &:hover {
        background-color: #e6e6f0 !important;
    }
}

.delete-course-button {
    background-color: red;
    &:hover {
        background-color: #ff2200 !important;
    }
}

.suspend-course-button {
    background-color: #ff6700;
    &:hover {
        background-color: #ff8800 !important;
    }
}

.activate-course-button {
    color: $color-white;
    background-color: #5ced73;
    &:hover {
        background-color: #83f28f !important;
    }
}
</style>
