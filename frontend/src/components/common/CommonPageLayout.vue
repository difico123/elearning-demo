<template>
    <div
        class="page-wrapper d-flex flex-column justify-content-center align-items-center"
    >
        <slot />
        <el-button type="primary" class="back-button" @click="onClickBackButton">
            {{ $t('common.navigate.back') }}
        </el-button>
    </div>
</template>
<script lang="ts">
import { PageName } from '@/common/constants';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class CommonPageLayout extends Vue {
    onClickBackButton() {
        this.$router.push({ name: PageName.LANDING_PAGE });
    }
}
</script>
<style lang="scss" scoped>
.page-wrapper {
    padding: 0 24px;
    height: 100vh;
    background-image: url('@/assets/common/images/light-client-background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.back-button {
    height: 40px;
    width: 167px;
}
</style>
