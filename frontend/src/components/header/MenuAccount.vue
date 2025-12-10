<template>
    <div class="d-flex flex-row align-items-center">
        <el-dropdown trigger="click" :hide-on-click="true">
            <div class="d-flex flex-row align-items-center" style="cursor: pointer">
                <img
                    v-if="userImage"
                    class="user-avatar"
                    width="50px"
                    :src="userImage"
                    alt=""
                />
                <div
                    v-else
                    class="user-avatar default-avatar d-flex justify-content-center align-items-center"
                    :style="{ 'background-color': defaultAvatarColor }"
                >
                    <span>{{ defaultAvatarName }}</span>
                </div>
                <span class="name text-ellipsis">{{ userName || 'Anonymous' }}</span>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>
                        <router-link
                            class="dropdown-item-link text-decoration-none"
                            :to="{ name: PageName.USER_PROFILE_PAGE }"
                        >
                            <div class="dropdown-item d-flex flex-row align-items-center">
                                <div class="dropdown-item-icon-container">
                                    <img
                                        class="dropdown-item-icon"
                                        src="@/assets/common/icons/header/header-profile.svg"
                                        alt=""
                                    />
                                </div>
                                <span class="dropdown-item-text">
                                    {{ $t('common.header.dropdownProfile') }}
                                </span>
                            </div>
                        </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <router-link
                            class="dropdown-item-link text-decoration-none course"
                            style="display: none"
                            :to="{ name: PageName.USER_COURSE_LIST_PAGE }"
                        >
                            <div class="dropdown-item d-flex flex-row align-items-center">
                                <div class="dropdown-item-icon-container">
                                    <img
                                        class="dropdown-item-icon"
                                        src="@/assets/common/icons/header/book.svg"
                                        alt=""
                                        width="20"
                                    />
                                </div>
                                <span class="dropdown-item-text">
                                    {{ $t('common.header.courses') }}
                                </span>
                            </div>
                        </router-link>
                    </el-dropdown-item>

                    <el-dropdown-item>
                        <div
                            @click="handleLogout"
                            class="dropdown-item d-flex flex-row align-items-center"
                        >
                            <div class="dropdown-item-icon-container">
                                <img
                                    class="dropdown-item-icon"
                                    src="@/assets/common/icons/header/header-logout.svg"
                                    alt=""
                                />
                            </div>
                            <span class="dropdown-item-text">
                                {{ $t('common.header.dropdownLogout') }}
                            </span>
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { PageName } from '@/common/constants';
import { IUserData } from '@/common/interfaces';
import { commonModule } from '@/modules/common/store/common.store';
import { loginModule } from '@/modules/auth/store/login.store';
import {
    generateDefaultAvatarColor,
    getFirstLetterOfName,
} from '@/common/commonFunctions';
import { userModule } from '@/modules/user/store/user.store';
import localStorageTokenService from '@/common/tokenService';
import socketInstance from '@/plugins/socket';

@Options({
    components: {},
})
export default class HeaderMenuAccount extends Vue {
    PageName = PageName;
    get userData(): IUserData {
        return { ...userModule.userData };
    }

    get userName() {
        return this.userData.username;
    }

    get userImage() {
        return this.userData.avatar;
    }

    get defaultAvatarColor() {
        return generateDefaultAvatarColor(this.userData?.username || '').trim();
    }

    get defaultAvatarName() {
        return getFirstLetterOfName(this.userData?.username || '').trim();
    }

    async created() {
        userModule.setUserData(localStorageTokenService.getLoginUser() || {});
        loginModule.setAccessToken(localStorageTokenService.getAccessToken());
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
}
</script>

<style lang="scss" scoped>
.dropdown-item-link {
    width: 100%;
}

.name {
    margin-left: 4px;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    color: $color-black;
    padding-left: 10px;
}

.user-avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
}

.dropdown-item {
    height: 40px;
}

.dropdown-item-icon-container {
    display: flex;
    align-items: center;
}

.dropdown-item-text {
    font-size: 15px;
    font-weight: 400;
    line-height: 22.5px;
    color: $color-gray-02;
    word-wrap: break-word;
}

.dropdown-item:hover {
    background-color: $color-violet-03;

    .dropdown-item-icon {
        filter: invert(52%) sepia(32%) saturate(5724%) hue-rotate(214deg) brightness(97%)
            contrast(88%);
    }

    .dropdown-item-text {
        color: $color-violet-new-1;
    }
}

:deep(.router-link-active) {
    width: 100%;
    text-decoration: none;
}

.el-dropdown-menu {
    &,
    :deep(.el-dropdown-menu__item) {
        padding: 0;
    }

    &,
    :deep(.el-dropdown-menu__item:first-of-type),
    .dropdown-item:first-of-type {
        border-top-left-radius: 12px;
    }

    &,
    :deep(.el-dropdown-menu__item:last-of-type),
    .dropdown-item:last-of-type {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

.course {
    display: none !important;
}

.default-avatar {
    cursor: pointer;
    font-style: normal;
    color: white;
    text-align: center;
    font-weight: 400;
    font-size: 22px;
}

.text-ellipsis {
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: lg)) {
    .name {
        display: none !important;
    }

    .course {
        display: block !important;
    }
}
</style>
