import { PageName } from '@/common/constants';
import { RouteRecordRaw } from 'vue-router';
import LandingPage from '@/modules/landing/pages/LandingPage.vue';
import MainLayout from '@/modules/landing/components/layouts/MainLayout.vue';
const landingRouters: Array<RouteRecordRaw> = [
    {
        path: '',
        component: MainLayout,
        meta: {
            isPublic: true,
        },
        children: [
            {
                path: '',
                name: PageName.LANDING_PAGE,
                component: LandingPage,
            },
        ],
    },
];

export default landingRouters;
