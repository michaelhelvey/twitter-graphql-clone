const API_BASE = 'http://localhost:5000'

export const get = async (path: string, auth: string | null = null) => {
  return fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: auth
      ? {
          Authorization: `${auth}`,
        }
      : {},
  })
}

export const post = async (
  path: string,
  body: any,
  auth: string | null = null
) => {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: auth
      ? {
          Authorization: `${auth}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        },
  })
}
