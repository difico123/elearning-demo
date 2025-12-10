<template>
    <div>
        <el-dialog
            :width="'70%'"
            v-model="isShowStudentListPopup"
            @close="closeStudentListPopup"
            :title="
                studentListMode === StudentListMode.INSIDE
                    ? $t('course.courseDetail.showStudentList')
                    : $t('course.courseDetail.showOutsideStudentList')
            "
        >
            <div class="d-flex flex-row pb-4">
                <div
                    class="option-button"
                    :class="{
                        'option-button-active':
                            studentListMode === StudentListMode.INSIDE ? true : false,
                    }"
                    @click="handleChangeStudentListMode(StudentListMode.INSIDE)"
                >
                    {{ $t('course.studentListMode.inside') }}
                </div>
                <div
                    class="option-button"
                    :class="{
                        'option-button-active':
                            studentListMode === StudentListMode.OUTSIDE ? true : false,
                    }"
                    @click="handleChangeStudentListMode(StudentListMode.OUTSIDE)"
                >
                    {{ $t('course.studentListMode.outside') }}
                </div>
            </div>
            <CourseStudentList v-if="studentListMode === StudentListMode.INSIDE" />
            <OutsideCourseStudentList
                v-if="studentListMode === StudentListMode.OUTSIDE"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { commonModule } from '@/modules/common/store/common.store';
import { user } from '@/modules/user/locale/en/user.en';
import { Options, Vue } from 'vue-class-component';
import { StudentListMode } from '../../constants/course.constants';
import { userCourseModule } from '../../store/user-course.store';
import CourseStudentList from './CourseStudentList.vue';
import OutsideCourseStudentList from './OutsideCourseStudentList.vue';

@Options({
    components: { CourseStudentList, OutsideCourseStudentList },
})
export default class CourseStudentListPopup extends Vue {
    StudentListMode = StudentListMode;
    get studentListMode() {
        return userCourseModule.studentListMode;
    }

    get isShowStudentListPopup() {
        return commonModule.isShowStudentListPopup;
    }

    handleChangeStudentListMode(mode: string) {
        userCourseModule.setStudentListMode(mode);
    }

    closeStudentListPopup() {
        commonModule.toggleShowStudentListPopup(false);
    }
}
</script>
<style lang="scss" scoped>
.option-button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 6px;
    white-space: nowrap;
    padding: 8px 20px;
    transition: all 0.44s ease 0s;
    background-color: $color-white;
    color: #000;
    cursor: pointer;
    &-active {
        color: $color-white;
        background-color: $color-violet-new-opacity-50;
    }
}

:deep(.el-dialog) {
    height: 70vh;
    overflow-y: auto !important;
}
</style>
