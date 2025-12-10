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
            v-if="courseStudentList.length === 0"
            :message="$t('course.errors.emptyStudentList')"
        />
        <div
            class="student-card d-flex flex-row align-items-center gap-3 w-100"
            v-for="(student, index) in courseStudentList"
            :key="student.id"
            :class="{
                'rejected-student':
                    student.status === UserCourseStatus.reject ? true : false,
            }"
        >
            <span class="student counter" style="width: 30px">{{ index + 1 }}</span>
            <div class="student avatar">
                <img :src="student.avatar" width="40" alt="" style="border-radius: 50%" />
            </div>
            <span class="student username">{{ student.username }}</span>
            <span class="student email">{{ student.email }}</span>
            <span class="student score" style="width: 8%">
                {{ student.score }}
            </span>
            <span class="student start-time" style="width: 10%">{{
                student.startCourseTime
            }}</span>
            <span class="student start-time" style="width: 10%">{{
                studentStatus(student.status)
            }}</span>
            <div class="actions d-flex flex-row" style="gap: 5px; justify-self: flex-end">
                <div
                    v-if="student.status !== UserCourseStatus.commentBlocking"
                    class="action"
                    @click="
                        handleStudentAction(
                            UserCourseStatus.commentBlocking,
                            student.userId,
                        )
                    "
                >
                    <img src="@/assets/course/icons/mute.png" width="20" alt="" />
                </div>
                <div
                    class="action"
                    v-else
                    @click="
                        handleStudentAction(UserCourseStatus.accepted, student.userId)
                    "
                >
                    <img src="@/assets/course/icons/check.svg" width="20" alt="" />
                </div>
                <div class="action" @click="handleStudentAction('kick', student.userId)">
                    <img src="@/assets/course/icons/door.png" width="20" alt="" />
                </div>
                <div
                    class="action"
                    v-if="student.status !== UserCourseStatus.reject"
                    @click="handleStudentAction(UserCourseStatus.reject, student.userId)"
                >
                    <img src="@/assets/course/icons/block.png" width="20" alt="" />
                </div>
                <div
                    class="action"
                    v-if="student.status === UserCourseStatus.reject"
                    @click="
                        handleStudentAction(UserCourseStatus.accepted, student.userId)
                    "
                >
                    <img src="@/assets/course/icons/check.svg" width="20" alt="" />
                </div>
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
import { getCourseStudentList } from '../../services/user-course';
import { userCourseModule } from '../../store/user-course.store';

@Options({
    components: {},
})
export default class CourseStudentList extends Vue {
    UserCourseStatus = UserCourseStatus;
    keyword = '';

    get courseStudentList() {
        return userCourseModule.courseStudentList;
    }

    studentStatus(status: UserCourseStatus) {
        switch (status) {
            case UserCourseStatus.pending: {
                return 'Đang chờ xử lý';
            }
            case UserCourseStatus.accepted: {
                return 'Bình Thường';
            }
            case UserCourseStatus.reject: {
                return 'Chặn';
            }
            case UserCourseStatus.expired: {
                return 'Hết hạn';
            }
            case UserCourseStatus.commentBlocking: {
                return 'Chặn chát';
            }
        }
        return '';
    }
    async initCourseStudentList() {
        const courseId = this.$route.params.courseId as string;
        commonModule.setLoadingIndicator(true);
        const params: IGetListDefaultParams = {
            keyword: (this.keyword && this.keyword) || undefined,
            page: DEFAULT_SELECTED_PAGE,
            pageSize: DEFAULT_STUDENT_COUNT_PER_PAGE,
        };
        const response = await getCourseStudentList(params, courseId);
        if (response?.success) {
            userCourseModule.setCourseStudentList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getStudentListError') },
            ];
            userCourseModule.setCourseStudentList([]);
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

            await this.initCourseStudentList();
        } else {
            let res = response?.errors || [
                { message: this.$t('common.error.systemError') },
            ];
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async handleApplyFilter() {
        this.initCourseStudentList();
    }

    async created() {
        await this.initCourseStudentList();
    }
}
</script>
<style lang="scss" scoped>
.student-list-button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 8px;
    white-space: nowrap;
    padding: 12px 24px;
    transition: all 0.44s ease 0s;
    &:hover {
        color: $color-white;
        background-color: $color-violet-new-opacity-50;
        border: 1px solid $color-violet-new-opacity-50;
    }
}

.student-list-wrapper {
    gap: 12px;
}

.student-card {
    padding: 12px 18px;
    border-radius: 6px;
    border: 1px solid red;
}
.action {
    cursor: pointer;
    color: red;
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

.rejected-student {
    text-decoration: line-through;
    background-color: #ff9a9a;
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
</style>
