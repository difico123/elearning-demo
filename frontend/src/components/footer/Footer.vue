<template>
    <div class="footer d-flex justify-content-center">
        <div class="footer-wrapper">
            <div class="d-flex flex-wrap justify-content-between">
                <div>
                    <GeneralInformation />
                </div>
                <div>
                    <ContactUs />
                </div>
                <div class="break">
                    <MobileApp />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GeneralInformation from './GeneralInformation.vue';
import ContactUs from './ContactUs.vue';
import MobileApp from './MobileApp.vue';

@Options({
    components: { GeneralInformation, ContactUs, MobileApp },
})
export default class Footer extends Vue {}
</script>
<style lang="scss" scoped>
.footer {
    padding: 36px 0 50px;
    color: $color-white;
    background-color: $color-gray-01;
}

.footer-wrapper {
    width: 100vw;
    margin: 0 6vw;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: lg)) {
    .break {
        flex-basis: 100%;
        margin-top: 32px;
    }
}
@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: sm)) {
    .break {
        margin-top: 0;
    }
}
</style>
