<template>
    <div class="bg-loader" v-if="showLoadingIndicator">
        <div class="wrapper-loader">
            <img
                class="loading"
                src="@/assets/common/images/loading.svg"
                alt=""
                height="64"
                width="64"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-property-decorator';
import { commonModule } from '@/modules/common/store/common.store';

@Options({
    components: {},
})
export default class LoadingIndicator extends Vue {
    get showLoadingIndicator(): boolean {
        return commonModule.showLoadingIndicator;
    }
}
</script>
<style scoped lang="scss">
.bg-loader:before {
    content: '';
    z-index: 1000;
    background: #000;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100% !important;
    opacity: 0.2;
}
.wrapper-loader {
    width: 4rem;
    height: 4rem;
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    margin: 0 auto;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 0.625rem;
    transform: translateY(-50%);
    img {
        transform: translate(50% -50%);
    }
}
</style>
