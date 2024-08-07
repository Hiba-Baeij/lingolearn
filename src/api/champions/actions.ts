import { useApi } from "@/shared/hooks/useApi";
import { Challenge, Questions } from "./dto";
import { serialize } from "object-to-formdata";
import { Response } from "../auth/dto";

export const CHALLENGES_ENDPOINT = "Dashboard/Challenge/GetAll";
export const ADD_CHALLENGE_ENDPOINT = "Dashboard/Challenge/Add";
export const MODIFY_CHALLENGE_ENDPOINT = "Dashboard/Challenge/Modify";
export const GET_ID_CHALLENGE_ENDPOINT = "Dashboard/Challenge/GetById";
export const DELETE_CHALLENGE_ENDPOINT = "Dashboard/Challenge/Delete";

export const CHALLENGEQUESTIONS_ENDPOINT = "Dashboard/ChallengeQuestions/GetAll";
export const ADD_CHALLENGEQUESTIONS_ENDPOINT = "Dashboard/ChallengeQuestions/Add";
export const MODIFY_CHALLENGEQUESTIONS_ENDPOINT = "Dashboard/ChallengeQuestions/Modify";
export const GET_ID_CHALLENGEQUESTIONS_ENDPOINT = "Dashboard/ChallengeQuestions/GetById";
export const DELETE_CHALLENGEQUESTIONS_ENDPOINT = "Dashboard/ChallengeQuestions/Delete";


export class ChallengesActions {
    static async GetChallenges() {
        try {
            const res = await useApi<Response<Challenge[]>>('GET', CHALLENGES_ENDPOINT)
            return res?.data.response as Challenge[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdChallenge(id: string) {
        try {
            const res = await useApi<Response<Challenge>>('GET', GET_ID_CHALLENGE_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as Challenge
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async AddChallenge(payload: Challenge) {
        try {
            const res = await useApi('POST', ADD_CHALLENGE_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyChallenge(payload: Challenge) {
        try {
            const res = await useApi('POST', MODIFY_CHALLENGE_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, serialize(payload))
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteChallenges(ids: string[]) {
        await useApi('DELETE', DELETE_CHALLENGE_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }

    //CHALLENGEQUESTIONS

    static async GetChallengesQuestions(challengeId: string) {
        try {
            const res = await useApi<Response<Questions[]>>('GET', CHALLENGEQUESTIONS_ENDPOINT, {}, {}, {
                params: {
                    ChallengeId: challengeId
                }
            })
            return res?.data.response as Questions[]
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async GetByIdChallengesQuestion(id: string) {
        try {
            const res = await useApi<Response<Questions>>('GET', GET_ID_CHALLENGEQUESTIONS_ENDPOINT, {}, {}, {
                params: {
                    id: id
                }
            })
            return res?.data.response as Questions
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async AddChallengesQuestion(payload: Questions) {
        try {
            const res = await useApi('POST', ADD_CHALLENGEQUESTIONS_ENDPOINT, { successMessage: "تمت الإضافة بنجاح", errorMessage: true }, payload)
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }
    static async ModifyChallengesQuestions(payload: Questions) {
        try {
            const res = await useApi('POST', MODIFY_CHALLENGEQUESTIONS_ENDPOINT, { successMessage: "تم التعديل بنجاح", errorMessage: true }, payload)
            return res

        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }

    static async DeleteChallengesQuestions(ids: string[]) {
        await useApi('DELETE', DELETE_CHALLENGEQUESTIONS_ENDPOINT, { confirm: { title: "هل انت متأكد من حذف هذا العنصر", text: "سيتم حذف هذا العنصر ولم تستطيع استرداده" }, successMessage: "تم الحذف بنجاح" }, {}, {
            data: ids
        })
    }



}