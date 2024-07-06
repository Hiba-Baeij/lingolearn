import { useApi } from "@/shared/hooks/useApi";
import { StudentDto, Students } from "./dto";
import { serialize } from "object-to-formdata";
import { Response } from "../auth/dto";

export const STUDENTS_ENDPOINT = "Dashboard/Student/GetAll";
export const ADD_STUDENT_ENDPOINT = "Dashboard/Student/Add";
export const MODIFY_STUDENT_ENDPOINT = "Dashboard/Student/Modify";
export const GET_ID_STUDENT_ENDPOINT = "Dashboard/Student/GetById";
export const GET_NAMES_STUDENT_ENDPOINT = "Dashboard/Student/GetNames";
export const DELETE_STUDENT_ENDPOINT = "Dashboard/Student/Delete";
export const BLOCK_STUDENT_ENDPOINT = "Dashboard/Student/Block";

export class StudentsActions {
    static async GetStudents() {
        try {
            const res = await useApi<Response<Students[]>>('GET', STUDENTS_ENDPOINT)
            return res?.data.response as Students[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdStudent(id: string) {
        try {
            const res = await useApi<Response<StudentDto>>('GET', GET_ID_STUDENT_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as StudentDto
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetNameStudent(name: string) {
        try {
            const res = await useApi<StudentDto>('GET', GET_NAMES_STUDENT_ENDPOINT, {}, {}, {
                params: {
                    id: name
                }
            })
            return res?.data
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async AddStudent(payload: StudentDto) {
        try {
            const res = await useApi('POST', ADD_STUDENT_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyStudent(payload: StudentDto) {
        try {
            const res = await useApi('POST', MODIFY_STUDENT_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async BlockStudent(payload: { id: string, block: boolean }) {
        try {
            const res = await useApi('POST', BLOCK_STUDENT_ENDPOINT, { successMessage: payload.block ? "تم الحظر بنجاح" : "تم رفع الحظر بنجاح", errorMessage: true }, {}, {
                params: {
                    id: payload.id
                }
            })
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteStudents(ids: string[]) {
        await useApi('DELETE', DELETE_STUDENT_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }



}