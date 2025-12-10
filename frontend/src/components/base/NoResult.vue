<template>
    <div
        class="no-result d-flex justify-center text-center flex-column"
        style="margin-top: 50px"
    >
        <img
            src="@/assets/common/images/empty-list.svg"
            alt=""
            class="d-block mb-2"
            height="64"
        />
        {{ message }}
    </div>
</template>
<script lang="ts">
import { Prop, Vue } from 'vue-property-decorator';

export default class NoResult extends Vue {
    @Prop({ default: '' }) private message!: string;
}
</script>
<style scoped>
.no-result {
    border-radius: 4px;
    color: #565d65;
}
</style>
