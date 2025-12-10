<template>
    <div class="d-flex flex-row align-items-center">
        <router-link class="text-decoration-none" :to="{ name: PageName.LANDING_PAGE }">
            <img class="logo" src="@/assets/common/images/logo2.svg" alt="" />
        </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { PageName } from '@/common/constants';

@Options({})
export default class HeaderLogo extends Vue {
    PageName = PageName;
}
</script>

<style lang="scss" scoped>
.logo {
    width: 56px;
    height: 56px;
}

.title-container {
    margin-left: 14px;

    .title {
        font-size: 20px;
        font-weight: 600;
        line-height: 32px;
        color: $color-violet-new;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: lg)) {
    .title-container {
        margin-left: 6px;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xs)) {
    .logo {
        width: 28px;
        height: 28px;
    }

    .title-container {
        margin-left: 6px;

        .title {
            font-size: 15px;
            line-height: 24px;
        }
    }
}
</style>
