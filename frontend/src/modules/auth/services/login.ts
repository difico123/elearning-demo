import { IAxiosDefaultResponse, IUserData } from '@/common/interfaces';
import localStorageTokenService from '@/common/tokenService';
import axios from 'axios';
import { IGoogleLoginParams } from '../constants/auth.interfaces';

const FE_URL = process.env.VUE_APP_FE_BASE_URL;
const BE_URL = process.env.VUE_APP_API_URL;

export interface ILoginData {
    accessToken: string;
    user: IUserData;
}

export async function login(
    params: IGoogleLoginParams,
): Promise<IAxiosDefaultResponse<ILoginData>> {
    return axios
        .post(`${BE_URL}/auth/login`, params)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function selectRole(
    role: string,
    token: string,
): Promise<IAxiosDefaultResponse<Record<string, never>>> {
    const realRole = role === 'instructor' ? 'pending' : role;
    return axios
        .put(
            `${BE_URL}/auth/select-role`,
            {
                role: realRole,
            },
            {
                headers: {
                    Authorization:
                        'Bearer ' + token || localStorageTokenService.getAccessToken(),
                },
            },
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function forgotPassword(
    email: string,
): Promise<IAxiosDefaultResponse<string>> {
    return axios
        .post(`${BE_URL}/auth/forgot-password`, {
            email: email,
            url: `${FE_URL}/reset-password`,
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function verifyCode(
    email: string,
    code: number,
): Promise<IAxiosDefaultResponse<{ accessToken: string }>> {
    return axios
        .post(
            `${BE_URL}/auth/verify-code`,
            {},
            {
                params: {
                    email: email,
                    code: code,
                },
            },
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}
