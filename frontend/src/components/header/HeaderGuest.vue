<template>
    <div class="d-flex flex-row align-items-center" style="gap: 20px">
        <MenuLanguage />
        <router-link class="text-decoration-none" :to="{ name: PageName.LOGIN_PAGE }">
            <span class="guest-button login-button">
                {{ $t('common.header.loginButton') }}
            </span>
        </router-link>
        <router-link class="text-decoration-none" :to="{ name: PageName.REGISTER_PAGE }">
            <span class="guest-button register-button">
                {{ $t('common.header.registerButton') }}
            </span>
        </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { SupportLanguage, DEFAULT_LANGUAGE } from '@/common/constants';
import { PageName } from '@/common/constants';
import MenuLanguage from './MenuLanguage.vue';

@Options({ components: { MenuLanguage } })
export default class HeaderGuest extends Vue {
    PageName = PageName;
    languages = Object.values(SupportLanguage);
    selectedLanguage = DEFAULT_LANGUAGE;

    changeLanguage = (selectedLanguageCode: SupportLanguage) => {
        this.selectedLanguage = selectedLanguageCode;
    };
}
</script>

<style lang="scss" scoped>
.guest-button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 8px;
    white-space: nowrap;
    padding: 12px 24px;
    transition: all 0.44s ease 0s;
    &:hover {
        color: $color-white;
        background-color: $color-violet-new-opacity-50;
        border: 1px solid $color-violet-new-opacity-50;
    }
}

.login-button {
    color: $color-gray-01;
    background-color: $color-white;
    border: 1px solid black;
}

.register-button {
    color: $color-white;
    background-color: $color-violet-new;
    border: 1px solid $color-violet-new;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: lg)) {
    .select-language {
        margin-right: 12px;
    }

    :deep(.el-input__suffix-inner > :first-child) {
        margin-left: 0px !important;
    }

    .login-button {
        margin-right: 12px;
    }

    .register-button {
        width: 114px !important;
    }
}
</style>
