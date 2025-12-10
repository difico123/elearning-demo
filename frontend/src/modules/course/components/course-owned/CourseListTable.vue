<template>
    <div class="course-list-table-wrapper d-flex w-100 flex-row align-items-center mb-2">
        <div
            class="d-flex w-100 flex-row align-items-center"
            :style="{ gap: userRole === SystemRole.STUDENT ? '2.5vw' : '5vw' }"
        >
            <div
                class="course-list-table-title text"
                @click="sortInstructorTable('name')"
            >
                {{ $t('course.table.title') }}
            </div>
            <div class="course-list-table-image"></div>
            <div
                class="course-list-table-description text"
                @click="sortInstructorTable('description')"
            >
                {{ $t('course.table.description') }}
            </div>
            <div
                class="course-list-table-rating d-flex flex-row align-items-center"
                @click="sortInstructorTable('avgRating')"
            >
                {{ $t('course.table.rating') }}
            </div>
            <div
                class="course-list-table-instructor"
                :style="{ width: userRole === SystemRole.STUDENT ? '140px' : '0' }"
                v-if="userRole === SystemRole.STUDENT"
                @click="sortInstructorTable('instructorName')"
            >
                {{ $t('course.table.instructor') }}
            </div>
            <div
                class="d-flex flex-row course-list-table-student"
                @click="sortInstructorTable('studentTotal')"
            >
                {{ $t('course.table.studentCount') }}
            </div>
        </div>
        <div class="price-tag" @click="sortInstructorTable('price')">
            {{ $t('course.table.price') }}
        </div>
    </div>
</template>

<script lang="ts">
import { SystemRole } from '@/common/constants';
import { userModule } from '@/modules/user/store/user.store';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import {
    ICourseData,
    IStudentCourseData,
    IUserCourseData,
} from '../../constants/course.interfaces';
import { getPriceBackgroundColor } from '../../helpers/commonFunctions';
import { userCourseModule } from '../../store/user-course.store';
type IInstructorCourseDataKeys = keyof ICourseData;
type IStudentCourseDataKeys = keyof IStudentCourseData;

@Options({
    components: {},
})
export default class CourseListItem extends Vue {
    @Prop({ default: '' }) readonly course!: ICourseData;
    getPriceBackgroundColor(price: number) {
        return getPriceBackgroundColor(price);
    }

    sortDesc = true;

    SystemRole = SystemRole;

    get userRole() {
        return userModule.userData.role;
    }

    get userData() {
        return userModule.userData;
    }

    get userCourseList(): Array<IStudentCourseData> | Array<ICourseData> {
        if (this.userData.role === SystemRole.STUDENT)
            return userCourseModule.studentCourseList;
        if (this.userData.role === SystemRole.INSTRUCTOR)
            return userCourseModule.instructorCourseList;
        return [];
    }

    get instructorCourseList() {
        return userCourseModule.instructorCourseList;
    }

    get studentCourseList() {
        return userCourseModule.studentCourseList;
    }

    sortInstructorTable(type: IInstructorCourseDataKeys = 'name') {
        this.sortDesc = !this.sortDesc;
        if (this.sortDesc) {
            userCourseModule.setInstructorCourseList(
                this.instructorCourseList.sort((a: ICourseData, b: ICourseData) => {
                    let sa = a[type] as string;
                    let sb = b[type] as string;
                    return sa > sb ? 1 : -1;
                }),
            );
        } else {
            userCourseModule.setInstructorCourseList(
                this.instructorCourseList.sort((a: ICourseData, b: ICourseData) => {
                    let sa = a[type] as string;
                    let sb = b[type] as string;
                    return sa < sb ? 1 : -1;
                }),
            );
        }
    }

    sortStudentTable(type: IStudentCourseDataKeys = 'name') {
        this.sortDesc = !this.sortDesc;
        if (this.sortDesc) {
            userCourseModule.setStudentCourseList(
                this.studentCourseList.sort(
                    (a: IStudentCourseData, b: IStudentCourseData) => {
                        let sa = a[type] as string;
                        let sb = b[type] as string;
                        return sa > sb ? 1 : -1;
                    },
                ),
            );
        } else {
            userCourseModule.setStudentCourseList(
                this.studentCourseList.sort(
                    (a: IStudentCourseData, b: IStudentCourseData) => {
                        let sa = a[type] as string;
                        let sb = b[type] as string;
                        return sa < sb ? 1 : -1;
                    },
                ),
            );
        }
    }
}
</script>
<style lang="scss" scoped>
.course-list-table {
    &-wrapper {
        padding: 10px 32px;
        background-color: #ffffffdd;
        border-radius: 12px;
        cursor: pointer;
        color: #000;
        font-weight: bold;
        gap: 2.5vw;
    }

    &-image {
        width: 120px !important;
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
    width: 80px !important;
    text-align: center;
    border-radius: 10px;
    color: #000;
}
</style>
