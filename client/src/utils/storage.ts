export const AUTH_TOKEN_KEY = 'AUTH_TOKEN'
export const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN'

export const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const getItem = (key: string) => localStorage.getItem(key)
