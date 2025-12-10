<template>
    <div class="register-form-container d-flex flex-column">
        <div class="title pt-4">{{ $t('auth.general.welcomeTitle') }}</div>
        <div class="sub-title pt-2">{{ $t('auth.register.welcomeDescription') }}</div>
        <BaseInputText
            class="input pt-4"
            :label="$t('auth.register.credential.label')"
            :placeholder="$t('auth.register.credential.placeholder')"
            :error="credentialError"
            @keyup.enter="onSubmitCredential"
            v-model:value="credential"
        />
        <el-button
            :disabled="!credential ? '' : disabled"
            type="primary"
            class="forgot-password-button"
            @click="onSubmitCredential"
        >
            {{ $t('auth.forgotPassword.resetPassword') }}
        </el-button>

        <router-link class="redirect mx-auto pt-4" :to="{ name: PageName.LOGIN_PAGE }">{{
            $t('auth.register.login')
        }}</router-link>
    </div>
</template>
<script lang="ts">
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { Options, Vue } from 'vue-class-component';
import { commonModule } from '@/modules/common/store/common.store';
import { PageName, Regex } from '@/common/constants';
import { forgotPassword } from '../../services/login';

@Options({
    components: {},
})
export default class ForgotPasswordForm extends Vue {
    PageName = PageName;
    credential = '';
    credentialError = '';

    Regex = Regex;

    async onSubmitCredential() {
        commonModule.setLoadingIndicator(true);
        const response = await forgotPassword(this.credential);
        if (response?.success) {
            showSuccessNotificationFunction(
                this.$t('auth.forgotPassword.success.description', {
                    email: this.credential,
                }),
            );
            this.$router.push({ name: PageName.LOGIN_PAGE });
        } else {
            showErrorNotificationFunction(
                response?.message || this.$t('auth.forgotPassword.errors.defaultError'),
            );
        }
        commonModule.setLoadingIndicator(false);
    }

    checkFormat() {
        if (this.credential.trim().match(this.Regex.EMAIL)) {
            this.credentialError = '';
        } else {
            this.credentialError = this.$t('auth.login.credential.invalidFormat');
        }
    }

    created() {
        this.$watch('credential', () => {
            this.checkFormat();
        });
    }
}
</script>

<style lang="scss" scoped>
.forgot-password-container {
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

.forgot-password-button {
    background-color: $color-violet-new-1 !important;
}

.redirect {
    color: $color-violet-new-1;
    text-decoration: none;
    &:hover {
        color: $color-violet-new;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
    .title {
        font-size: 32px !important;
        line-height: 48px !important;
        margin: 32px auto 0 !important;
    }
}
</style>
