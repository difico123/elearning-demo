<template>
    <div class="course-p-information d-flex flex-column flex-xl-row w-100">
        <div class="course-p-information-left d-flex flex-column w-100">
            <div class="course-p-title text-ellipsis">
                {{ coursePreviewInformation?.name }}
            </div>
            <div class="course-p-description text-ellipsis">
                {{ coursePreviewInformation?.description }}
            </div>
            <div class="course-p-rating d-flex flex-row pt-3">
                <div v-if="coursePreviewInformation?.avgRating">
                    {{ $t('course.course.avgRating') }}
                </div>
                <div>
                    <span>{{
                        Math.round(coursePreviewInformation?.avgRating * 100) / 100 ||
                        $t('course.course.notRated')
                    }}</span>
                    <img
                        class="mx-1 mb-1"
                        v-if="coursePreviewInformation?.avgRating"
                        src="@/assets/landing/icons/star.svg"
                        width="16"
                        alt=""
                    />
                </div>
            </div>
            <div class="course-p-infos d-flex flex-row justify-content-between pt-3">
                <div class="course-p-instructor">
                    <span>{{
                        $t('course.course.instructor', {
                            instructor: coursePreviewInformation?.username,
                        })
                    }}</span>
                </div>
                <div class="course-p-studentTotal">
                    <span style="padding-right: 2px">
                        {{
                            $t('course.course.studentTotal', {
                                studentTotal: coursePreviewInformation?.studentTotal || 0,
                            })
                        }}
                    </span>
                    <img src="@/assets/common/images/user.svg" width="20" alt="" />
                </div>
            </div>
        </div>
        <div class="course-p-information-right d-flex flex-column align-items-center">
            <div class="course-p-image">
                <img :src="coursePreviewInformation?.image" alt="" />
            </div>
            <div class="course-p-action d-flex flex-row">
                <div
                    @click="handleAccessCourse(actionKey)"
                    v-if="actionKey === 0"
                    style="width: 100%"
                >
                    <div
                        v-if="coursePreviewInformation?.price"
                        :style="{
                            'background-color': getPriceBackgroundColor(
                                coursePreviewInformation?.price,
                            ),
                        }"
                    >
                        {{
                            $t('course.course.price', {
                                price: coursePreviewInformation?.price,
                            })
                        }}
                    </div>
                    <div v-else style="background-color: #3bb143">
                        {{ $t('course.course.free') }}
                    </div>
                </div>
                <div
                    @click="handleAccessCourse(actionKey)"
                    class="course-p-action d-flex flex-row"
                    v-else
                >
                    <div
                        style="width: 100%"
                        :style="[
                            { 'background-color': getActionBackgroundColor(actionKey) },
                            { color: getActionTextColor(actionKey) },
                            {
                                cursor:
                                    actionKey === 0 || actionKey === 1
                                        ? 'pointer'
                                        : 'not-allowed',
                            },
                        ]"
                    >
                        {{ getActionText(actionKey) }}
                    </div>
                </div>
                <div
                    class="course-p-favorite"
                    style="width: 25%"
                    :style="{
                        'background-color': isFavoriteCourse ? '#ff647c99' : '#fff',
                    }"
                    @click="handleToggleFavorite"
                    v-if="isShowFavorite"
                >
                    <img src="@/assets/course/icons/heart.svg" width="25" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PageName, SystemRole } from '@/common/constants';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import localStorageTokenService from '@/common/tokenService';
import { loginModule } from '@/modules/auth/store/login.store';
import { commonModule } from '@/modules/common/store/common.store';
import { userModule } from '@/modules/user/store/user.store';
import socketInstance from '@/plugins/socket';
import { Options, Vue } from 'vue-class-component';
import { UserCourseStatus } from '../../constants/course.constants';
import { getPriceBackgroundColor } from '../../helpers/commonFunctions';
import { courseCheckout, toggleCourseFavorite } from '../../services/user-course';
import { courseModule } from '../../store/course.store';
import { userCourseModule } from '../../store/user-course.store';

@Options({
    components: {},
})
export default class CoursePreviewTopic extends Vue {
    UserCourseStatus = UserCourseStatus;
    get coursePreviewInformation() {
        return courseModule.coursePreviewData?.course;
    }

    get userCourseData() {
        return userCourseModule.userCourseData;
    }

    get userData() {
        return userModule.userData;
    }
    get isShowFavorite() {
        return userModule.userData.role === SystemRole.STUDENT;
    }

    get isCourseOwner() {
        return this.coursePreviewInformation?.instructorId == this.userData.id;
    }

    get isFavoriteCourse() {
        return userCourseModule.favoriteCourse;
    }

    get courseStatus() {
        return userCourseModule.userCourseData.status;
    }

    get actionKey() {
        switch (userCourseModule.userCourseData.status) {
            case UserCourseStatus.STUDENT:
            case UserCourseStatus.GUEST:
                return 0;
            case UserCourseStatus.ADMIN:
            case UserCourseStatus.ACCEPTED:
            case UserCourseStatus.COMMENT_BLOCKED:
                return 1;
            case UserCourseStatus.INSTRUCTOR:
                if (this.isCourseOwner) return 1;
                else return 2;
            case UserCourseStatus.REJECTED:
                return 3;
            case UserCourseStatus.EXPIRED:
                return 4;
            case UserCourseStatus.PENDING:
                return 5;
            default:
                return 0;
        }
    }

