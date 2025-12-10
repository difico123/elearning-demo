<template>
    <CommonPageLayout>
        <img
            class="not-found-page-banner"
            :src="require('@/assets/common/images/banner-notfound.svg')"
        />
    </CommonPageLayout>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CommonPageLayout from '@/components/common/CommonPageLayout.vue';

@Options({
    components: { CommonPageLayout },
})
export default class NotFoundPage extends Vue {}
</script>
<style lang="scss" scoped>
@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: lg)) {
    .not-found-page-banner {
        max-width: 600px;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: sm)) {
    .not-found-page-banner {
        max-width: 400px;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xs)) {
    .not-found-page-banner {
        max-width: 320px;
    }
}
</style>
