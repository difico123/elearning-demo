import { IAxiosDefaultResponse, IUserData } from '@/common/interfaces';
import axios from 'axios';

const FE_URL = process.env.VUE_APP_FE_BASE_URL;
const BE_URL = process.env.VUE_APP_API_URL;

export async function register(email: string): Promise<IAxiosDefaultResponse<string>> {
    return axios
        .post(`${BE_URL}/auth/signup`, {
            url: `${FE_URL}/auth/create-password/`,
            email: email,
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function verifyToken(
    token: string,
): Promise<IAxiosDefaultResponse<IUserData>> {
    return axios
        .get(`${BE_URL}/auth/verify-email/${token}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function setPassword(
    password: string,
    token: string,
): Promise<IAxiosDefaultResponse<Record<string, unknown>>> {
    return axios
        .post(
            `${BE_URL}/auth/change-password`,
            {
                password: password,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + token,
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

export async function selectRole(
    role: string,
    token: string,
): Promise<IAxiosDefaultResponse<Record<string, unknown>>> {
    return axios
        .put(
            `${BE_URL}/auth/select-role`,
            {
                role: role,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + token,
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
