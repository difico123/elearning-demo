<template>
    <div
        class="d-flex flex-column justify-content-center align-items-center register-container"
    >
        <img src="@/assets/auth/images/auth-logo.png" alt="" />

        <div class="form">
            <ForgotPasswordForm />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ForgotPasswordForm from '@/modules/auth/components/login/ForgotPasswordForm.vue';
import { PageName } from '@/common/constants';

@Options({
    components: { ForgotPasswordForm },
})
export default class ForgotPasswordPage extends Vue {
    PageName = PageName;
}
</script>
<style lang="scss" scoped>
.register-container {
    margin: 24px auto;
}

.form {
    max-width: 454px;
    width: 90vw;
    margin: 10px auto;
}
.bottom-wrapper {
    color: $color-gray-03;
    font-size: 14px;
    line-height: 21px;
    margin: 20px 0;
    a {
        color: $color-violet-new-1;
        text-decoration: none;
        margin: 0 10px;
        &:hover {
            color: $color-violet-new;
        }
    }
}
</style>
