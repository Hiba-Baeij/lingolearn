import { useApi } from "@/shared/hooks/useApi";
import { Exam } from "./dto";
import { serialize } from "object-to-formdata";
import { Response } from "../auth/dto";

export const EXAMS_ENDPOINT = "Dashboard/QuestionsBank/GetAll";
export const ADD_EXAM_ENDPOINT = "Dashboard/QuestionsBank/Add";
export const MODIFY_EXAM_ENDPOINT = "Dashboard/QuestionsBank/Modify";
export const GET_ID_EXAM_ENDPOINT = "Dashboard/QuestionsBank/GetById";
export const DELETE_EXAM_ENDPOINT = "Dashboard/QuestionsBank/Delete";


export class ExamsActions {
    static async GetExams(levelId: string) {
        try {
            const res = await useApi<Response<Exam[]>>('GET', EXAMS_ENDPOINT + `${levelId ? `?levelId=${levelId}` : ''}`)
            return res?.data.response as Exam[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdExam(id: string) {
        try {
            const res = await useApi<Response<Exam>>('GET', GET_ID_EXAM_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as Exam
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async AddExam(payload: Exam) {
        try {
            const res = await useApi('POST', ADD_EXAM_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, payload)
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyExam(payload: Exam) {
        try {
            const res = await useApi('POST', MODIFY_EXAM_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, payload)
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteExams(ids: string[]) {
        await useApi('DELETE', DELETE_EXAM_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }



}