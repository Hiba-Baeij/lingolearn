
import { LoginResponseDto } from '@/api/auth/dto'
import { jwtDecode } from 'jwt-decode'
import { axiosIns } from '@/config/libs/axios';
import { AxiosError } from 'axios';

const AUTH_ENDPOINTS_REFRECH_TOKEN = "Authentication/RefreshToken"

export const Initialize = (access_token: string, refresh_token: string) => {
    SetAccessToken(access_token);
    SetRefreshToken(refresh_token);
};

export const SetAccessToken = (tk: string) => {
    console.log(tk);

    localStorage.setItem('access_token', tk);

}
export const SetRefreshToken = (ref_tk: string) => {
    localStorage.setItem('refresh_token', ref_tk);

}

// export const RefreshToken = async () => {
//     console.log("in refersh");
//     try {
//         const response = await axiosIns.post<LoginResponseDto>(AUTH_ENDPOINTS_REFRECH_TOKEN,
//             {
//                 token: GetAccessToken(),
//                 refreshToken: GetRefreshToken(),
//             })

//         const { token, refreshToken } = response.data

//         if (token && refreshToken) {
//             SetAccessToken(token)
//             SetRefreshToken(refreshToken)

//         }

//         return response
//     }
//     catch (error) {
//         console.log(error);
//         if (error instanceof AxiosError) {
//             if (error?.response?.status == 400) {
//                 LogOut()
//                 location.href = '/signin'
//             }
//         }
//     }
// }

export const GetRefreshToken = () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken)
        return refreshToken
    else null
}

export const GetAccessToken = () => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken)
        return accessToken
    else return null
}

export const IsLoggedIn = () => {
    return !!GetAccessToken()
}
export const LogOut = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
}

export const GetDecodedJwt = () => {
    const token = localStorage.getItem('access_token')
    if (token)
        return jwtDecode(token)
    else return null
};

