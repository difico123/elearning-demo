<template>
    <div class="register-form-container d-flex flex-column">
        <div class="title">{{ $t('auth.general.welcomeTitle') }}</div>
        <div class="sub-title">{{ $t('auth.register.welcomeDescription') }}</div>
        <BaseInputText
            class="input"
            :label="$t('auth.register.credential.label')"
            :placeholder="$t('auth.register.credential.placeholder')"
            :error="credentialError"
            @keyup.enter="onSubmitCredential"
            v-model:value="credential"
        />
        <el-button
            :disabled="!credential ? '' : disabled"
            type="primary"
            class="register-button"
            @click="onSubmitCredential"
        >
            {{ $t('auth.register.register') }}
        </el-button>
    </div>
</template>
<script lang="ts">
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { Options, Vue } from 'vue-class-component';
import { register } from '../../services/register';
import { commonModule } from '@/modules/common/store/common.store';
import { PageName, Regex } from '@/common/constants';

@Options({
    components: {},
})
export default class RegisterForm extends Vue {
    credential = '';
    credentialError = '';
    Regex = Regex;

    checkCredentialFormat() {
        if (this.credential.trim().match(this.Regex.EMAIL)) {
            this.credentialError = '';
        } else {
            this.credentialError = this.$t('auth.login.credential.invalidFormat');
        }
    }

    async onSubmitCredential() {
        commonModule.setLoadingIndicator(true);
        const response = await register(this.credential);
        if (response?.success) {
            showSuccessNotificationFunction(
                this.$t('auth.register.success.description', {
                    email: this.credential,
                }),
            );
            this.$router.push({ name: PageName.LOGIN_PAGE });
        } else {
            showErrorNotificationFunction(
                response?.message || this.$t('auth.register.defaultError.registerEmail'),
            );
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
    }
}
</script>

<style lang="scss" scoped>
.register-form-container {
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

.register-button {
    background-color: $color-violet-new-1 !important;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
    .title {
        font-size: 32px !important;
        line-height: 48px !important;
        margin: 32px auto 0 !important;
    }
}
</style>
