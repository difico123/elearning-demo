<template>
    <div class="splide-container">
        <Splide :options="slideOptions">
            <SplideSlide
                v-for="content in slideContents"
                :key="content"
                class="d-flex justify-content-center"
            >
                <div class="splide-item d-flex flex-column justify-content-center">
                    <div class="d-flex justify-content-center">
                        <img :src="content.image" />
                    </div>
                    <div class="splide-title">{{ content.title }}</div>
                    <div class="splide-description">{{ content.description }}</div>
                </div>
            </SplideSlide>
        </Splide>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/splide.min.css';

@Options({
    components: { Splide, SplideSlide },
})
export default class SliderLayout extends Vue {
    slideOptions = {
        rewind: true,
        rewindByDrag: true,
        drag: true,
        arrows: false,
    };

    get slideContents() {
        return [
            {
                title: this.$t('auth.banner.title1'),
                description: this.$t('auth.banner.description1'),
                image: require('@/assets/auth/images/banner-img-1.png'),
            },
            {
                title: this.$t('auth.banner.title2'),
                description: this.$t('auth.banner.description2'),
                image: require('@/assets/auth/images/banner-img-2.png'),
            },
            {
                title: this.$t('auth.banner.title3'),
                description: this.$t('auth.banner.description3'),
                image: require('@/assets/auth/images/banner-img-3.png'),
            },
        ];
    }
}
</script>
<style lang="scss" scoped>
.splide-container {
    width: 100%;
    height: 65vh;
}

.splide-item {
    width: 478px;
    img {
        object-fit: cover;
        width: 324px;
        height: 324px;
        border-radius: 50%;
    }
}

.splide-title {
    color: $color-white;
    font-size: 32px;
    font-weight: 700;
    line-height: 48px;
    text-align: center;
    margin-top: 34px;
}

.splide-description {
    color: $color-white;
    font-size: 15px;
    font-weight: 400;
    line-height: 22.5px;
    text-align: center;
    margin-top: 12px;
}

:deep(.splide--slide) {
    height: 100%;
}

:deep(.splide__pagination__page) {
    width: 8px;
    height: 8px;
    opacity: 0.5;
    background-color: $color-white;

    &.is-active {
        width: 22px;
        border-radius: 6px;
        opacity: 1;
        transform: scale(1);
    }
}

:deep(.splide__pagination) {
    margin-top: 20px;
}
</style>
