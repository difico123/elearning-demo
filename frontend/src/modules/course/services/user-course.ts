import {
    IAxiosDefaultResponse,
    IAxiosListDefaultResponse,
    IGetListDefaultParams,
} from '@/common/interfaces';
import localStorageTokenService from '@/common/tokenService';
import { loginModule } from '@/modules/auth/store/login.store';
import axios from 'axios';
import {
    IToggleCourseFavoriteResponse,
    ICourseCheckoutResponse,
    IUserCourseData,
    ICourseListParams,
    IStudentCourseData,
    IStudentCourseShortData,
    IOutsideStudentCourseData,
    ICourseData,
} from '../constants/course.interfaces';

const FE_URL = process.env.VUE_APP_FE_BASE_URL;
const BE_URL = process.env.VUE_APP_API_URL;

export interface IGetCourseStudentListResponse {
    items?: Array<IStudentCourseShortData>;
    page?: number;
    pageSize?: number;
    total_pages: number;
    totalItems?: number;
}

export interface IStudentCourseItems {
    items: Array<IStudentCourseData>;
}

export async function getUserCourseData(
    courseId: number,
): Promise<IAxiosDefaultResponse<IUserCourseData>> {
    return axios
        .get(`${BE_URL}/user-course/check/${courseId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function toggleCourseFavorite(
    courseId: number,
): Promise<IAxiosDefaultResponse<IToggleCourseFavoriteResponse>> {
    return axios
        .post(
            `${BE_URL}/favorite/${courseId}`,
            {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
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

export async function courseCheckout(
    courseId: number,
): Promise<IAxiosDefaultResponse<ICourseCheckoutResponse>> {
    return axios
        .post(
            `${BE_URL}/user-course/create-course-checkout/${courseId}`,
            {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
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

export async function courseCheckoutVerify(
    courseId: string,
    code: string,
): Promise<IAxiosDefaultResponse<Record<string, never>>> {
    return axios
        .post(
            `${BE_URL}/user-course/join-course/${courseId}/${code}`,
            {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
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

export async function getStudentCourseList(
    params: ICourseListParams,
): Promise<IAxiosListDefaultResponse<IStudentCourseData>> {
    return axios
        .get(`${BE_URL}/user-course`, {
            params: { ...params },
            headers: {
                Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function getInstructorCourseList(
    params: ICourseListParams,
): Promise<IAxiosListDefaultResponse<ICourseData>> {
    return axios
        .get(`${BE_URL}/course/instructor`, {
            params: { ...params },
            headers: {
                Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function getCourseStudentList(
    params: IGetListDefaultParams,
    courseId: string,
): Promise<IAxiosListDefaultResponse<IStudentCourseShortData>> {
    return axios
        .get(`${BE_URL}/user-course/student-list/${courseId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
            },
            params: { ...params },
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}

export async function getOutsideCourseStudentList(
    params: IGetListDefaultParams,
    courseId: string,
): Promise<IAxiosListDefaultResponse<IOutsideStudentCourseData>> {
    return axios
        .get(`${BE_URL}/user-course/outside-course-students/${courseId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorageTokenService.getAccessToken(),
            },
            params: { ...params },
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
}
