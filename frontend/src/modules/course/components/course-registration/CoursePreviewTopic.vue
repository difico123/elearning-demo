<template>
    <div class="pb-4 course-p-topic-wrapper w-100">
        <div class="course-p-title">{{ $t('course.preview.content') }}</div>
        <div class="course-p-topic d-flex flex-column">
            <div
                class="course-p-topic-detail"
                v-for="topic in coursePreviewTopicList"
                :key="topic.id"
            >
                <div class="course-p-topic-title">
                    {{ topic.name }}
                </div>
                <div class="course-p-topic-description">
                    {{ topic.description }}
                </div>
            </div>
        </div>
        <BaseNoResult
            v-if="coursePreviewTopicList?.length === 0"
            :message="$t('course.errors.emptyTopicList')"
        />
        <BaseNoResult
            v-if="
                coursePreviewTopicList?.length > 0 &&
                userCourseData?.status === UserCourseStatus.REJECTED
            "
            :message="$t('course.errors.courseRejected')"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { UserCourseStatus } from '../../constants/course.constants';
import { courseModule } from '../../store/course.store';
import { userCourseModule } from '../../store/user-course.store';

@Options({
    components: {},
})
export default class CoursePreviewTopic extends Vue {
    UserCourseStatus = UserCourseStatus;
    get coursePreviewTopicList() {
        return courseModule.coursePreviewData?.topics;
    }

    get userCourseData() {
        return userCourseModule.userCourseData;
    }
}
</script>
<style lang="scss" scoped>
.course-p-title {
    padding: 0 6px;
    font-size: 27px;
    font-weight: 600;
}

.course-p-topic {
    padding-top: 30px;
    flex-grow: 1;
    &-wrapper {
        padding: 0 4vw;
    }

    &-detail {
        background-color: $color-violet-new-1-filter;
    }

    &-title {
        border-left: 4px solid $color-violet-new;
        padding: 5px 12px;
        background-color: $color-violet-new-1-opacity-30;
        font-size: 20px;
        font-weight: 600;
    }

    &-description {
        padding: 12px 2vw 25px;
        background-color: $color-white-opacity-30;
        font-size: 16px;
    }
}
</style>
