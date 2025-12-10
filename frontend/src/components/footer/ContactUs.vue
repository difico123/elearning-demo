<template>
    <div class="wrapper">
        <div class="title d-flex align-items-center pe-5">
            {{ $t('common.footer.contact.title') }}
        </div>
        <div class="d-flex justify-content-start gap-sm-3 gap-2 mt-sm-4">
            <span v-for="(social, index) in contacts" :key="index">
                <a
                    :href="social.link"
                    class="contact-us-items"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img :src="social.image" />
                </a>
            </span>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class ContactUs extends Vue {
    get contacts() {
        return [
            {
                image: require('@/assets/common/icons/footer/facebook-logo.svg'),
                link: '#',
            },
            {
                image: require('@/assets/common/icons/footer/twitter-logo.svg'),
                link: '#',
            },
            {
                image: require('@/assets/common/icons/footer/youtube-logo.svg'),
                link: '#',
            },
            {
                image: require('@/assets/common/icons/footer/tiktok-logo.svg'),
                link: '#',
            },
            {
                image: require('@/assets/common/icons/footer/linkedin-logo.svg'),
                link: '#',
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

.contact-us-items:hover {
    opacity: 0.75;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: sm)) {
    .wrapper {
        display: flex;
        margin: 16px 0;
        align-items: center;
    }
}
</style>
