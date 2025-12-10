import { Role } from '@/modules/common/constants/common.interfaces';
import { SystemRole } from './constants';

export interface IErrorMessage {
    key?: string;
    errorCode?: number;
    message?: string;
}

export enum IHTTPResponse {
    'SUCCESS' = 200,
    '404_ERROR' = 404,
    'INTERNAL_ERROR' = 500,
}
export interface IAxiosDefaultResponse<T> {
    data?: T;
    code?: IHTTPResponse;
    message?: string;
    success?: boolean;
    errors?: Array<IErrorMessage>;
}

export interface IAxiosListDefaultResponse<T> {
    data?: {
        items?: Array<T>;
        page?: number;
        pageSize?: number;
        total_pages: number;
        totalItems?: number;
    };
    code?: IHTTPResponse;
    message?: string;
    success?: boolean;
    errors?: Array<IErrorMessage>;
}

export interface IUserData {
    id?: string;
    username?: string;
    email?: string;
    verified?: boolean;
    address?: string;
    phone?: string;
    avatar?: string;
    role?: SystemRole;
    provider?: string;
    created_at?: string;
    updated_at?: string;
    unreadNotification?: number;
    accessToken?: string
}

export interface IGetListDefaultParams {
    keyword?: string;
    page?: number;
    pageSize?: number;
}

export interface IUserOnlineList {
    id: string;
    userID: string;
    email: string;
    username: string;
    role: Role;
    count: 0;
}
