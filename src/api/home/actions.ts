import { useApi } from "@/shared/hooks/useApi";
import { HomeDto } from "./dto";
import { Response } from "../auth/dto";

export const HOME_ENDPOINT = "Dashboard/Home/Get";

export class HomeActions {
    static async GetHome(year: number) {
        try {
            const res = await useApi<Response<HomeDto>>('GET', HOME_ENDPOINT, {}, {}, {
                params: {
                    year: year
                }
            })
            return res?.data.response as HomeDto
        }
        catch (er) {
            console.log('No Record Found')
            throw (er)
        }
    }


}