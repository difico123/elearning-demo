<template>
    <div></div>
</template>
<script lang="ts">
import { PageName } from '@/common/constants';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { commonModule } from '@/modules/common/store/common.store';
import { Options, Vue } from 'vue-class-component';
import { course } from '../locale/en/course.en';
import { courseCheckoutVerify } from '../services/user-course';

@Options({
    components: {},
})
export default class CreatePasswordPage extends Vue {
    created() {
        const courseId = this.$route.params.courseId as string;
        const code = this.$route.params.code as string;
        this.courseCheckoutVerify(courseId, code);
    }
    async courseCheckoutVerify(courseId: string, code: string) {
        commonModule.setLoadingIndicator(true);
        const response = await courseCheckoutVerify(courseId, code);
        if (response?.success) {
            showSuccessNotificationFunction(
                this.$t('course.success.courseCheckout.successPayment'),
            );
        } else {
            showErrorNotificationFunction(this.$t('course.errors.declinedPayment'));
        }
        commonModule.setLoadingIndicator(false);
        setTimeout(
            () =>
                this.$router.push({
                    name: PageName.COURSE_DETAIL_PAGE,
                    params: { courseId: courseId },
                }),
            2000,
        );
    }
}
</script>
<style lang="scss" scoped></style>
