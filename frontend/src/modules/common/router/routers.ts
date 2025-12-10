import { PageName } from '@/common/constants';
import { RouteRecordRaw } from 'vue-router';
import NotFoundPage from '@/common/pages/NotFoundPage.vue';

const commonRouters: Array<RouteRecordRaw> = [
    {
        path: '/404',
        name: PageName.NOT_FOUND_PAGE,
        component: NotFoundPage,
        meta: {
            isPublic: true,
        },
    },
];

export default commonRouters;
