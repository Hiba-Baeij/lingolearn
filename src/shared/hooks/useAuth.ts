
import { DecodedJWT, LoginResponseDto } from '@/api/auth/dto'
import { jwtDecode } from 'jwt-decode'
import { axiosIns } from '@/config/libs/axios';
import { AxiosError } from 'axios';

const AUTH_ENDPOINTS_REFRECH_TOKEN = "Authentication/RefreshToken"

export const Initialize = (loginDto: LoginResponseDto) => {
    SetAccessToken(loginDto?.accessToken);
    SetRefreshToken(loginDto?.refreshToken);
    SetResponseData(loginDto);
};

export const SetAccessToken = (tk: string) => {
    localStorage.setItem('access_token_lingolearn', tk);
}
export const SetRefreshToken = (ref_tk: string) => {
    localStorage.setItem('refresh_token_lingolearn', ref_tk);

}
export const SetResponseData = (data: LoginResponseDto) => {
    localStorage.setItem('response_data_lingolearn', JSON.stringify(data));

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
    const refreshToken = localStorage.getItem('refresh_token_lingolearn')
    if (refreshToken)
        return refreshToken
    else null
}

export const GetAccessToken = () => {
    const accessToken = localStorage.getItem('access_token_lingolearn')
    if (accessToken)
        return accessToken
    else return null
}
export const GetDataLingoLearn = () => {
    const data = localStorage.getItem('response_data_lingolearn')
    if (data)
        return JSON.parse(data) as LoginResponseDto
    else return null
}

export const IsLoggedIn = () => {
    return !!GetAccessToken()
}
export const LogOut = () => {
    localStorage.removeItem('access_token_lingolearn')
    localStorage.removeItem('refresh_token_lingolearn')

}

export const GetDecodedJwt = () => {
    const token = localStorage.getItem('access_token_lingolearn')
    if (token)
        return jwtDecode(token) as DecodedJWT
    else return null
};


