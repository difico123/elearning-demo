<template>
    <div class="display-options d-flex flex-row justify-content-between">
        <div class="d-flex flex-row gap-3">
            <img
                @click="handleGridClick()"
                src="@/assets/course/icons/display-grid.png"
                :class="{
                    'active-display':
                        userCourseListDisplayMode === CourseListDisplayMode.GRID,
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
                        userCourseListDisplayMode === CourseListDisplayMode.LIST,
                }"
                class="display-button"
            />
        </div>
        <div
            v-if="userRole === SystemRole.INSTRUCTOR"
            @click="handleCreateCourse"
            class="courses-button"
        >
            {{ $t('course.course.createCourse') }}
        </div>
    </div>
    <SortTable />

    <CourseListTable v-if="userCourseListDisplayMode === CourseListDisplayMode.LIST" />
    <BaseNoResult
        v-if="studentCourseList?.length === 0 && instructorCourseList.length === 0"
        :message="$t('course.errors.emptyCourseList')"
    />
    <div v-if="userRole === SystemRole.INSTRUCTOR">
        <InstructorCourseList
            v-if="userCourseListDisplayMode === CourseListDisplayMode.LIST"
        />
        <InstructorCourseGrid
            v-if="userCourseListDisplayMode === CourseListDisplayMode.GRID"
        />
    </div>
    <div v-if="userRole === SystemRole.STUDENT">
        <StudentCourseList
            v-if="userCourseListDisplayMode === CourseListDisplayMode.LIST"
        />
        <StudentCourseGrid
            v-if="userCourseListDisplayMode === CourseListDisplayMode.GRID"
        />
    </div>
</template>

<script lang="ts">
import { PageName, SystemRole } from '@/common/constants';
import { userModule } from '@/modules/user/store/user.store';
import { Options, Vue } from 'vue-class-component';
import {
    CourseListDisplayMode,
    MAX_COURSE_GRID_ITEMS,
} from '../constants/course.constants';
import { userCourseModule } from '../store/user-course.store';
import { commonModule } from '@/modules/common/store/common.store';
import { getInstructorList } from '@/modules/common/services/common';
import { showErrorNotificationFunction } from '@/common/helpers';
import { getCourseList } from '../services/course';
import { getInstructorCourseList, getStudentCourseList } from '../services/user-course';
import localStorageTokenService from '@/common/tokenService';

import InstructorCourseList from '../components/course-owned/InstructorCourseList.vue';
import InstructorCourseGrid from '../components/course-owned/InstructorCourseGrid.vue';
import StudentCourseList from '../components/course-owned/StudentCourseList.vue';
import StudentCourseGrid from '../components/course-owned/StudentCourseGrid.vue';
import SortTable from '../components/course-owned/SortTable.vue';
import CourseListTable from '../components/course-owned/CourseListTable.vue';

@Options({
    components: {
        InstructorCourseList,
        InstructorCourseGrid,
        StudentCourseList,
        StudentCourseGrid,
        SortTable,
        CourseListTable,
    },
})
export default class UserCourseListPage extends Vue {
    CourseListDisplayMode = CourseListDisplayMode;

    SystemRole = SystemRole;

    get userRole() {
        return userModule.userData.role;
    }

    get instructorCourseList() {
        return userCourseModule.instructorCourseList;
    }

    get studentCourseList() {
        return userCourseModule.studentCourseList;
    }

    get userData() {
        return userModule.userData;
    }

    get userCourseListDisplayMode() {
        return userCourseModule.userCourseListDisplayMode;
    }
    handleGridClick() {
        userCourseModule.setUserCourseListDisplayMode(CourseListDisplayMode.GRID);
    }
    handleListClick() {
        userCourseModule.setUserCourseListDisplayMode(CourseListDisplayMode.LIST);
    }

    handleCreateCourse() {
        this.$router.push({ name: PageName.CREATE_COURSE_PAGE });
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

    async getInstructorCourseList() {
        commonModule.setLoadingIndicator(true);
        const response = await getInstructorCourseList({
            pageSize: MAX_COURSE_GRID_ITEMS,
        });
        if (response.success) {
            userCourseModule.setInstructorCourseList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getCourseList') },
            ];
            userCourseModule.setInstructorCourseList([]);
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async getStudentCourseList() {
        commonModule.setLoadingIndicator(true);
        const response = await getStudentCourseList({
            pageSize: MAX_COURSE_GRID_ITEMS,
        });

        if (response.success) {
            userCourseModule.setStudentCourseList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getCourseList') },
            ];
            userCourseModule.setStudentCourseList([]);
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async initUserCourseListPage() {
        await this.initInstructorList();

        if (this.userData.role === SystemRole.INSTRUCTOR) {
            await this.getInstructorCourseList();
        }
        if (this.userData.role === SystemRole.STUDENT) {
            await this.getStudentCourseList();
        }
    }

    async created() {
        if (!localStorageTokenService.getAccessToken()) {
            this.$router.push({ name: PageName.LOGIN_PAGE });
        }
        if (this.userRole === SystemRole.GUEST) {
            showErrorNotificationFunction(this.$t('course.errors.chooseRole'));
            setTimeout(
                () => this.$router.push({ name: PageName.SELECT_ROLE_PAGE }),
                2000,
            );
        }
        await this.initUserCourseListPage();
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

.courses-button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 8px;
    white-space: nowrap;
    padding: 12px 24px;
    color: $color-gray-01;
    background-color: #f2f2f2;
    border: 1px solid black;
    transition: all 0.44s ease 0s;
    cursor: pointer;
    &:hover {
        background-color: #e3e3e3;
    }
}
</style>
