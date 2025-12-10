<template>
    <div class="landing-wrapper">
        <div class="mb-4">
            <el-dropdown trigger="click">
                <div
                    class="d-flex align-items-center justify-content-center notification-container-wrapper"
                >
                    <div
                        class="notification-container d-flex align-items-center justify-content-center"
                    >
                        <img
                            src="@/assets/common/images/user-group.svg"
                            alt=""
                            :width="30"
                        />
                        <span class="notification-number">{{
                            getUserOnline?.length
                        }}</span>
                    </div>
                    <div class="notification-text mx-2">{{ $t('common.online') }}</div>
                </div>

                <template #dropdown>
                    <el-dropdown-menu>
                        <div
                            class="notification-wrapper"
                            v-if="getUserOnline?.length !== 0"
                        >
                            <el-dropdown-item
                                v-for="user in getUserOnline"
                                :key="user.userID"
                            >
                                <div class="dropdown-item d-flex align-items-center pb-2">
                                    <div class="point" />
                                    <div :class="user.role">
                                        <div :class="`${user.role}-text`">
                                            {{ roleName(user.role) }}
                                        </div>
                                    </div>
                                    <div :class="`${user.role}-des`">
                                        {{ user.username }}
                                    </div>
                                </div>
                            </el-dropdown-item>
                        </div>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <Categories />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Categories from '@/modules/landing/components/MainCategories.vue';
import { userModule } from '@/modules/user/store/user.store';
import { Role } from '@/modules/common/constants/common.interfaces';

@Options({
    components: { Categories },
})
export default class LandingPage extends Vue {
    get getUserOnline() {
        return userModule.userOnlineList || [];
    }

    roleName(role: Role) {
        return this.$t(`common.role.${role}`);
    }
}
</script>
<style lang="scss" scoped>
.notification-number {
    position: absolute;
    top: 5px;
    right: 0;
    padding: 0 4px;
    font-weight: 600;
    font-size: 9px;
    line-height: 16px;
    color: $color-gray-05;
    background-color: $color-green;
    border-radius: 8px;
}
.notification-container {
    width: 50px;
    height: 50px;
    position: relative;
}

:deep(.el-dropdown-menu__item:hover) {
    background: none;
}
:deep(.el-dropdown-menu) {
    padding: 0 0;
}
:deep(.el-dropdown__popper) {
    --el-dropdown-menuItem-hover-fill: none;
    --el-dropdown-menuItem-hover-color: var(--el-color-primary);
}

:deep(.el-dropdown-menu__item:hover) {
    background: transparent !important;
}
:deep(.el-dropdown-menu__item) {
    padding: unset !important;
}
.notification-container-wrapper {
    background-color: $color-violet-03;
    border-radius: 10%;
    padding: 4px 8px;
    cursor: pointer;
    &-text {
        text-align: center;
    }
}
.instructor {
    background-color: $yellow-orange;
    padding: 0 4px;
    border-radius: 4px;
    min-width: 90px;
    margin-right: 5px;
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    &-text {
        text-align: center;
        color: white;
    }
    &-des {
        font-weight: 600;
    }
}
.student {
    background-color: $color-red-01;
    padding: 0 2px;
    margin-right: 5px;
    border-radius: 4px;
    min-width: 90px;
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    &-text {
        text-align: center;
        color: white;
    }
    &-des {
        font-weight: 600;
    }
}

:deep(.dropdown-item:focus, .dropdown-item:hover) {
    color: #1e2125;
    background-color: none;
}
.notification-text {
    font-weight: 600;
    font-size: 20px;
}
.notification-wrapper {
    overflow-wrap: break-word;

    .point {
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background-color: $color-green;
        margin-right: 10px;
    }

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
</style>