    getActionText(action: number) {
        if (action === 1) return this.$t('course.course.actionList.goToCourse');
        if (action === 2) return this.$t('course.course.actionList.notOwnedCourse');
        if (action === 3) return this.$t('course.course.actionList.rejectedCourse');
        if (action === 4) return this.$t('course.course.actionList.expiredCourse');
        if (action === 5) return this.$t('course.course.actionList.pendingCourse');
    }

    getActionBackgroundColor(action: number) {
        if (action === 1) return '#3bb143';
        if (action === 3) return '#ff647c';
        return '#8f919f';
    }

    getActionTextColor(action: number) {
        if (action === 1) return '#ffffff';
        return '#000000';
    }

    async courseCheckout() {
        commonModule.setLoadingIndicator(true);
        const id: number = +this.$route.params.courseId;
        const response = await courseCheckout(id);
        if (response.success) {
            if (response.data?.url) {
                showSuccessNotificationFunction(
                    this.$t('course.success.courseCheckout.paidCourse'),
                );
                setTimeout(() => (window.location.href = `${response.data?.url}`), 1000);
            } else {
                this.$emit('reload-course-status');
                showSuccessNotificationFunction(
                    this.$t('course.success.courseCheckout.freeCourse'),
                );
                socketInstance.sendNotification(
                    this.userCourseData?.instructorId || '',
                    this.$t('common.notification'),
                    this.$t('common.studentJoinCourse'),
                );
            }
        } else {
            let res = response?.errors || [
                {
                    message: this.$t('course.errors.checkoutError'),
                },
            ];
            userCourseModule.setFavoriteCourse(this.userCourseData?.favorite || false);
            showErrorNotificationFunction(res[0].message);
        }
    }

    async handleLogout() {
        commonModule.setLoadingIndicator(true);
        userModule.setUserData({});
        loginModule.setAccessToken('');
        loginModule.setLoginState(false);
        localStorageTokenService.resetAll();
        localStorageTokenService.setLoginUser({});
        socketInstance.disconnect();
        this.$router.push({
            name: PageName.LOGIN_PAGE,
        });
        commonModule.setLoadingIndicator(false);
    }

    getPriceBackgroundColor(price: number) {
        return getPriceBackgroundColor(price);
    }

    async handleAccessCourse(actionKey: number) {
        console.log(userCourseModule.userCourseData.status);
        if (actionKey === 0) {
            if (loginModule.accessToken == '') {
                showErrorNotificationFunction(this.$t('course.errors.notLoggedIn'));
                await this.handleLogout();
            }
            if (this.courseStatus === UserCourseStatus.GUEST) {
                showErrorNotificationFunction(this.$t('course.errors.chooseRole'));
                setTimeout(
                    () => this.$router.push({ name: PageName.SELECT_ROLE_PAGE }),
                    2000,
                );
            } else {
                await this.courseCheckout();
            }
        }
        if (actionKey === 1) {
            const id = this.$route.params.id;
            this.$router.push({ name: PageName.COURSE_DETAIL_PAGE, params: { id } });
        }
    }

    async handleToggleFavorite() {
        if (!loginModule.accessToken) {
            this.$router.push({ name: PageName.LOGIN_PAGE });
        } else {
            commonModule.setLoadingIndicator(true);
            const id: number = +this.$route.params.courseId;
            const response = await toggleCourseFavorite(id);
            if (response.success) {
                userCourseModule.setFavoriteCourse(response?.data?.favorite || false);
                if (response.data?.favorite)
                    showSuccessNotificationFunction(
                        this.$t('course.success.favoriteCourse.add'),
                    );
                else
                    showSuccessNotificationFunction(
                        this.$t('course.success.favoriteCourse.remove'),
                    );
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.toggleFavoriteError') },
                ];
                userCourseModule.setFavoriteCourse(
                    this.userCourseData?.favorite || false,
                );
                showErrorNotificationFunction(res[0].message);
            }
            commonModule.setLoadingIndicator(false);
        }
    }
}
</script>
<style lang="scss" scoped>
.course-p-information {
    padding: 5vh 5vw;
    gap: 5vw;
    border-radius: 12px;
    justify-content: space-between;
    background-color: #1b2838;
    color: $color-white;
}

.course-p {
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

.text-ellipsis {
    max-width: 80%;
    display: block;
    display: -webkit-box;
    line-height: 150%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xl)) {
    .course-p {
        &-image {
            img {
                width: 50vw;
            }
        }
        &-title {
            font-size: 24px;
            font-weight: 600;
            height: 72px;
        }

        &-description {
            font-size: 16px;
            font-weight: 500;
            height: 48px;
        }

        &-price {
            width: 50vw !important;
        }

        &-infos {
            width: 100%;
        }
    }
    .text-ellipsis {
        max-width: 100% !important;
        display: block;
        display: -webkit-box;
        line-height: 150%;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
</style>
