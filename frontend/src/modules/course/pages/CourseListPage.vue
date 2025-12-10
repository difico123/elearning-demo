<template>
    <div class="display-options d-flex flex-row justify-content-between">
        <div class="d-flex flex-row gap-3">
            <img
                @click="handleGridClick()"
                src="@/assets/course/icons/display-grid.png"
                :class="{
                    'active-display':
                        courseListDisplayMode === CourseListDisplayMode.GRID,
                }"
                alt=""
                class="display-button"
            />
            <img
                @click="handleListClick()"
                src="@/assets/course/icons/display-list.png"
                alt=""
                :class="{
                    'active-display':
                        courseListDisplayMode === CourseListDisplayMode.LIST,
                }"
                class="display-button"
            />
        </div>
    </div>
    <SortTable />
    <CourseListTable v-if="courseListDisplayMode === CourseListDisplayMode.LIST" />
    <BaseNoResult
        v-if="courseList?.length === 0"
        :message="$t('course.errors.emptyCourseList')"
    />
    <div class="course-list-page-wrapper">
        <CourseGrid v-if="courseListDisplayMode === CourseListDisplayMode.GRID" />
        <CourseList v-if="courseListDisplayMode === CourseListDisplayMode.LIST" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CourseGrid from '../components/course-list/CourseGrid.vue';
import CourseList from '../components/course-list/CourseList.vue';
import SortTable from '../components/course-list/SortTable.vue';
import CourseListTable from '../components/course-list/CourseListTable.vue';
import {
    CourseListDisplayMode,
    MAX_COURSE_GRID_ITEMS,
} from '../constants/course.constants';
import { showErrorNotificationFunction } from '@/common/helpers';
import { commonModule } from '@/modules/common/store/common.store';
import { getInstructorList } from '@/modules/common/services/common';
import { courseModule } from '../store/course.store';
import { getCourseList } from '../services/course';

@Options({
    components: { CourseGrid, CourseList, CourseListTable, SortTable },
})
export default class CourseListPage extends Vue {
    CourseListDisplayMode = CourseListDisplayMode;
    get courseList() {
        return courseModule.courseList;
    }
    get courseListDisplayMode() {
        return courseModule.courseListDisplayMode;
    }
    handleGridClick() {
        courseModule.setCourseListDisplayMode(CourseListDisplayMode.GRID);
    }
    handleListClick() {
        courseModule.setCourseListDisplayMode(CourseListDisplayMode.LIST);
    }

    async initInstructorList() {
        commonModule.setLoadingIndicator(true);
        const response = await getInstructorList();
        if (response.success) {
            commonModule.setInstructorList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getInstructorListError') },
            ];
            commonModule.setInstructorList([]);
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async getCourseList() {
        commonModule.setLoadingIndicator(true);
        courseModule.setCourseListDisplayMode(CourseListDisplayMode.GRID);
        const id: number = parseInt(this.$route.params.id as string);
        const response = await getCourseList({
            pageSize: MAX_COURSE_GRID_ITEMS,
            categoryId: id,
        });
        if (response.success) {
            courseModule.setCourseList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getCourseList') },
            ];
            courseModule.setCourseList([]);
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async initCoursePage() {
        await this.getCourseList();
        await this.initInstructorList();
    }

    async created() {
        await this.initCoursePage();
    }
}
</script>
<style lang="scss" scoped>
.display-options {
    padding-bottom: 20px;
}

.active-display {
    background-color: $color-violet-new-1 !important;
}
.display-button {
    padding: 10px;
    background-color: $color-white;
    border-radius: 8px;
    width: 50px;
    height: 50px;
    cursor: pointer;
}
</style>
