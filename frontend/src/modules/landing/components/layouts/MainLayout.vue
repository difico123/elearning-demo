<template>
    <div style="overflow-x: hidden">
        <Header />
        <div class="main-layout">
            <router-view v-slot="{ Component }">
                <component :is="Component" />
            </router-view>
        </div>
        <Footer />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Header from '@/components/header/Header.vue';
import Footer from '@/components/footer/Footer.vue';

@Options({
    components: { Header, Footer },
})
export default class MainLayout extends Vue {}
</script>
<style lang="scss" scoped>
.main-layout {
    padding: 5vh 6vw;
    min-height: calc(100vh - 90px - 235px);
    background-color: $pale-blue;
}
</style>
