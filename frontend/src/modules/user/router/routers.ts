import { PageName } from '@/common/constants';
import { RouteRecordRaw } from 'vue-router';
import UserProfilePage from '@/modules/user/pages/UserProfilePage.vue';
import MainLayout from '@/modules/landing/components/layouts/MainLayout.vue';
const userRouters: Array<RouteRecordRaw> = [
    {
        path: '/profile',
        component: MainLayout,
        meta: {
            isPublic: true,
        },
        children: [
            {
                path: '',
                name: PageName.USER_PROFILE_PAGE,
                component: UserProfilePage,
            },
        ],
    },
];

export default userRouters;
