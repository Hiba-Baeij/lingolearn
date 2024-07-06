export interface LoginDto {
  password: string;
  email: string;
}

export interface LoginResponseDto {
  accessToken: string,
  refreshToken: string,
  id: string,
  email: string,
  fullName: string
}

export interface DecodedJWT {
  Type: string,
  aud: string,
  exp: number,
  iss: string
}

export interface Response<T> {
  isSuccess: boolean
  message: string
  response: Array<T> | T
}