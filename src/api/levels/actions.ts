import { useApi } from "@/shared/hooks/useApi";
import { LevelDetails, LevelDto, Levels } from "./dto";
import { serialize } from "object-to-formdata";
import { Dto } from "../languages/dto";
import { Response } from "../auth/dto";

export const LEVELS_ENDPOINT = "Dashboard/Level/GetAll";
export const ADD_LEVEL_ENDPOINT = "Dashboard/Level/Add";
export const MODIFY_LEVEL_ENDPOINT = "Dashboard/Level/Modify";
export const GET_ID_LEVEL_ENDPOINT = "Dashboard/Level/GetById";
export const GET_NAMES_LEVEL_ENDPOINT = "Dashboard/Level/GetNames";
export const DELETE_LEVEL_ENDPOINT = "Dashboard/Level/Delete";


export class LevelsActions {
    static async GetLevels() {
        try {
            const res = await useApi<Response<Levels[]>>('GET', LEVELS_ENDPOINT)
            return res?.data.response as Levels[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdLevel(id: string) {
        try {
            const res = await useApi<Response<LevelDetails>>('GET', GET_ID_LEVEL_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as LevelDetails
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetNameLevel() {
        try {
            const res = await useApi<Response<Dto[]>>('GET', GET_NAMES_LEVEL_ENDPOINT)
            return res?.data.response as Dto[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async AddLevel(payload: LevelDto) {
        try {
            const res = await useApi('POST', ADD_LEVEL_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyLevel(payload: LevelDto) {
        try {
            const res = await useApi('POST', MODIFY_LEVEL_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteLevels(ids: string[]) {
        await useApi('DELETE', DELETE_LEVEL_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }



}