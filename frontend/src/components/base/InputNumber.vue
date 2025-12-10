<template>
    <div class="form-group flex-column position-relative">
        <label class="fw-bold text-start mb-2 d-flex align-items-center" v-if="label"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span></label
        >
        <el-input
            v-model="inputData"
            type="number"
            :placeholder="placeholder"
            :readonly="isReadonly"
            :disabled="isDisabled"
            :error="true"
            :min="min"
            :max="max"
            @keydown="preventInput"
            @change="onChange"
        />
        <div class="validation-error text-start" :class="{ 'd-block': error }">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { AllowIntegerCodes, AllowDecimalCodes } from '@/common/constants';
import { Model, Prop, Vue } from 'vue-property-decorator';
export default class InputNumber extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly min!: number;
    @Prop({ default: NaN }) readonly max!: number;
    @Prop({ default: false }) readonly allowDecimal!: boolean;

    @Model('value', { type: Number })
    readonly inputData!: number;

    preventInput(event: KeyboardEvent): void {
        switch (event.key) {
            // allow paste
            // allow copy
            // allow select all
            case 'v':
            case 'c':
            case 'a':
                if (!event.ctrlKey) {
                    event.preventDefault();
                }
                break;

            default:
                if (!this.allowDecimal) {
                    if (!AllowIntegerCodes.includes(event.code)) {
                        event.preventDefault();
                    }
                } else {
                    if (!AllowDecimalCodes.includes(event.code)) {
                        event.preventDefault();
                    }
                }
                break;
        }
    }
}
</script>

<style lang="scss" scoped>
// :deep(.el-input__inner::-webkit-outer-spin-button),
// :deep(.el-input__inner::-webkit-inner-spin-button) {
//     -webkit-appearance: none;
//     margin: 0;
// }

:deep(.el-input__inner) {
    height: 48px !important;
}

.validation-error {
    font-size: 12px;
    color: $color-red-01;
    margin: 5px 0;
}

.is-error {
    :deep(.el-input .el-input__wrapper) {
        box-shadow: 0 0 0 1px $color-red-01;
        background-color: $color-green-03;
    }
    label {
        color: $color-red-01;
    }
}
</style>
