import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '@/api/app.config'
import { GetAccessToken } from '@/shared/hooks/useAuth';


const errorHandler = async (error: AxiosError) => {
    // const config: AxiosRequestConfig | undefined = error?.config

    if (error.response?.status === 401) {
        location.href = '/login'

        // const res = await RefreshToken();
        // if (config) {
        //     config.headers = {
        //         ...config.headers,
        //         Authorization: `Bearer ${GetAccessToken()}`

        //     }
        // }
        // console.log(res);

        // return axios(config as AxiosRequestConfig)

    }

    return Promise.reject(error)
}


const requestHandler = (request: AxiosRequestConfig) => {
    // if (request.headers) {
    //     request.headers['Authorization'] = `Bearer ${GetAccessToken()}`;
    // }
    return request;
};

const responseHandler = (response: AxiosResponse) => {
    return response;
};

const axiosIns = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${GetAccessToken()}`
    },

});

axiosIns.interceptors.request.use(requestHandler as any)
axiosIns.interceptors.response.use(responseHandler, errorHandler)

export { axiosIns }