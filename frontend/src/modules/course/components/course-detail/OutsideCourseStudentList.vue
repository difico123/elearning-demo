<template>
    <div class="student-filter d-flex w-100 gap-4">
        <el-input
            class="input keyword"
            :placeholder="$t('course.filters.keyword')"
            v-model="keyword"
            autocomplete="off"
            size="large"
        />
        <div class="sort-button" @click="handleApplyFilter">
            {{ $t('course.filters.apply') }}
        </div>
    </div>
    <div class="student-list-wrapper d-flex flex-column pt-3">
        <BaseNoResult
            v-if="outsideCourseStudentList.length === 0"
            :message="$t('course.errors.emptyStudentList')"
        />
        <div
            class="student-card d-flex flex-row align-items-center justify-content-between w-100"
            v-for="(student, index) in outsideCourseStudentList"
            :key="student.id"
        >
            <span class="student counter" style="width: 30px">{{ index + 1 }}</span>
            <div class="student avatar">
                <img :src="student.avatar" width="40" alt="" style="border-radius: 50%" />
            </div>
            <span class="student username">{{ student.username }}</span>
            <span class="student email">{{ student.email }}</span>

            <div
                class="invite-button"
                @click="handleStudentAction('add', student.userId)"
            >
                {{ $t('course.studentListMode.invite') }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { IGetListDefaultParams } from '@/common/interfaces';
import {
    UserActionDto,
    UserCourseStatus,
} from '@/modules/common/constants/common.interfaces';
import { commonModule } from '@/modules/common/store/common.store';
import { Options, Vue } from 'vue-class-component';
import {
    DEFAULT_SELECTED_PAGE,
    DEFAULT_STUDENT_COUNT_PER_PAGE,
} from '../../constants/course.constants';
import { studentAction } from '../../services/course';
import { getOutsideCourseStudentList } from '../../services/user-course';
import { userCourseModule } from '../../store/user-course.store';

@Options({
    components: {},
})
export default class CourseOutsideStudentList extends Vue {
    UserCourseStatus = UserCourseStatus;
    keyword = '';
    get outsideCourseStudentList() {
        return userCourseModule.outsideCourseStudentList;
    }

    async initOutsideCourseStudentList() {
        const courseId = this.$route.params.courseId as string;
        commonModule.setLoadingIndicator(true);
        const params: IGetListDefaultParams = {
            keyword: (this.keyword && this.keyword) || undefined,
            page: DEFAULT_SELECTED_PAGE,
            pageSize: DEFAULT_STUDENT_COUNT_PER_PAGE,
        };
        const response = await getOutsideCourseStudentList(params, courseId);
        if (response?.success) {
            userCourseModule.setOutsideCourseStudentList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getStudentListError') },
            ];
            userCourseModule.setOutsideCourseStudentList([]);
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async handleStudentAction(type: UserActionDto['type'], studentId: string) {
        commonModule.setLoadingIndicator(true);
        const courseId = this.$route.params.courseId as string;

        const response = await studentAction(type, +courseId, studentId);
        if (response.success) {
            showSuccessNotificationFunction('Success');

            await this.initOutsideCourseStudentList();
        } else {
            let res = response?.errors || [
                { message: this.$t('common.error.systemError') },
            ];
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async handleApplyFilter() {
        this.initOutsideCourseStudentList();
    }

    async created() {
        await this.initOutsideCourseStudentList();
    }
}
</script>
<style lang="scss" scoped>
.student-list-wrapper {
    gap: 12px;
}

.student-card {
    padding: 12px 18px;
    border-radius: 6px;
    border: 1px solid $color-violet-new-opacity-50;
}

.username {
    width: 25%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
}

.email {
    width: 30%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sort-button {
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

.invite-button {
    font-size: 14px !important;
    font-weight: 600 !important;
    line-height: 18px !important;
    border-radius: 6px;
    white-space: nowrap;
    padding: 4px 16px;
    transition: all 0.44s ease 0s;
    background-color: $color-violet-new-opacity-50;
    color: $color-white;
    cursor: pointer;
    &:hover {
        color: $color-white;
        background-color: $color-violet-new-1;
    }
}
</style>
