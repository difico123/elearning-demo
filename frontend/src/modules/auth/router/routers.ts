import { PageName } from '@/common/constants';
import { RouteRecordRaw } from 'vue-router';
import AuthLayout from '@/modules/auth/components/layouts/common/AuthLayout.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import CreatePasswordPage from '../pages/CreatePasswordPage.vue';
import SelectRolePage from '../pages/SelectRolePage.vue';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.vue';
import ResetPasswordPage from '../pages/ResetPasswordPage.vue';
const authRouters: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                name: PageName.LOGIN_PAGE,
                component: LoginPage,
            },
            {
                path: 'register',
                name: PageName.REGISTER_PAGE,
                component: RegisterPage,
            },
            {
                path: 'create-password/:token',
                name: PageName.CREATE_PASSWORD_PAGE,
                component: CreatePasswordPage,
            },
            {
                path: 'forgot-password',
                name: PageName.FORGOT_PASSWORD_PAGE,
                component: ForgotPasswordPage,
            },
            {
                path: 'reset-password',
                name: PageName.RESET_PASSWORD_PAGE,
                component: ResetPasswordPage,
            },
        ],
    },
    {
        path: '/',
        component: AuthLayout,
        children: [
            {
                path: 'reset-password',
                name: PageName.RESET_PASSWORD_PAGE,
                component: ResetPasswordPage,
            },
        ],
    },

    {
        path: '/select-role',
        name: PageName.SELECT_ROLE_PAGE,
        component: SelectRolePage,
    },
];

export default authRouters;
