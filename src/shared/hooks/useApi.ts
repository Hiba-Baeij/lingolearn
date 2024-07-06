import { axiosIns } from "@/config/libs/axios";
import { AxiosError, type AxiosRequestConfig, type AxiosResponse, type Method } from "axios";
import type { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface UseApiFeedback {
    successMessage?: string | boolean,
    errorMessage?: string | boolean,
    confirm?: SweetAlertOptions | null
}

const defaultFeedBack: UseApiFeedback = {
    confirm: null,
    errorMessage: true,
    successMessage: false,
}

export const useApi = async <RST, RQT = any>(type: Method, url: string, feedback: UseApiFeedback = defaultFeedBack, payload?: RQT, axiosConfig?: AxiosRequestConfig): Promise<AxiosResponse<RST> | undefined> => {

    feedback = {
        ...defaultFeedBack,
        ...feedback,
    }
    // const toast = useToast()
    let response: AxiosResponse<RST>;

    let result: Partial<SweetAlertResult<boolean>> = {
        isConfirmed: true,
    };

    if (feedback.confirm) {
        result = await Swal.fire({
            icon: 'warning',
            confirmButtonText: "نعم",
            confirmButtonColor: "red",
            cancelButtonText: "لا",
            showCancelButton: true,
            ...feedback.confirm
        })
    }

    try {
        if (result.isConfirmed) {
            switch (type) {
                case "GET" || "get":
                    response = await axiosIns.get<RST>(url, axiosConfig)
                    break;
                case "DELETE" || "delete":
                    response = await axiosIns.delete(url, axiosConfig)
                    break
                case "POST" || "post":
                    response = await axiosIns.post<RST>(url, payload, axiosConfig)
                    break
                case "PUT" || "put":
                    response = await axiosIns.put(url, payload, axiosConfig)
                    break
                case "PATCH" || "patch":
                    response = await axiosIns.patch(url, payload, axiosConfig)
                    break
                default:
                    response = await axiosIns.get<RST>(url, axiosConfig)
            }

            if (feedback.successMessage) {
                if (typeof feedback.successMessage == 'boolean') {
                    toast.success(defaultFeedBack.successMessage as string)
                }
                else if (typeof feedback.successMessage == 'string') {
                    toast.success(feedback.successMessage as string)
                }
            }

            return response;

        }
    }
    catch (er) {
        console.log(er);
        console.log(feedback);

        if (feedback.errorMessage) {

            if (typeof feedback.errorMessage === 'string') {

                toast.error(feedback.errorMessage)
            }

            else if (typeof feedback.errorMessage === 'boolean') {
                if (er instanceof AxiosError) {
                    if (er.response?.data && er.response.data.message) {
                        toast.error(`${er.response.data.message ?? JSON.stringify(er.response?.data)}`)
                    }
                    if (er.response?.data && er.response.data.name) {
                        toast.error(`${er.response.data.name ?? JSON.stringify(er.response?.data)}`)
                    }
                    if (er.response?.data && er.response.data.errors) {
                        const errors = er.response.data.errors;
                        if (Array.isArray(errors)) {
                            toast.error(`${errors[0]} \n`)
                        }
                        if (typeof errors === 'object') {
                            //@ts-ignores
                            toast.error(Object.values(errors).reduce((pre, cur) => pre + `${cur[0]} \n`, '') as string)
                        }
                    }


                }

            }
            throw (er)
        }

        console.groupEnd()
        throw (er)
    }






}