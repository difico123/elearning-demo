<template>
    <div
        class="course-grid-item-wrapper d-flex flex-column gap-3"
        @click="handleCourseClick(course.id)"
    >
        <div class="d-flex flex-row justify-content-between">
            <div class="course-grid-item-instructor" style="font-weight: bold">
                <img src="@/assets/landing/icons/student.svg" width="16" alt="" />
                <span>
                    {{ course.instructorName }}
                </span>
            </div>
            <div class="course-grid-item-rating d-flex flex-row align-items-center">
                <div v-if="course.avgRating">{{ $t('course.course.avgRating') }}</div>
                <div>
                    <span>{{
                        Math.round(course.avgRating * 100) / 100 ||
                        $t('course.course.notRated')
                    }}</span>
                    <img
                        class="mx-1 mb-1"
                        v-if="course.avgRating"
                        src="@/assets/landing/icons/star.svg"
                        width="16"
                        alt=""
                    />
                </div>
            </div>
        </div>
        <div class="course-grid-item-image">
            <img :src="course.image" width="320" height="180" alt="" />
        </div>
        <div class="course-grid-item-title text">
            {{ course.name }}
        </div>
        <div class="course-grid-item-description text">
            {{ course.description }}
        </div>
        <div
            class="d-flex flex-row course-grid-item-infos align-items-center justify-content-between pt-2"
        >
            <div class="course-grid-item-student" style="font-weight: bold">
                <span>
                    {{
                        $t('course.course.studentTotal', {
                            studentTotal: course.studentTotal || 0,
                        })
                    }}
                </span>
                <img src="@/assets/landing/icons/student.svg" width="16" alt="" />
            </div>
            <div
                class="price-tag"
                v-if="course.price"
                :style="{
                    'background-color': getPriceBackgroundColor(course.price),
                }"
            >
                {{ $t('course.course.price', { price: course.price }) }}
            </div>
            <div v-else class="price-tag" style="background-color: #3bb143">
                {{ $t('course.course.free') }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PageName } from '@/common/constants';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ICourseData } from '../../constants/course.interfaces';
import { getPriceBackgroundColor } from '../../helpers/commonFunctions';

@Options({
    components: {},
})
export default class CourseListItem extends Vue {
    @Prop({ default: '' }) readonly course!: ICourseData;
    getPriceBackgroundColor(price: number) {
        return getPriceBackgroundColor(price);
    }
    handleCourseClick(courseId: number) {
        this.$router.push({
            name: PageName.COURSE_PREVIEW_PAGE,
            params: {
                courseId,
            },
        });
    }
}
</script>
<style lang="scss" scoped>
.course-grid-item {
    &-wrapper {
        position: relative;
        cursor: pointer;
        border-radius: 4%;
        padding: 16px 24px 24px;
        background-color: $light-gray;
        box-shadow: rgb(0 0 0 / 35%) 0 9px 16px -8px, rgb(1 1 1 / 45%) 0 6px 12px -7px;
        transition: all 0.66s ease-in-out;
        border: 3px solid transparent;
        &:hover {
            background: $color-accent-violet-03;
            border: 3px solid $color-violet-new-2;
        }
    }

    &-rating {
        font-weight: bold;
    }

    &-title {
        font-size: 24px;
        line-height: 150%;
        font-weight: 600;
        height: 108px;
    }

    &-description {
        font-size: 15px;
        line-height: 150%;
        height: 68px;
    }
}

.price-tag {
    padding: 5px 16px;
    border-radius: 10px;
    color: white;
}

.text {
    max-width: 300px;
    display: block;
    display: -webkit-box;
    line-height: 150%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>
