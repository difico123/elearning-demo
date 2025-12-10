<template>
    <div class="wrapper">
        <div class="title d-flex align-items-center">
            {{ $t('common.footer.mobileApp.title') }}
        </div>
        <div class="body">
            <p class="mt-3 d-none d-sm-block">
                {{ $t('common.footer.mobileApp.description') }}
            </p>
            <div class="mobile-apps d-flex justify-content-start gap-1 gap-sm-3">
                <a
                    v-for="mobileApp in mobileApps"
                    :key="mobileApp.image"
                    :href="mobileApp.link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img class="body-img" :src="mobileApp.image" />
                </a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class MobileApp extends Vue {
    get mobileApps() {
        return [
            {
                image: require('@/assets/common/icons/footer/appstore.svg'),
                link: '',
            },
            {
                image: require('@/assets/common/icons/footer/googleplay.svg'),
                link: '',
            },
        ];
    }
}
</script>
<style lang="scss" scoped>
.title {
    height: 44px;
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
}

.body {
    color: $color-gray-04;
}

.body-img:hover {
    opacity: 0.85;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xs)) {
    .body-img {
        min-width: 130px;
    }
    .mobile-apps {
        justify-content: space-between !important;
    }
}
</style>
