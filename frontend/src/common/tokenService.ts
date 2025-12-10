import { DEFAULT_LANGUAGE, SupportLanguage } from '@/common/constants';
import { IUserData } from './interfaces';
import { storage } from './localStorage';

export interface IUser {
    id?: number;
    firstName?: string;
    lastName?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
}

export const enum AUTH_SERVICE_KEY {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
    ACCESS_TOKEN_EXPIRED_AT = 'ACCESS_TOKEN_EXPIRED_AT',
    REFRESH_TOKEN_EXPIRED_AT = 'REFRESH_TOKEN_EXPIRED_AT',
    LOGIN_USER = 'LOGIN_USER',
    LANGUAGE = 'LANGUAGE',
}

const BUFFER_TIME = 60 * 1000; // 60s

class LocalStorageTokenService {
    // ACCESS_TOKEN
    setAccessToken(token: string): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, token);
    }
    getAccessToken(): string {
        return storage.getLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN);
    }
    resetAccessToken(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, '');
    }
    // ACCESS_TOKEN_EXPIRED_AT
    getAccessTokenExpiredAt(): number {
        return +storage.getLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN_EXPIRED_AT);
    }
    setAccessTokenExpiredAt(expiredIn: number): void {
        const expiredAt = new Date().getTime() + expiredIn * 1000 - BUFFER_TIME;
        storage.setLocalStorage(
            AUTH_SERVICE_KEY.ACCESS_TOKEN_EXPIRED_AT,
            String(expiredAt),
        );
    }
    resetAccessTokenExpiredAt(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN_EXPIRED_AT, '');
    }
    // REFRESH_TOKEN
    setRefreshToken(token: string): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN, token);
    }
    getRefreshToken(): string {
        return storage.getLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN);
    }
    resetRefreshToken(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN, '');
    }
    // REFRESH_TOKEN_EXPIRED_AT
    setRefreshTokenExpiredAt(expiredIn: number): void {
        const expiredAt = new Date().getTime() + expiredIn * 1000 - BUFFER_TIME;
        storage.setLocalStorage(
            AUTH_SERVICE_KEY.REFRESH_TOKEN_EXPIRED_AT,
            String(expiredAt),
        );
    }
    getRefreshTokenExpiredAt(): number {
        return +storage.getLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN_EXPIRED_AT);
    }
    resetRefreshTokenExpiredAt(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN_EXPIRED_AT, '');
    }

    // LOGIN USER
    setLoginUser(user: IUserData): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LOGIN_USER, JSON.stringify(user || ''));
    }
    getLoginUser(): IUserData | null {
        return storage.getLocalStorage(AUTH_SERVICE_KEY.LOGIN_USER)
            ? JSON.parse(storage.getLocalStorage(AUTH_SERVICE_KEY.LOGIN_USER))
            : null;
    }
    resetLoginUser(): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LOGIN_USER, '');
    }

    // LANGUAGE
    setLanguage(value: SupportLanguage): void {
        storage.setLocalStorage(AUTH_SERVICE_KEY.LANGUAGE, value);
    }
    getLanguage(): SupportLanguage {
        return (storage.getLocalStorage(AUTH_SERVICE_KEY.LANGUAGE) ||
            DEFAULT_LANGUAGE) as SupportLanguage;
    }

    resetAll(): void {
        this.resetAccessToken();
        this.resetRefreshToken();
        this.resetAccessToken();
        this.resetRefreshTokenExpiredAt();
        this.resetLoginUser();
    }
}

const localStorageTokenService = new LocalStorageTokenService();
export default localStorageTokenService;
