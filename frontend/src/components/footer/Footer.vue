<template>
    <div class="footer d-flex justify-content-center">
        <div class="footer-wrapper">
            <div class="d-flex flex-wrap justify-content-between">
                <div>
                    <GeneralInformation />
                </div>
                <div>
                    <Products />
                </div>
                <div>
                    <Solutions />
                </div>
                <div class="break">
                    <Resources />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GeneralInformation from './GeneralInformation.vue';
import Products from './Products.vue';
import Solutions from './Solutions.vue';
import Resources from './Resources.vue';

@Options({
    components: { GeneralInformation, Products, Solutions, Resources },
})
export default class Footer extends Vue {}
</script>
<style lang="scss" scoped>
.footer {
    padding: 6vh 0;
    background-color: $color-white;
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
