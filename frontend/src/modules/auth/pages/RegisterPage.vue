<template>
    <div
        class="d-flex flex-column justify-content-center align-items-center register-container"
    >
        <img src="@/assets/auth/images/auth-logo.png" alt="" />

        <div class="form">
            <!-- Enter email or phone number -->
            <RegisterForm />
        </div>

        <SocialButtonBox />
        <div class="bottom-wrapper">
            <span
                >{{ $t('auth.register.haveAccount') }}
                <router-link :to="{ name: PageName.LOGIN_PAGE }">{{
                    $t('auth.register.login')
                }}</router-link>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RegisterForm from '@/modules/auth/components/register/RegisterForm.vue';
import SocialButtonBox from '@/modules/auth/components/layouts/common/SocialButtonBox.vue';
import { PageName } from '@/common/constants';

@Options({
    components: { SocialButtonBox, RegisterForm },
})
export default class RegisterPage extends Vue {
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
