import { useApi } from "@/shared/hooks/useApi";
import { NotificationDto, Notifications } from "./dto";
import { serialize } from "object-to-formdata";
import { Dto } from "../languages/dto";
import { Response } from "../auth/dto";

export const NOTIFICATIONS_ENDPOINT = "Dashboard/Notification/GetAll";
export const ADD_NOTIFICATION_ENDPOINT = "Dashboard/Notification/Add";
export const MODIFY_NOTIFICATION_ENDPOINT = "Dashboard/Notification/Modify";
export const GET_ID_NOTIFICATION_ENDPOINT = "Dashboard/Notification/GetById";
export const GET_NAMES_NOTIFICATION_ENDPOINT = "Dashboard/Notification/GetNames";
export const DELETE_NOTIFICATION_ENDPOINT = "Dashboard/Notification/Delete";


export class NotificationsActions {
    static async GetNotifications() {
        try {
            const res = await useApi<Response<Notifications[]>>('GET', NOTIFICATIONS_ENDPOINT)
            return res?.data.response as Notifications[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdNotification(id: string) {
        try {
            const res = await useApi<Response<NotificationDto>>('GET', GET_ID_NOTIFICATION_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as NotificationDto
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetNameNotification() {
        try {
            const res = await useApi<Response<Dto[]>>('GET', GET_NAMES_NOTIFICATION_ENDPOINT)
            return res?.data.response as Dto[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async AddNotification(payload: NotificationDto) {
        try {
            const res = await useApi('POST', ADD_NOTIFICATION_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyNotification(payload: NotificationDto) {
        try {
            const res = await useApi('POST', MODIFY_NOTIFICATION_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteNotifications(ids: string[]) {
        await useApi('DELETE', DELETE_NOTIFICATION_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }



}