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
  jti: string,
  ut: string,
  uid: number,
  uname: string,
  scopes: string[],
  nbf: number,
  exp: number,
  iss: string,
  aud: string
}

export interface Response<T> {
  isSuccess: boolean
  message: string
  response: Array<T> | T
}