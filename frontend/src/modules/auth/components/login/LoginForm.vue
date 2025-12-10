<template>
    <div class="login-form-container d-flex flex-column">
        <div class="title">{{ $t('auth.general.welcomeTitle') }}</div>
        <div class="inputs d-flex flex-column pt-3">
            <BaseInputText
                class="input"
                :label="$t('auth.register.credential.label')"
                :placeholder="$t('auth.register.credential.placeholder')"
                :error="emailError"
                v-model:value="credential"
                @keyup.enter="handleLogin"
                autocomplete="off"
            />
            <BaseInputPassword
                class="input input-password"
                :label="$t('auth.login.password.label')"
                :placeholder="$t('auth.login.password.label')"
                :error="passwordError"
                v-model:value="password"
                @keyup.enter="handleLogin"
                autocomplete="off"
            />
        </div>

        <el-button
            :disabled="!password ? true : false"
            type="primary"
            class="login-button"
            @click="handleLogin"
        >
            {{ $t('auth.login.login') }}
        </el-button>
        <div
            @click="handleForgotPassword"
            class="forgot-password d-flex w-100 justify-content-center"
        >
            {{ $t('auth.forgotPassword.forgotPassword') }}
        </div>
    </div>
</template>
<script lang="ts">
import {
    setLoginUser,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { Options, Vue } from 'vue-class-component';
import { login } from '../../services/login';
import { commonModule } from '@/modules/common/store/common.store';
import { loginModule } from '../../store/login.store';
import { PageName, Regex, SystemRole } from '@/common/constants';
import { userModule } from '@/modules/user/store/user.store';
import socketInstance from '@/plugins/socket';

@Options({
    components: {},
})
export default class LoginForm extends Vue {
    credential = '';
    password = '';
    emailError = '';
    passwordError = '';
    Regex = Regex;

    get userData() {
        return userModule.userData;
    }

    get accessToken() {
        return loginModule.accessToken;
    }

    handleForgotPassword() {
        this.$router.push({ name: PageName.FORGOT_PASSWORD_PAGE });
    }

    checkCredentialFormat() {
        if (this.credential.trim().match(this.Regex.EMAIL)) {
            this.emailError = '';
        } else {
            this.emailError = this.$t('auth.login.credential.invalidFormat');
        }
    }

    checkPasswordFormat() {
        if (this.password.length < 8) {
            this.passwordError = this.$t('auth.login.password.error');
        } else {
            this.passwordError = '';
        }
    }

    async handleLogin() {
        commonModule.setLoadingIndicator(true);
        const params = {
            email: this.credential,
            password: this.password,
        };
        if (this.emailError === '' && this.passwordError === '') {
            const response = await login(params);
            if (response?.success) {
                showSuccessNotificationFunction(response.message || 'Success');
                userModule.setUserData(response?.data?.user || {});
                loginModule.setAccessToken(response?.data?.accessToken || '');
                socketInstance.setAccessToken(response?.data?.accessToken || '');
                loginModule.setLoginState(true);
                setLoginUser(response?.data || { accessToken: '', user: {} });

                if (this.userData.role === SystemRole.GUEST) {
                    this.$router.push({
                        name: PageName.SELECT_ROLE_PAGE,
                    });
                } else if (this.userData.role === SystemRole.PENDING) {
                    this.$router.push({ name: PageName.PENDING_APPROVE_PAGE });
                } else {
                    this.$router.push({ name: PageName.LANDING_PAGE });
                }
            } else {
                let res = response?.errors || [
                    { message: this.$t('auth.login.loginError') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
        commonModule.setLoadingIndicator(false);
    }

    created() {
        this.$watch(
            'credential',
            () => {
                this.checkCredentialFormat();
            },
            { immediate: true },
        );
        this.$watch(
            'password',
            () => {
                this.checkPasswordFormat();
            },
            { immediate: true },
        );
    }
}
</script>

<style lang="scss" scoped>
.login-form-container {
    gap: 10px;
}

.el-button {
    max-width: 454px;
    width: 90vw;
    height: 48px;
    margin: 0 auto;
}

.title {
    max-width: 454px;
    text-align: center;
    color: $color-gray-01;
    font-size: 40px;
    line-height: 56px;
    font-weight: 700;
    margin: 20px auto 0;
}

.sub-title {
    max-width: 454px;
    text-align: center;
    color: $color-gray-03;
    font-size: 15px;
    line-height: 22.5px;
    font-weight: 400;
    margin-top: 10px;
    margin-bottom: 10px;
}

.login-button {
    background-color: $color-violet-new-1 !important;
}

.forgot-password {
    cursor: pointer;
    margin: 10px 0;
    font-size: 14px;
    line-height: 21px;
    color: $color-violet-new-1;
    &:hover {
        color: $color-violet-new;
    }
}

:deep(.el-input) {
    height: 48px;
}

:deep(label) {
    font-size: 15px;
    font-weight: 600;
    line-height: 24px;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
    .title {
        font-size: 32px !important;
        line-height: 48px !important;
        margin: 32px auto 0 !important;
    }
}
</style>
