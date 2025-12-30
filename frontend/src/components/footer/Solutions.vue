<template>
    <div class="wrapper">
        <div class="section">
            <div class="title">Giải pháp và giá cả</div>
            <div class="items">
                <div class="item">HRM</div>
            </div>
        </div>
        <div class="section">
            <div class="title">Bảo mật</div>
            <div class="items">
                <div class="item">Chính sách bảo mật</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class Solutions extends Vue {}
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.section {
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

