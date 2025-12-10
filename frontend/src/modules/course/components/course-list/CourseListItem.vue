<template>
    <div
        class="course-list-item-wrapper d-flex w-100 flex-row align-items-center"
        @click="handleCourseClick(course.id)"
    >
        <div class="d-flex w-100 flex-row align-items-center" style="gap: 2.5vw">
            <div class="course-list-item-title text">
                {{ course.name }}
            </div>
            <div class="course-list-item-image">
                <img :src="course.image" width="120" height="72" alt="" />
            </div>
            <div class="course-list-item-description text">
                {{ course.description }}
            </div>
            <div class="course-list-item-rating d-flex flex-row align-items-center">
                <span>{{
                    Math.round(course.avgRating * 100) / 100 ||
                    $t('course.course.notRated')
                }}</span>
                <img
                    v-if="course.avgRating"
                    src="@/assets/landing/icons/star.svg"
                    width="16"
                    alt=""
                    class="mx-1"
                />
            </div>
            <div class="course-list-item-instructor">
                {{ course.instructorName }}
            </div>
            <div class="d-flex flex-row course-grid-item-infos">
                <span>
                    {{ course.studentTotal || 0 }}
                </span>
                <img src="@/assets/landing/icons/student.svg" width="16" alt="" />
            </div>
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
.course-list-item {
    &-wrapper {
        padding: 10px 32px;
        background-color: $color-white;
        border-radius: 12px;
        border: 3px solid transparent;
        cursor: pointer;
        transition: all 0.66s ease-in-out;
        &:hover {
            background: $color-accent-violet-03;
            border: 3px solid $color-violet-new-2;
        }
    }

    &-title {
        width: 16vw;
        font-size: 18px;
        font-weight: 600;
    }

    &-description {
        width: 20vw;
        font-weight: 600;
    }

    &-instructor {
        width: 170px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &-rating {
        width: 7vw;
    }
}

.text {
    display: block;
    display: -webkit-box;
    line-height: 150%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.price-tag {
    padding: 5px 0;
    width: 80px !important;
    text-align: center;
    border-radius: 10px;
    color: $color-white;
}
</style>
