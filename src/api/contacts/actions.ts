import { useApi } from "@/shared/hooks/useApi";
import { Contacts } from "./dto";
import { serialize } from "object-to-formdata";
import { Dto } from "../languages/dto";
import { Response } from "../auth/dto";

export const CONTACTS_ENDPOINT = "Dashboard/ContactUs/GetAll";
export const DELETE_CONTACT_ENDPOINT = "Dashboard/Contact/Delete";
// export const ADD_CONTACT_ENDPOINT = "Dashboard/ContactUs/Add";
// export const MODIFY_CONTACT_ENDPOINT = "Dashboard/ContactUs/Modify";
// export const GET_ID_CONTACT_ENDPOINT = "Dashboard/Contact/GetById";
// export const GET_NAMES_CONTACT_ENDPOINT = "Dashboard/Contact/GetNames";


export class ContactsActions {
    static async GetContacts() {
        try {
            const res = await useApi<Response<Contacts[]>>('GET', CONTACTS_ENDPOINT)
            return res?.data.response as Contacts[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteContacts(ids: string[]) {
        await useApi('DELETE', DELETE_CONTACT_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }

    // static async GetByIdContact(id: string) {
    //     try {
    //         const res = await useApi<Response<ContactDto>>('GET', GET_ID_CONTACT_ENDPOINT, {}, {}, {
    //             params: {
    //                 id: id
    //             }
    //         })
    //         return res?.data.response as ContactDto
    //     }
    //     catch (er) {
    //         console.log('No Record Found')
    //         throw (er)
    //     }
    // }
    // static async GetNameContact() {
    //     try {
    //         const res = await useApi<Response<Dto[]>>('GET', GET_NAMES_CONTACT_ENDPOINT)
    //         return res?.data.response as Dto[]
    //     }
    //     catch (er) {
    //         console.log('No Record Found')
    //         throw (er)
    //     }
    // }
    // static async AddContact(payload: ContactDto) {
    //     try {
    //         const res = await useApi('POST', ADD_CONTACT_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, serialize(payload))
    //         return res

    //     }
    //     catch (er) {
    //         console.log('No Record Found')
    //         throw (er)
    //     }
    // }
    // static async ModifyContact(payload: ContactDto) {
    //     try {
    //         const res = await useApi('POST', MODIFY_CONTACT_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, serialize(payload))
    //         return res

    //     }
    //     catch (er) {
    //         console.log('No Record Found')
    //         throw (er)
    //     }
    // }



}