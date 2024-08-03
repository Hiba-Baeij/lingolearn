import { useApi } from "@/shared/hooks/useApi";
import { LessonDto, Lessons } from "./dto";
import { serialize } from "object-to-formdata";
import { Dto } from "../languages/dto";
import { Response } from "../auth/dto";

export const LESSONS_ENDPOINT = "Dashboard/Lesson/GetAll";
export const ADD_LESSON_ENDPOINT = "Dashboard/Lesson/Add";
export const MODIFY_LESSON_ENDPOINT = "Dashboard/Lesson/Modify";
export const GET_ID_LESSON_ENDPOINT = "Dashboard/Lesson/GetById";
export const GET_NAMES_LESSON_ENDPOINT = "Dashboard/Lesson/GetNames";
export const DELETE_LESSON_ENDPOINT = "Dashboard/Lesson/Delete";

export class LessonsActions {
    static async GetLessons() {
        try {
            const res = await useApi<Response<Lessons[]>>('GET', LESSONS_ENDPOINT)
            return res?.data.response as Lessons[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdLesson(id: string) {
        try {
            const res = await useApi<Response<LessonDto & {
                coverImageUrl: File | null;
                fileUrl: File | null
            }>>('GET', GET_ID_LESSON_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as LessonDto & {
                coverImageUrl: File | null;
                fileUrl: File | null
            }
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetNameLesson() {
        try {
            const res = await useApi<Response<Dto[]>>('GET', GET_NAMES_LESSON_ENDPOINT)
            return res?.data.response as Dto[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async AddLesson(payload: LessonDto & {
        coverImageUrl: File | null;
        fileUrl: File | null
    }) {
        try {
            const res = await useApi('POST', ADD_LESSON_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyLesson(payload: LessonDto & {
        coverImageUrl: File | null;
        fileUrl: File | null
    }) {
        try {
            const res = await useApi('POST', MODIFY_LESSON_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteLessons(ids: string[]) {
        await useApi('DELETE', DELETE_LESSON_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }



}