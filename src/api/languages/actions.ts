import { useApi } from "@/shared/hooks/useApi";
import { Dto, KeyDto, LanguageDetails, LanguageDto, Languages } from "./dto";
import { serialize } from "object-to-formdata";
import { Response } from "../auth/dto";

export const LANGUAGES_ENDPOINT = "Dashboard/Language/GetAll";
export const ADD_LANGUAGE_ENDPOINT = "Dashboard/Language/Add";
export const MODIFY_LANGUAGE_ENDPOINT = "Dashboard/Language/Modify";
export const GET_ID_LANGUAGE_ENDPOINT = "Dashboard/Language/GetById";
export const GET_NAMES_LANGUAGE_ENDPOINT = "Dashboard/Language/GetNames";
export const GET_AVAILABLE_LANGUAGE_ENDPOINT = "Dashboard/Language/GetAllAvailable";
export const DELETE_LANGUAGE_ENDPOINT = "Dashboard/Language/Delete";

export class LanguagesActions {
    static async GetLanguages() {
        try {
            const res = await useApi<Response<Languages[]>>('GET', LANGUAGES_ENDPOINT)
            return res?.data.response as Languages[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdLanguage(id: string) {
        try {
            const res = await useApi<Response<LanguageDetails>>('GET', GET_ID_LANGUAGE_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as LanguageDetails
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetAvailableLanguage() {
        try {
            const res = await useApi<Response<KeyDto[]>>('GET', GET_AVAILABLE_LANGUAGE_ENDPOINT)
            return res?.data.response as KeyDto[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetNameLanguage() {
        try {
            const res = await useApi<Response<Dto[]>>('GET', GET_NAMES_LANGUAGE_ENDPOINT)
            return res?.data.response as Dto[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async AddLanguage(payload: LanguageDto) {
        try {
            const res = await useApi('POST', ADD_LANGUAGE_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyLanguage(payload: LanguageDto) {
        try {
            const res = await useApi('POST', MODIFY_LANGUAGE_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteLanguages(ids: string[]) {
        await useApi('DELETE', DELETE_LANGUAGE_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }



}