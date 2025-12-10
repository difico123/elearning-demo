import authRouters from '@/modules/auth/router/routers';
import landingRouters from '@/modules/landing/router/routers';
import commonRouters from '@/modules/common/router/routers';
import userRouters from '@/modules/user/router/routers';
import courseRouters from '@/modules/course/router/routers';

export const routers = [
    ...authRouters,
    ...commonRouters,
    ...landingRouters,
    ...userRouters,
    ...courseRouters,
];
