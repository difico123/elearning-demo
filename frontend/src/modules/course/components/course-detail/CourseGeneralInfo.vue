<template>
    <div class="course-information d-flex flex-column flex-xl-row w-100">
        <div class="course-info-information-left d-flex flex-column w-100">
            <div class="course-info-title text-ellipsis">
                {{ courseInfo?.name }}
            </div>
            <div class="course-info-description text-ellipsis">
                {{ courseInfo?.description }}
            </div>
            <div class="course-info-rating d-flex flex-row pt-3">
                <div v-if="courseInfo?.avgRating">
                    <span v-if="userRole === SystemRole.STUDENT">{{
                        $t('course.course.selfRating')
                    }}</span>
                    <span v-if="userRole === SystemRole.INSTRUCTOR">{{
                        $t('course.course.avgRating')
                    }}</span>
                </div>

                <div v-if="userRole === SystemRole.INSTRUCTOR">
                    <span>{{
                        Math.round(courseInfo?.avgRating * 100) / 100 ||
                        $t('course.course.notRated')
                    }}</span>
                    <img
                        class="mx-1 mb-1"
                        v-if="courseInfo?.avgRating"
                        src="@/assets/landing/icons/star.svg"
                        width="16"
                        alt=""
                    />
                </div>
                <div class="d-flex flex-row" v-if="userRole === SystemRole.STUDENT">
                    <div v-for="index in 5" :key="index">
                        <img
                            @click="rateCourse(index)"
                            class="mb-1 star"
                            :class="{ 'star-color-white': index > courseRating }"
                            src="@/assets/landing/icons/star.svg"
                            width="16"
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div class="course-info-infos d-flex flex-row justify-content-between pt-3">
                <div class="course-info-instructor">
                    <span>{{
                        $t('course.course.instructor', {
                            instructor: courseInfo?.username,
                        })
                    }}</span>
                </div>
                <div class="course-info-studentTotal">
                    <span style="padding-right: 2px">
                        {{
                            $t('course.course.studentTotal', {
                                studentTotal: courseInfo?.studentTotal || 0,
                            })
                        }}
                    </span>
                    <img src="@/assets/common/images/user.svg" width="20" alt="" />
                </div>
            </div>
            <div v-if="userRole === SystemRole.INSTRUCTOR" class="course-actions pt-4">
                <button
                    class="course-action-button delete-course"
                    type="button"
                    @click="showDeletePopup"
                >
                    {{ $t('course.courseSidebar.deleteCourse') }}
                </button>
                <button
                    class="course-action-button toggle-course"
                    :class="courseState ? 'suspend-course' : 'activate-course'"
                    type="button"
                    @click="toggleCourseState(!courseState)"
                >
                    {{
                        courseState
                            ? $t('course.courseSidebar.suspendCourse')
                            : $t('course.courseSidebar.activateCourse')
                    }}
                </button>
            </div>
        </div>
        <div class="course-info-information-right d-flex flex-column align-items-center">
            <div class="course-info-image">
                <img :src="courseInfo?.image" alt="" />
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
import localStorageTokenService from '@/common/tokenService';
import { commonModule } from '@/modules/common/store/common.store';
import { appModule } from '@/plugins/vuex/appModule';
import { userModule } from '@/modules/user/store/user.store';
import { Options, Vue } from 'vue-class-component';
import { deleteCourse, rateCourse, updateCourse } from '../../services/course';
import { getUserCourseData } from '../../services/user-course';
import { courseModule } from '../../store/course.store';
import { userCourseModule } from '../../store/user-course.store';
import { ElMessageBox } from 'element-plus';

@Options({
    components: {},
})
export default class CourseGeneralInfo extends Vue {
    get courseInfo() {
        return courseModule.coursePreviewData?.course;
    }

    SystemRole = SystemRole;
    get userRole() {
        return userModule.userData.role;
    }

    get courseRating() {
        return userCourseModule.userCourseData.rating;
    }

    get courseState() {
        return courseModule.coursePreviewData?.course?.isPublished;
    }

    get currentLanguage() {
        return appModule.currentLanguage;
    }

    created() {
        if (!localStorageTokenService.getAccessToken()) {
            this.$router.push({ name: PageName.LOGIN_PAGE });
        }
    }

    async rateCourse(rating: number) {
        commonModule.setLoadingIndicator(true);
        const id: number = +this.$route.params.courseId;
        const response = await rateCourse(id, rating + '');
        if (response?.success) {
            await this.getUserCourseData();
            showSuccessNotificationFunction(this.$t('course.success.leaveRating'));
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.leaveRatingError') },
            ];
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async getUserCourseData() {
        const id: number = +this.$route.params.courseId;
        const response = await getUserCourseData(id);
        if (response?.success) {
            userCourseModule.setUserCourseData(response?.data || {});
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getCoursePreviewDataError') },
            ];
            userCourseModule.setUserCourseData({});
            showErrorNotificationFunction(res[0].message);
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
.course-information {
    padding: 6vh 10vw;
    gap: 5vw;
    justify-content: space-between;
    background-color: #1b2838;
    color: $color-white;
}

.course-info {
    &-title {
        font-size: 27px;
        font-weight: 600;
        height: 122px;
    }

    &-description {
        font-size: 18px;
        font-weight: 500;
        height: 81px;
    }

    &-image {
        img {
            width: 30vw;
            aspect-ratio: 16 / 9;
        }
    }
    &-infos {
        width: 80%;
    }
    &-action {
        text-align: center;
        width: 100%;
        line-height: 40px;
        cursor: pointer;
    }
}

.course-info-instructor {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.star {
    cursor: pointer;
}

.star-color-white {
    filter: invert(100%) sepia(7%) saturate(0%) hue-rotate(274deg) brightness(102%)
        contrast(103%);
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xl)) {
    .course-info-image {
        img {
            width: 70vw;
        }
    }

    .course-information {
        gap: 30px;
    }
}

.course-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 16px;
    font-weight: 600;
    color: $color-white;
}

.course-action-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
}

.course-action-button:focus {
    outline: none;
}

.delete-course {
    color: #ff0000;
}

.suspend-course {
    color: #ff6700;
}

.activate-course {
    color: #5ced73;
}
</style>
