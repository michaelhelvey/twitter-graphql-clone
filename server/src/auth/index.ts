import jwt from 'jsonwebtoken'
import config from './config'
import { User } from '../data/db'

export const getUserFromToken = async (token: string) => {
  try {
    const decoded: any = await jwt.verify(token, config.secret)
    // get user from db
    const user = await User.findById(decoded.id, { password: 0 }) // hide password field with projection
    return user
  } catch {
    // jwt will throw error if it can't decode the token
    return null
  }
}
