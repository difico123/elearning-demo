<template>
    <div class="user-wrapper">
        <UserProfileForm />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import UserProfileForm from '../components/UserProfileForm.vue';

@Options({
    components: { UserProfileForm },
})
export default class UserProfilePage extends Vue {}
</script>
<style lang="scss" scoped></style>
