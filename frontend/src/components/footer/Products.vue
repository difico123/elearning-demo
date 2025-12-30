<template>
    <div class="wrapper">
        <div class="title">Sản phẩm</div>
        <div class="items">
            <div class="item">HRM</div>
            <div class="item">Tiện ích nâng cao</div>
            <div class="item">ERP</div>
            <div class="item">FM</div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class Products extends Vue {}
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

