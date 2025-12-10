<template>
    <div class="auth-layout row">
        <div
            class="col-lg-6 col-12 left-container d-flex justify-content-center align-items-center"
        >
            <SliderLayout />
        </div>
        <div class="col-lg-6 col-12 right-container">
            <div class="content-wrapper">
                <router-view v-slot="{ Component }">
                    <component :is="Component" />
                </router-view>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import SliderLayout from './SliderLayout.vue';

@Options({
    components: {
        SliderLayout,
    },
})
export default class AuthLayout extends Vue {}
</script>

<style lang="scss" scoped>
.auth-layout {
    min-height: 100vh;
    padding: 0;
    margin: 0;
}
.logo-wrapper {
    margin: 48px auto 0;
}

.left-container {
    background-color: $color-blue-auth-banner;
    background-image: url('@/assets/auth/images/banner-background2.svg'),
        url('@/assets/auth/images/banner-background1.svg');
    background-position: 0 100%, 100% 0;
    background-repeat: no-repeat, no-repeat;
    padding: 0;
}
.right-container {
    padding: 0;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: lg)) {
    .left-container {
        display: none !important;
    }
}
@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
    .logo-wrapper {
        margin: 0 !important;
    }
}
</style>
