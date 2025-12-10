import { PageName } from '@/common/constants';
import { RouteRecordRaw } from 'vue-router';
import CourseListPage from '@/modules/course/pages/CourseListPage.vue';
import CreateCoursePage from '@/modules/course/pages/CreateCoursePage.vue';
import CourseDetailPage from '@/modules/course/pages/CourseDetailPage.vue';
import CoursePreviewPage from '@/modules/course/pages/CoursePreviewPage.vue';
import AcceptedPaymentPage from '@/modules/course/pages/AcceptedPaymentPage.vue';
import DeclinedPaymentPage from '@/modules/course/pages/DeclinedPaymentPage.vue';
import UserCourseListPage from '@/modules/course/pages/UserCourseListPage.vue';
import MainLayout from '@/modules/landing/components/layouts/MainLayout.vue';
import NoStyleLayout from '@/modules/landing/components/layouts/NoStyleLayout.vue';

const courseRouters: Array<RouteRecordRaw> = [
    {
        path: '/category/:id',
        component: MainLayout,
        meta: {
            isPublic: true,
        },
        children: [
            {
                path: '',
                name: PageName.COURSE_LIST_PAGE,
                component: CourseListPage,
            },
        ],
    },
    {
        path: '/course',
        component: MainLayout,
        meta: {
            isPublic: true,
        },
        children: [
            {
                path: ':courseId',
                name: PageName.COURSE_PREVIEW_PAGE,
                component: CoursePreviewPage,
            },
            {
                path: 'create',
                name: PageName.CREATE_COURSE_PAGE,
                component: CreateCoursePage,
            },
            {
                path: ':courseId/:code',
                name: PageName.ACCEPTED_PAYMENT_PAGE,
                component: AcceptedPaymentPage,
            },
            {
                path: ':courseId/cancel',
                name: PageName.DECLINED_PAYMENT_PAGE,
                component: DeclinedPaymentPage,
            },
        ],
    },
    {
        path: '/course-detail',
        component: NoStyleLayout,
        meta: {
            isPublic: true,
        },
        children: [
            {
                path: ':courseId',
                name: PageName.COURSE_DETAIL_PAGE,
                component: CourseDetailPage,
            },
        ],
    },
    {
        path: '/my-courses',
        component: MainLayout,
        meta: {
            isPublic: true,
        },
        children: [
            {
                path: '',
                name: PageName.USER_COURSE_LIST_PAGE,
                component: UserCourseListPage,
            },
        ],
    },
];

export default courseRouters;
