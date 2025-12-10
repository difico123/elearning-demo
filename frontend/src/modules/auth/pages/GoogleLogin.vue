<template>
    <div class="center">Google Login</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import * as animationData from './assets/astronaut-in-tea-break.json';
import * as loadingGif from './assets/loading-process.json';
@Options({
    components: {},
})
export default class LoginPage extends Vue {
    
}
</script>
<style lang="scss" scoped>
.center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin-top: 100px;
}
</style>
