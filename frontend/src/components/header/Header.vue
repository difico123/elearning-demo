<template>
    <div class="header-wrapper">
        <div class="header header-height d-flex flex-row justify-content-center">
            <div class="header-content d-flex flex-row justify-content-between w-100">
                <div class="d-flex flex-row align-items-center">
                    <Logo />
                    <HeaderTitle />
                </div>
                <div
                    v-if="getLoggedIn"
                    class="d-flex align-items-center justify-content-end header-right"
                    style="gap: 24px"
                >
                    <MenuLanguage />
                    <MenuCourses />
                    <MenuNotification />
                    <MenuAccount />
                </div>
                <HeaderGuest v-else />
            </div>
        </div>
        <div class="header-height"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import HeaderTitle from './HeaderTitle.vue';
import HeaderGuest from './HeaderGuest.vue';
import MenuAccount from './MenuAccount.vue';
import MenuNotification from './MenuNotification.vue';
import Logo from './Logo.vue';
import MenuLanguage from './MenuLanguage.vue';
import MenuCourses from './MenuCourses.vue';
import { loginModule } from '@/modules/auth/store/login.store';

@Options({
    components: {
        HeaderTitle,
        HeaderGuest,
        MenuLanguage,
        MenuAccount,
        MenuNotification,
        Logo,
        MenuCourses,
    },
})
export default class Header extends Vue {
    getLoggedIn() {
        return !(loginModule.accessToken == '');
    }
}
</script>

<style lang="scss" scoped>
.header-wrapper {
    width: 100vw !important;
    background-color: $color-white;
}

.header-height {
    height: 90px;
    width: 100vw;
}

.header {
    position: fixed;
    background-color: $color-gray-opacity-30;
    backdrop-filter: blur(32px);
    z-index: map-get($map: $zIndex, $key: menu);
    padding: 0 6vw;
}

.right-area {
    gap: 25px;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xs)) {
    .header-height {
        height: 46px;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: sm)) {
    .header-guest {
        display: none !important;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
    .header-right {
        gap: 12px !important;
    }
}
</style>
