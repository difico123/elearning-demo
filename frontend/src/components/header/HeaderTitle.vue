<template>
    <div class="title-container">
        <router-link
            class="title text-decoration-none"
            :to="{ name: PageName.LANDING_PAGE }"
        >
            {{ $t('common.header.appName') }}
        </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { PageName } from '@/common/constants';

@Options({
    components: {},
})
export default class HeaderTitle extends Vue {
    PageName = PageName;
}
</script>

<style lang="scss" scoped>
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
    .title-container {
        margin-left: 6px;

        .title {
            font-size: 15px;
            line-height: 24px;
        }
    }
}
</style>
