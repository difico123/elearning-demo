import { PageName } from '@/common/constants';
import { IAxiosDefaultResponse, IUserData } from '@/common/interfaces';
import localStorageTokenService from '@/common/tokenService';
import router from '@/plugins/vue-router';
import axios from 'axios';
import { userModule } from '../store/user.store';

const FE_URL = process.env.VUE_APP_FE_BASE_URL;
const BE_URL = process.env.VUE_APP_API_URL;

export async function getUserData(): Promise<IAxiosDefaultResponse<IUserData>> {
    return axios
        .get(`${BE_URL}/user/profile`, {
            headers: {
                Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
            },
        })
        .then((res) => {
            userModule.setUserData(res.data?.data || {});
            localStorageTokenService.setAccessToken(res.data?.data?.accessToken);
            return res.data;
        })
        .catch((error) => {
            router.push({ name: PageName.LOGIN_PAGE });
            localStorageTokenService.resetAccessToken();
            localStorageTokenService.resetLoginUser();
            userModule.setUserData({});
            return error.response.data;
        });
}

export async function updateUserData(
    params: FormData,
): Promise<IAxiosDefaultResponse<Record<string, unknown>>> {
    return axios
        .put(
            `${BE_URL}/user/profile`,

            params,

            {
                headers: {
                    Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
                    'Content-Type': 'multipart/form-data',
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
