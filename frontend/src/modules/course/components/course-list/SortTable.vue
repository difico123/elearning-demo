<template>
    <div
        class="sort-table-wrapper d-flex w-100 flex-xl-row flex-column align-items-center mb-5 py-3"
        style="gap: 2.5vw"
    >
        <div class="sort-table-title">
            {{ $t('course.filters.title') }}
        </div>
        <div
            class="sort-fields d-flex flex-xl-row flex-column w-100"
            style="flex-grow: 1"
        >
            <el-input
                class="input keyword"
                style="width: 60%"
                :placeholder="$t('course.filters.keyword')"
                @keyup.enter="handleApplyFilter"
                v-model="courseQuery.keyword"
                autocomplete="off"
                size="large"
            />
            <div class="d-flex flex-row" style="gap: 25px">
                <el-select
                    class="input rating"
                    style="width: 40%"
                    size="large"
                    v-model="courseQuery.rating"
                    :placeholder="$t('course.table.rating')"
                >
                    <el-option
                        v-for="item in ratingList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>

                <el-select
                    class="input instructor"
                    style="width: 60%"
                    v-model="courseQuery.instructorIds"
                    size="large"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    :placeholder="$t('course.table.instructor')"
                >
                    <el-option
                        v-for="instructor in instructorList"
                        :key="instructor.id"
                        :label="instructor.username"
                        :value="instructor.id"
                    />
                </el-select>
            </div>
        </div>
        <div class="sort-table-button" @click="handleApplyFilter">
            {{ $t('course.filters.apply') }}
        </div>
    </div>
</template>

<script lang="ts">
import { showErrorNotificationFunction } from '@/common/helpers';
import { commonModule } from '@/modules/common/store/common.store';
import { Options, Vue } from 'vue-class-component';
import { MAX_COURSE_LIST_ITEMS } from '../../constants/course.constants';
import { ICourseListParams } from '../../constants/course.interfaces';
import { getCourseList } from '../../services/course';
import { courseModule } from '../../store/course.store';

@Options({
    components: {},
})
export default class SortTable extends Vue {
    get ratingList() {
        return [
            { label: this.$t('course.course.ratingList.five'), value: 5 },
            { label: this.$t('course.course.ratingList.four'), value: 4 },
            { label: this.$t('course.course.ratingList.three'), value: 3 },
            { label: this.$t('course.course.ratingList.two'), value: 2 },
            { label: this.$t('course.course.ratingList.one'), value: 1 },
            { label: this.$t('course.course.ratingList.none'), value: 0 },
        ];
    }

    get instructorList() {
        return commonModule.instructorList;
    }

    courseQuery = {
        keyword: '',
        rating: '',
        instructorIds: [],
    };

    async handleApplyFilter() {
        const params: ICourseListParams = {
            keyword: (this.courseQuery.keyword && this.courseQuery.keyword) || undefined,
            rating: (this.courseQuery.rating && this.courseQuery.rating) || undefined,
            instructorIds:
                (
                    this.courseQuery.instructorIds && this.courseQuery.instructorIds
                ).toString() || undefined,
        };
        const id: number = parseInt(this.$route.params.id as string);
        commonModule.setLoadingIndicator(true);
        const response = await getCourseList({
            ...params,
            pageSize: MAX_COURSE_LIST_ITEMS,
            categoryId: id,
        });
        if (response.success) {
            courseModule.setCourseList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getCourseListError') },
            ];
            courseModule.setCourseList([]);
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }
}
</script>
<style lang="scss" scoped>
.sort-fields {
    gap: 25px;
}
.sort-table {
    &-wrapper {
        padding: 10px 32px;
        background-color: #ffffffdd;
        border-radius: 12px;
        color: #000;
        font-weight: bold;
        gap: 2.5vw;
    }

    &-title {
        font-size: 18px;
        font-weight: 600;
        width: 14vw !important;
    }

    &-button {
        font-size: 17px !important;
        font-weight: 600 !important;
        line-height: 24px !important;
        border-radius: 6px;
        white-space: nowrap;
        padding: 8px 20px;
        transition: all 0.44s ease 0s;
        background-color: $color-violet-new-1;
        border: 1px solid transparent;
        color: $color-white;
        cursor: pointer;
        &:hover {
            color: $color-white;
            background-color: $color-violet-new-opacity-50;
            border: 1px solid $color-violet-new-opacity-50;
        }
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xl)) {
    .keyword {
        width: 100% !important;
    }
    .sort-fields {
        gap: 10px;
        width: 100%;
    }
}
</style>
