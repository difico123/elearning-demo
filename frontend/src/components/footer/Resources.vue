<template>
    <div class="wrapper">
        <div class="title">Tài nguyên</div>
        <div class="items">
            <div class="item">Về chúng tôi</div>
            <div class="item">Liên hệ</div>
            <div class="item">Trung tâm trợ giúp</div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class Resources extends Vue {}
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.title {
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: $color-gray-900;
}

.items {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.item {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: $color-gray-400;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
}
</style>

