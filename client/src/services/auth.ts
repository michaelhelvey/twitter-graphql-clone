import * as Storage from '../utils/storage'
import { post } from '../utils/http'

export interface ILoginRequestResponse {
  token?: string
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

export const store = async (token: string, refreshToken: string) => {
  Storage.setItem(Storage.AUTH_TOKEN_KEY, token)
  Storage.setItem(Storage.REFRESH_TOKEN_KEY, refreshToken)
  return [token, refreshToken]
}
