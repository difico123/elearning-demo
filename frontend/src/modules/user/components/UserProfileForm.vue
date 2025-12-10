<template>
    <div
        class="user-profile-wrapper d-flex flex-md-row flex-column justify-content-between w-100"
    >
        <div class="profile-image-wrapper">
            <div class="w-100" v-if="userData.avatar">
                <img
                    class="profile-image w-100"
                    :src="
                        !isChangingAvatar ? userData.avatar : previewImagePath(thumbnail!!)
                    "
                    alt=""
                />
            </div>
            <div
                v-else
                class="default-avatar profile-image d-flex align-items-center justify-content-center"
                :style="{ 'background-color': defaultAvatarColor }"
            >
                <span>{{ defaultAvatarName }}</span>
            </div>
            <label class="upload-button" for="file-input">
                <div class="camera-wrapper">
                    <img src="@/assets/user/icons/camera.svg" alt="" />
                </div>
            </label>
            <input
                type="file"
                class="d-none"
                id="file-input"
                @change="handleChangeProfileImage(($event.target as any)?.files)"
                accept="image/*"
            />
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
import {
    generateDefaultAvatarColor,
    getFirstLetterOfName,
} from '@/common/commonFunctions';
import { IMAGE_EXTENSION_LIST } from '@/common/constants';
import { userModule } from '../store/user.store';
import { IUpdateUserData } from '../constants/user.interfaces';
import { commonModule } from '@/modules/common/store/common.store';
import { IUserData } from '@/common/interfaces';

@Options({
    components: {},
})
export default class UserProfileForm extends Vue {
    isChangingAvatar = false;
    userForm = {} as IUpdateUserData;
    credentialError = '';
    passwordError = '';
    thumbnail: File | null = null;
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

    get defaultAvatarColor() {
        return generateDefaultAvatarColor(this.userData?.username || '').trim();
    }

    get defaultAvatarName() {
        return getFirstLetterOfName(this.userData?.username || '').trim();
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

    previewImagePath(file: File) {
        if (!this.checkImageFormat(file.name)) {
            showErrorNotificationFunction(this.$t('user.errors.invalidImage') as string);
            this.isChangingAvatar = false;
            return;
        } else {
            return URL.createObjectURL(file);
        }
    }

    checkImageFormat(name: string) {
        const fileParts: Array<string> = name.split(/[.]/);
        if (!IMAGE_EXTENSION_LIST.includes(fileParts[fileParts.length - 1])) {
            return false;
        }
        return true;
    }

    handleChangeProfileImage(files: File[]) {
        this.thumbnail = files[0];
        this.userForm.file = this.previewImagePath(this.thumbnail);
        this.isChangingAvatar = true;
        if (this.checkImageFormat(files[0].name)) {
            showSuccessNotificationFunction('Success');
        } else return;
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
        if (this.userForm.file) {
            formData.append('file', this.thumbnail || '');
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
    .default-avatar {
        cursor: pointer;
        font-style: normal;
        color: white;
        text-align: center;
        font-weight: 400;
        font-size: 80px;
    }
    .upload-button {
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: absolute;
        top: 80%;
        right: 10%;
        &:hover {
            opacity: 0.88;
        }
    }
    .camera-wrapper {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        padding: 6px;
        background-color: #aaa;
        border: 1px solid #888;
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
