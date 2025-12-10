<template>
    <div></div>
</template>
<script lang="ts">
import { PageName } from '@/common/constants';
import { showErrorNotificationFunction } from '@/common/helpers';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class CreatePasswordPage extends Vue {
    created() {
        const courseId = this.$route.params.courseId as string;
        this.redirectToCoursePage(courseId);
    }
    async redirectToCoursePage(courseId: string) {
        showErrorNotificationFunction(this.$t('course.errors.declinedPayment'));
        setTimeout(
            () =>
                this.$router.push({
                    name: PageName.COURSE_DETAIL_PAGE,
                    params: { courseId: courseId },
                }),
            3000,
        );
    }
}
</script>
<style lang="scss" scoped></style>
