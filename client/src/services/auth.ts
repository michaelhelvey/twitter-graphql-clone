import * as Storage from '../utils/storage'
import { post } from '../utils/http'

export interface ITokenRequestResponse {
  token?: string
}

export interface ILoginRequestResponse extends ITokenRequestResponse {
  refreshToken?: string
  auth: boolean
  message?: string
}

export const login = async (
  username: string,
  password: string
): Promise<ILoginRequestResponse> => {
  const response = await post('/auth/login', {
    username,
    password,
  })
  const json = await response.json()
  return json
}

export const refreshToken = async (
  refreshToken: string
): Promise<ITokenRequestResponse> => {
  const response = await post('/auth/refresh', {
    refresh_token: refreshToken,
  })
  const json = await response.json()
  return json
}

export const store = async (token: string, refreshToken?: string) => {
  Storage.setItem(Storage.AUTH_TOKEN_KEY, token)
  if (refreshToken) {
    Storage.setItem(Storage.REFRESH_TOKEN_KEY, refreshToken)
  }
  return [token, refreshToken]
}

export const isLoggedIn = () => {
  const hasToken = !!Storage.getItem(Storage.AUTH_TOKEN_KEY)
  const hasRefreshToken = !!Storage.getItem(Storage.REFRESH_TOKEN_KEY)

  return hasToken && hasRefreshToken
}

export const logout = () => {
  Storage.removeItem(Storage.AUTH_TOKEN_KEY)
  Storage.removeItem(Storage.REFRESH_TOKEN_KEY)
}
