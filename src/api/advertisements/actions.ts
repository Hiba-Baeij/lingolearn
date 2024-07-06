import { useApi } from "@/shared/hooks/useApi";
import { AdvertisementDto, Advertisements } from "./dto";
import { serialize } from "object-to-formdata";
import { Dto } from "../languages/dto";
import { Response } from "../auth/dto";

export const ADVERTISEMENTS_ENDPOINT = "Dashboard/Advertisement/GetAll";
export const ADD_ADVERTISEMENT_ENDPOINT = "Dashboard/Advertisement/Add";
export const MODIFY_ADVERTISEMENT_ENDPOINT = "Dashboard/Advertisement/Modify";
export const GET_ID_ADVERTISEMENT_ENDPOINT = "Dashboard/Advertisement/GetById";
export const GET_NAMES_ADVERTISEMENT_ENDPOINT = "Dashboard/Advertisement/GetNames";
export const DELETE_ADVERTISEMENT_ENDPOINT = "Dashboard/Advertisement/Delete";


export class AdvertisementsActions {
    static async GetAdvertisements() {
        try {
            const res = await useApi<Response<Advertisements[]>>('GET', ADVERTISEMENTS_ENDPOINT)
            return res?.data.response as Advertisements[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdAdvertisement(id: string) {
        try {
            const res = await useApi<Response<AdvertisementDto>>('GET', GET_ID_ADVERTISEMENT_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as AdvertisementDto
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetNameAdvertisement() {
        try {
            const res = await useApi<Response<Dto[]>>('GET', GET_NAMES_ADVERTISEMENT_ENDPOINT)
            return res?.data.response as Dto[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async AddAdvertisement(payload: AdvertisementDto) {
        try {
            const res = await useApi('POST', ADD_ADVERTISEMENT_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyAdvertisement(payload: AdvertisementDto) {
        try {
            const res = await useApi('POST', MODIFY_ADVERTISEMENT_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteAdvertisements(ids: string[]) {
        await useApi('DELETE', DELETE_ADVERTISEMENT_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }



}