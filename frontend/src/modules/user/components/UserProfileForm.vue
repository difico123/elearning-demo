<template>
    <div
        class="user-profile-wrapper d-flex flex-md-row flex-column justify-content-between w-100"
    >
        <div class="profile-image-wrapper">
            <div class="w-100">
                <img
                    class="profile-image w-100"
                    :src="defaultAvatarUrl"
                    alt=""
                />
            </div>
        </div>
        <div class="user-profile-form">
            <BaseInputText
                class="input"
                :label="$t('user.profile.form.username')"
                :placeholder="$t('user.profile.placeholder.username')"
                :error="credentialError"
                @keyup.enter="handleUpdateUser"
                v-model:value="userForm.username"
                autocomplete="off"
            />
            <BaseInputText
                class="input"
                :label="$t('user.profile.form.phone')"
                :placeholder="$t('user.profile.placeholder.phone')"
                v-model:value="userForm.phone"
                @keyup.enter="handleUpdateUser"
                autocomplete="off"
            />
            <BaseInputText
                class="input"
                :label="$t('user.profile.form.address')"
                :placeholder="$t('user.profile.placeholder.address')"
                v-model:value="userForm.address"
                @keyup.enter="handleUpdateUser"
                autocomplete="off"
            />
            <div class="d-flex flex-column flex-md-row w-100 gap-2">
                <BaseInputPassword
                    class="input input-password"
                    :label="$t('user.profile.form.password')"
                    :placeholder="$t('user.profile.placeholder.password')"
                    v-model:value="userForm.password"
                    @keyup.enter="handleUpdateUser"
                />
                <BaseInputPassword
                    v-if="userForm.password"
                    class="input input-password"
                    :label="$t('user.profile.form.currentPassword')"
                    :placeholder="$t('user.profile.placeholder.currentPassword')"
                    v-model:value="userForm.currentPassword"
                    @keyup.enter="handleUpdateUser"
                />
            </div>
        </div>
    </div>
    <div class="save-button" @click="handleUpdateUser">
        {{ $t('user.profile.form.save') }}
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { getUserData, updateUserData } from '../services/user';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { generateGmailStyleAvatar } from '@/common/commonFunctions';
import { userModule } from '../store/user.store';
import { IUpdateUserData } from '../constants/user.interfaces';
import { commonModule } from '@/modules/common/store/common.store';
import { IUserData } from '@/common/interfaces';

@Options({
    components: {},
})
export default class UserProfileForm extends Vue {
    userForm = {} as IUpdateUserData;
    credentialError = '';
    passwordError = '';
    get userData(): IUserData {
        return userModule.userData;
    }

    async getUserData() {
        const response = await getUserData();
        if (!response?.success) {
            let res = response?.errors || [
                { message: this.$t('user.errors.getUserDataError') },
            ];
            userModule.setUserData({});
            showErrorNotificationFunction(res[0].message);
        }
    }

    get defaultAvatarUrl() {
        const identifier = this.userData?.username || this.userData?.email || this.userData?.id || 'User';
        return generateGmailStyleAvatar(identifier);
    }

    checkEmptyUsername() {
        if (this.userData.username == '') {
            this.credentialError = this.$t('user.errors.emptyUsername');
        } else {
            this.credentialError = '';
        }
    }

    checkPasswordFormat() {
        if (this.userForm.password && this.userForm.password?.length < 8) {
            this.passwordError = this.$t('auth.login.password.error');
        } else {
            this.passwordError = '';
        }
    }

    async handleUpdateUser() {
        commonModule.setLoadingIndicator(true);
        const userData: IUpdateUserData = {};
        let formData = new FormData();
        if (this.userForm.username) {
            userData.username = this.userForm.username;
            formData.append('username', this.userForm?.username || '');
        }
        if (this.userForm.phone) {
            userData.phone = this.userForm.phone;
            formData.append('phone', this.userForm.phone || '');
        }
        if (this.userForm.address) {
            userData.address = this.userForm.address;
            formData.append('address', this.userForm.address || '');
        }
        if (this.userForm.password) {
            userData.password = this.userForm.password;
            formData.append('password', this.userForm.password || '');
        }
        if (this.userForm.currentPassword) {
            userData.currentPassword = this.userForm.currentPassword;
            formData.append('currentPassword', userData.currentPassword || '');
        }
        if (this.credentialError === '') {
            const response = await updateUserData(formData);
            if (response.success) {
                await this.getUserData();
                showSuccessNotificationFunction(
                    this.$t('user.success.updateUserDataSuccess'),
                );
            } else {
                let res = response?.errors || [
                    { message: this.$t('user.errors.updateUserDataError') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        } else {
            showErrorNotificationFunction(this.$t('user.errors.emptyUsername'));
        }
        commonModule.setLoadingIndicator(false);
    }

    async created() {
        await this.getUserData();
        this.userForm = this.userData;
        this.$watch(
            'userData',
            () => {
                this.checkEmptyUsername();
            },
            { immediate: true, deep: true },
        );
    }
}
</script>
<style lang="scss" scoped>
.user-profile-wrapper {
    gap: 5vw;
}
.profile-image-wrapper {
    padding-top: 36px;
    width: 270px !important;
    position: relative;
    justify-content: center;
    align-self: flex-start;
    .profile-image {
        width: 100% !important;
        border-radius: 50%;
        border: 2px solid #888;
        aspect-ratio: 1 / 1;
    }
}

.user-profile-form {
    width: calc(100% - 270px);
}

.save-button {
    margin: 20px auto 0;
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 8px;
    white-space: nowrap;
    width: 140px;
    text-align: center;
    padding: 12px 0;
    transition: all 0.44s ease 0s;
    border: 1px solid transparent;
    background-color: $color-violet-new-1;
    color: $color-white;
    cursor: pointer;
    &:hover {
        background-color: $color-violet-new-opacity-50;
    }
}

.input-password {
    width: 50%;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
    .profile-image-wrapper {
        padding: 0 !important;
        align-self: center;
    }
    .user-profile-form {
        width: 100% !important;
    }
    .input-password {
        width: 100% !important;
    }
}
</style>
