<template>
    <div class="notification">
        <div class="text-decoration-none" style="cursor: pointer">
            <el-dropdown trigger="click" max-height="400px">
                <div
                    class="notification-container d-flex align-items-center justify-content-center"
                    @click="handleGetNotification"
                >
                    <img src="@/assets/common/images/header/notification.svg" alt="" />
                    <span class="notification-number">{{ getUnreadNotification }}</span>
                </div>

                <template #dropdown>
                    <h4 class="mt-3 mx-auto px-3">
                        {{ $t(`common.notification`) }}
                    </h4>

                    <el-dropdown-menu>
                        <div
                            class="notification-wrapper pb-4"
                            v-if="getNotification?.length === 0"
                        >
                            <BaseNoResult
                                :message="$t('common.error.emptyNotificationList')"
                            />
                        </div>
                        <div
                            class="notification-wrapper pb-2"
                            v-if="getNotification?.length !== 0"
                        >
                            <el-dropdown-item v-for="noti in getNotification" :key="noti">
                                <div
                                    class="dropdown-item d-flex align-items-center pb-2"
                                    :style="{
                                        'background-color': !noti.isRead
                                            ? '#ecf5ff'
                                            : 'white',
                                    }"
                                >
                                    <img
                                        :src="noti.avatar"
                                        alt=""
                                        class="avt"
                                        width="40"
                                        height="40"
                                    />

                                    <div class="d-flex flex-column text-wrapper">
                                        <h5 class="dropdown-item-text">
                                            {{ noti.title }}
                                        </h5>
                                        <span class="dropdown-item-text">
                                            {{ noti.description }}
                                        </span>
                                        <div
                                            class="d-flex justify-content-end show-time-notification"
                                        >
                                            {{ noti.created_at }}
                                        </div>
                                        <div
                                            v-if="noti.isShowConfirmButton"
                                            class="mt-2 d-flex align-items-center justify-content-around mx-4"
                                        >
                                            <div
                                                class="text-wrapper-button"
                                                @click="
                                                    handleStudentAction(
                                                        noti.sourceId,
                                                        noti.parentId,
                                                        'add',
                                                        noti.id,
                                                    )
                                                "
                                            >
                                                {{ $t('common.header.accept') }}
                                            </div>
                                            <div
                                                class="text-wrapper-button text-wrapper-reject"
                                                @click="
                                                    handleStudentAction(
                                                        noti.sourceId,
                                                        noti.parentId,
                                                        'reject',
                                                        noti.id,
                                                    )
                                                "
                                            >
                                                {{ $t('common.header.reject') }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-dropdown-item>
                        </div>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { userModule } from '@/modules/user/store/user.store';
import { Vue, Options } from 'vue-class-component';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { getNotificationList, readNotification } from '@/modules/common/services/common';
import { commonModule } from '@/modules/common/store/common.store';
import {
    NotificationType,
    UserCourseStatus,
} from '@/modules/common/constants/common.interfaces';
import { studentAction } from '@/modules/course/services/course';

@Options({})
export default class MenuNotification extends Vue {
    get getUnreadNotification() {
        return userModule?.userData?.unreadNotification || 0;
    }

    async handleGetNotification() {
        let response = await getNotificationList();
        await readNotification();
        if (response.success) {
            commonModule.setNotificationList(response?.data?.items || []);
            userModule.setReadNotification();
        } else {
            let res = response?.errors || [
                { message: this.$t('common.error.systemError') },
            ];
            commonModule.setInstructorList([]);
            showErrorNotificationFunction(res[0].message);
        }
    }

    async handleStudentAction(
        studentId: string,
        courseId: number,
        type: 'reject' | 'add',
        notificationId: number,
    ) {
        if (type === 'add') {
            let response = await studentAction(
                'add',
                courseId,
                studentId,
                notificationId,
            );

            if (response.success) {
                showSuccessNotificationFunction('success');
            } else {
                let res = response?.errors || [
                    { message: this.$t('common.error.systemError') },
                ];

                showErrorNotificationFunction(res[0]?.message);
            }
        } else {
            let response = await studentAction(
                UserCourseStatus.reject,
                courseId,
                studentId,
                notificationId,
            );
            if (response.success) {
                showSuccessNotificationFunction('success');
            } else {
                let res = response?.errors || [
                    { message: this.$t('common.error.systemError') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }

        commonModule.setJoinCourseNotification(notificationId);
    }

    get getNotification() {
        if (!commonModule.notificationList?.length) {
            return [];
        }

        let item = commonModule.notificationList?.map((item) => {
            let { type } = item;
            let isShowConfirmButton = false;

            switch (type) {
                case NotificationType.studentJoinCourseFree: {
                    isShowConfirmButton = true;
                }
            }

            return {
                ...item,
                isShowConfirmButton,
            };
        });

        return item;
    }
}
</script>

<style lang="scss" scoped>
.notification {
    margin-right: 24px;
}

.drop-down {
    border-radius: 100px;
}

.notification-container {
    width: 50px;
    height: 50px;
    position: relative;
    background-color: $color-violet-03;
    border-radius: 50%;
}

.notification-number {
    position: absolute;
    top: 5px;
    right: 0;
    padding: 0 4px;
    font-weight: 600;
    font-size: 9px;
    line-height: 16px;
    color: $color-gray-05;
    background-color: $color-red-02;
    border-radius: 8px;
}
.dropdown-item-text {
    line-height: 22.5px;
    color: $color-gray-02;
    word-wrap: break-word;
    overflow-wrap: break-word;
    width: 100%;
}
.show-time-notification {
    font-size: 11px;
}
.dropdown-item {
    padding: 10px 10px;
    white-space: pre-wrap;
    border-top: 1px solid $color-violet-04;
}
.dropdown-item:hover {
    background-color: var(--el-color-primary);
}
.notification-wrapper {
    max-width: 400px;
    inline-size: 400px;
    overflow-wrap: break-word;
    margin-bottom: 10px;
    .avt {
        border-radius: 50%;
    }
    .text-wrapper {
        overflow-wrap: break-word;
        width: 100%;

        &-button {
            font-size: 17px !important;
            font-weight: 600 !important;
            line-height: 24px !important;
            border-radius: 6px;
            white-space: nowrap;
            padding: 8px 20px;
            transition: all 0.44s ease 0s;
            background-color: $color-violet-new-1;
            border: 1px solid transparent;
            color: $color-white;
            cursor: pointer;
            &:hover {
                color: $color-white;
                background-color: $color-violet-new-opacity-50;
                border: 1px solid $color-violet-new-opacity-50;
            }
        }
        &-reject {
            background-color: $color-red-01;
            &:hover {
                background-color: $color-red-02;
            }
        }
    }
}
.notification-item {
    overflow: hidden;
    word-break: break-all;
    height: 100%;
}
:deep(.el-dropdown-menu__item) {
    white-space: pre-wrap;
}

:deep(.el-dropdown-menu__item:hover) {
    background: none;
}
:deep(.el-dropdown__popper) {
    --el-dropdown-menuItem-hover-fill: none;
    --el-dropdown-menuItem-hover-color: var(--el-color-primary);
}

:deep(.el-dropdown-menu__item:hover) {
    background: transparent !important;
}
</style>
