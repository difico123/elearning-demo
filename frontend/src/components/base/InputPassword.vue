<template>
    <div class="form-group d-flex mb-3" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="fw-bold text-start mb-2"
            :class="{ 'w-100': !isHorizontal, 'label mt-1': isHorizontal }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div
            class="position-relative"
            :class="{ 'w-100': !isHorizontal, input: isHorizontal }"
        >
            <el-input
                v-model="inputData"
                autocomplete="off"
                :placeholder="placeholder"
                :type="isShowPassword ? 'text' : 'password'"
                :readonly="isReadonly"
                :disabled="isDisabled"
            >
                <template #suffix>
                    <div
                        class="input-password-icon mr-3"
                        @click="isShowPassword = !isShowPassword"
                    >
                        <i v-if="isShowPassword" class="fa fa-eye fa-2" />
                        <i v-else class="fa fa-eye-slash fa-2" />
                    </div>
                </template>
            </el-input>
            <div class="validation-error text-start d-block">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class InputPassword extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: false }) readonly isHorizontal!: boolean;

    isShowPassword = false;

    @Model('value', { type: [String, Number] })
    readonly inputData!: string;
}
</script>

<style lang="scss" scoped>
.input-password-icon {
    cursor: pointer;
}

:deep(.el-input__inner) {
    height: 48px !important;
}
.fa {
    font-size: 16px;
}
.mark-required {
    color: red;
}

.validation-error {
    font-size: 12px;
    color: $color-red-01;
    margin: 5px 0;
}
</style>
