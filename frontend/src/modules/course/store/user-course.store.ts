import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/plugins/vuex/index';
import {
    ICourseData,
    IOutsideStudentCourseData,
    IStudentCourseData,
    IStudentCourseShortData,
    IUserCourseData,
} from '../constants/course.interfaces';
import { CourseListDisplayMode, StudentListMode } from '../constants/course.constants';
import { UserCourseStatus } from '@/modules/common/constants/common.interfaces';

@Module({ dynamic: true, namespaced: true, store, name: 'userCourse' })
class UserCourseModule extends VuexModule {
    userCourseData: IUserCourseData = {};
    favoriteCourse = false;
    userCourseListDisplayMode = CourseListDisplayMode.GRID;
    instructorCourseList: Array<ICourseData> = [];
    studentCourseList: Array<IStudentCourseData> = [];
    courseStudentList: Array<IStudentCourseShortData> = [];
    outsideCourseStudentList: Array<IOutsideStudentCourseData> = [];
    studentListMode: string = StudentListMode.INSIDE;

    @Action
    setUserCourseData(userCourseData: IUserCourseData) {
        this.SET_USER_COURSE_DATA(userCourseData || {});
    }

    @Mutation
    SET_USER_COURSE_DATA(userCourseData: IUserCourseData) {
        this.userCourseData = userCourseData;
    }

    @Action
    setFavoriteCourse(favoriteCourse: boolean) {
        this.SET_FAVORITE_COURSE(favoriteCourse);
    }

    @Mutation
    SET_FAVORITE_COURSE(favoriteCourse: boolean) {
        this.favoriteCourse = favoriteCourse;
    }

    @Action
    setUserCourseListDisplayMode(mode: string) {
        this.SET_USER_COURSE_LIST_DISPLAY_MODE(mode);
    }

    @Mutation
    SET_USER_COURSE_LIST_DISPLAY_MODE(mode: string) {
        this.userCourseListDisplayMode = mode;
    }

    @Action
    setInstructorCourseList(instructorCourseList: Array<ICourseData>) {
        this.SET_INSTRUCTOR_COURSE_LIST(instructorCourseList || []);
    }

    @Mutation
    SET_INSTRUCTOR_COURSE_LIST(instructorCourseList: Array<ICourseData>) {
        this.instructorCourseList = instructorCourseList;
    }

    @Action
    setStudentCourseList(studentCourseList: Array<IStudentCourseData>) {
        this.SET_STUDENT_COURSE_LIST(studentCourseList || []);
    }

    @Mutation
    SET_STUDENT_COURSE_LIST(studentCourseList: Array<IStudentCourseData>) {
        this.studentCourseList = studentCourseList;
    }

    @Action
    setCourseStudentList(courseStudentList: Array<IStudentCourseShortData>) {
        this.SET_COURSE_STUDENT_LIST(courseStudentList || []);
    }

    @Mutation
    SET_COURSE_STUDENT_LIST(courseStudentList: Array<IStudentCourseShortData>) {
        this.courseStudentList = courseStudentList;
    }

    @Action
    setOutsideCourseStudentList(
        outsideCourseStudentList: Array<IOutsideStudentCourseData>,
    ) {
        this.SET_OUTSIDE_COURSE_STUDENT_LIST(outsideCourseStudentList || []);
    }

    @Mutation
    SET_OUTSIDE_COURSE_STUDENT_LIST(
        outsideCourseStudentList: Array<IOutsideStudentCourseData>,
    ) {
        this.outsideCourseStudentList = outsideCourseStudentList;
    }

    @Action
    setStudentListMode(mode: string) {
        this.SET_STUDENT_LIST_MODE(mode);
    }

    @Mutation
    SET_STUDENT_LIST_MODE(mode: string) {
        this.studentListMode = mode;
    }
}
export const userCourseModule = getModule(UserCourseModule);
