import { IAxiosDefaultResponse } from '@/common/interfaces';
import axios from 'axios';
import { ICategoryData } from '../constants/landing.interfaces';

const FE_URL = process.env.VUE_APP_FE_BASE_URL;
const BE_URL = process.env.VUE_APP_API_URL;

export interface ICategoryItemList {
    items: Array<ICategoryData>;
}

export async function getCategoryList(): Promise<
    IAxiosDefaultResponse<ICategoryItemList>
> {
    return axios
        .get(`${BE_URL}/category`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}
