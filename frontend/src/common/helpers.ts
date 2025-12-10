import { ILoginData } from '@/modules/auth/services/login';
import { loginModule } from '@/modules/auth/store/login.store';
import { userModule } from '@/modules/user/store/user.store';
import i18n from '@/plugins/vue-i18n';
import router from '@/plugins/vue-router';
import { ElNotification } from 'element-plus';
import { PageName } from './constants';
import localStorageTokenService from './tokenService';
export function translateYupError(
    yupError:
        | {
              i18nKey: string;
              params?: Record<string, string>;
          }
        | string,
): string {
    if (typeof yupError === 'string') {
        return i18n.global.t(yupError);
    }
    if (!yupError?.i18nKey) return '';
    return i18n.global.t(yupError?.i18nKey, { ...yupError?.params });
}

type ElNotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export function showSuccessNotificationFunction(
    message: string,
    title?: string,
    position?: ElNotificationPosition,
): void {
    ElNotification({
        type: 'success',
        title: title || (i18n.global.t('common.notification') as string),
        message,
        position: position || 'top-right',
    });
}

export function showErrorNotificationFunction(message?: string, title?: string): void {
    ElNotification({
        type: 'error',
        title: title || (i18n.global.t('common.notification') as string),
        message,
    });
}

export const setLoginUser = (data: ILoginData) => {
    localStorageTokenService.setAccessToken(data.accessToken);
    localStorageTokenService.setLoginUser(data.user);
    userModule.setUserData(data.user);
    loginModule.setAccessToken(data.accessToken);
    loginModule.setLoginState(true);
    router.push({
        name: PageName.LANDING_PAGE,
    });
};
