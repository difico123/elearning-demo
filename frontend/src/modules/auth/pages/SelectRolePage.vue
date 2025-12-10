<template>
    <div class="select-role-container w-100">
        <div class="d-flex flex-row justify-content-center w-100">
            <span class="select-role-title">{{ $t('auth.role.selectRole') }}</span>
        </div>
        <div class="role-selector d-flex flex-row justify-content-between">
            <div v-for="(roleData, index) in selectRoleData" :key="index">
                <SelectRole
                    :title="roleData.title"
                    :role="roleData.role"
                    :description="roleData.description"
                />
            </div>
        </div>
        <div @click="handleSkip" class="skip-button w-100 d-flex justify-content-end">
            <div class="double-arrow">
                <img src="@/assets/auth/icons/next.svg" alt="" />
                <img src="@/assets/auth/icons/next.svg" alt="" />
            </div>
            {{ $t('auth.role.skip') }}
        </div>
    </div>
</template>

<script lang="ts">
import { PageName, SystemRole } from '@/common/constants';
import { Options, Vue } from 'vue-class-component';
import SelectRole from '../components/role-select/SelectRole.vue';
@Options({
    components: { SelectRole },
})
export default class SelectRolePage extends Vue {
    get selectRoleData() {
        return [
            {
                title: this.$t('auth.role.instructor'),
                role: SystemRole.INSTRUCTOR,
                description: this.$t('auth.role.description.instructor'),
            },
            {
                title: this.$t('auth.role.student'),
                role: 'student',
                description: this.$t('auth.role.description.student'),
            },
        ];
    }

    handleSkip() {
        this.$router.push({ name: PageName.LANDING_PAGE });
    }
}
</script>

<style lang="scss">
.select-role-container {
    padding: 13vh 22vw;
    height: 100vh;
    background: $color-gray-05;
}

.select-role-title {
    color: $color-gray-01;
    font-weight: 700;
    font-size: 32px;
    line-height: 48px;
    padding-bottom: 7vh;
}

.skip-button {
    padding-top: 4vh;

    &:hover {
        color: $color-blue-auth-banner;
        cursor: pointer;
    }
}

.role-selector {
    gap: 16px;
}

.double-arrow {
    color: blue;
    padding-right: 4px;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
    .select-role-container {
        padding: 13vh 10vw;
    }
}
</style>
