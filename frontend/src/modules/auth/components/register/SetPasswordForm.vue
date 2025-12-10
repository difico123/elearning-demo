<template>
    <div class="form">
        <BaseInputPassword
            class="input input-password"
            :label="$t('auth.setPassword.initPassword')"
            :placeholder="$t('auth.setPassword.placeholder')"
            v-model:value="password"
            @keyup.enter="handleSubmitPassword"
        />
        <BaseInputPassword
            class="input"
            :label="$t('auth.setPassword.confirmPassword')"
            :placeholder="$t('auth.setPassword.placeholder')"
            v-model:value="confirmPassword"
            @keyup.enter="handleSubmitPassword"
        />
    </div>
    <el-button type="primary" class="continue-button" @click="handleSubmitPassword">
        {{ $t('auth.auth.continue') }}
    </el-button>
</template>
<script lang="ts">
import { Options } from 'vue-class-component';
import { GlobalMixin } from '@/common/mixin';
import { setPassword } from '../../services/register';
import { Prop } from 'vue-property-decorator';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { PageName } from '@/common/constants';
import { commonModule } from '@/modules/common/store/common.store';

Options({
    components: {},
});
export default class SetPasswordForm extends GlobalMixin {
    @Prop({ default: '' }) readonly token!: string;
    password = '';
    confirmPassword = '';

    async handleSubmitPassword() {
        commonModule.setLoadingIndicator(true);
        if (this.password !== this.confirmPassword) {
            showErrorNotificationFunction(
                this.$t('auth.setPassword.errors.mismatchError'),
            );
        } else {
            const response = await setPassword(this.password, this.token);
            if (response?.success) {
                showSuccessNotificationFunction(this.$t('auth.setPassword.success'));
                this.$router.push({ name: PageName.LOGIN_PAGE });
            }
        }
        commonModule.setLoadingIndicator(false);
    }
}
</script>

<style lang="scss" scoped>
.form {
    margin: 24px auto;
    max-width: 454px;
    width: 90vw;
    :deep(.el-input) {
        height: 48px;
    }
    .input-password {
        margin: 0 auto 32px;
    }
    :deep(label) {
        font-size: 15px;
        font-weight: 600;
        line-height: 24px;
    }
}

.continue-button {
    height: 48px;
    max-width: 454px;
    width: 90vw;
}
</style>
