<template>
    <div
        class="d-flex flex-column align-items-center justify-content-center create-password-container"
    >
        <img src="@/assets/auth/images/auth-logo.png" alt="" />

        <div class="title-container">
            <div class="title">{{ $t('auth.setPassword.title') }}</div>
            <div class="sub-title">{{ $t('auth.setPassword.subTitle') }}</div>
        </div>
        <SetPasswordForm :token="token" />
    </div>
</template>
<script lang="ts">
import { PageName } from '@/common/constants';
import { commonModule } from '@/modules/common/store/common.store';
import { Options, Vue } from 'vue-class-component';
import SetPasswordForm from '../components/register/SetPasswordForm.vue';
import { verifyToken } from '../services/register';
import { registerModule } from '../store/register.store';

@Options({
    components: { SetPasswordForm },
})
export default class CreatePasswordPage extends Vue {
    token = '';
    created() {
        this.token = this.$route.params.token as string;
        this.verifyToken(this.token);
    }
    async verifyToken(token: string) {
        commonModule.setLoadingIndicator(true);
        const response = await verifyToken(token);
        console.log(response, 'verify token response');
        if (response?.success) {
            registerModule.setActiveEmailToken(token as string);
        } else {
            this.$router.push({ name: PageName.NOT_FOUND_PAGE });
        }
        commonModule.setLoadingIndicator(false);
    }
}
</script>
<style lang="scss" scoped>
.create-password-container {
    margin: 20vh auto;
}

.title-container {
    text-align: center;
    .title {
        color: $color-gray-01;
        font-size: 40px;
        line-height: 56px;
        font-weight: 700;
        margin: 20px auto 0;
    }

    .sub-title {
        color: $color-gray-03;
        font-size: 15px;
        line-height: 22.5px;
        font-weight: 400;
        margin-top: 10px;
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
