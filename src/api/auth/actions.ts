import { useApi } from "@/shared/hooks/useApi";
import { LoginDto, LoginResponseDto, Response } from "./dto";

const AUTH_ENDPOINTS_LOGIN = "Dashboard/Admin/LogIn"

export class AuthActions {

    static async Login(dto: LoginDto) {
        console.log(dto);
        try {

            const res = await useApi<Response<LoginResponseDto>>('POST', AUTH_ENDPOINTS_LOGIN, {
                successMessage: 'تم تسجيل الدخول بنجاح', errorMessage: true
            }, {}, {
                params: { ...dto }
            });

            if (res?.status == 200) {
                console.log(res.data);
                return res.data.response
            }
        }

        catch (er) {
            console.log(er)
            throw (er)
        }
    }
}