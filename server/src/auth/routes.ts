import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../data/db'
import config from './config'
import { getUserFromToken } from './index'

const auth = Router()
export default auth

auth.post('/register', async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8)
  const user = await User.create({
    ...req.body,
    password: hashedPassword,
  })
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 86400,
  })
  res.json({
    auth: true,
    token,
  })
})

auth.post('/login', async (req, res) => {
  const user: any = await User.findOne({ username: req.body.username })
  if (user) {
    const isAuthenticated = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (isAuthenticated) {
      // create jwt
      const token = jwt.sign({ id: user._id }, config.secret)
      res.json({
        auth: true,
        token,
      })
    } else {
      res.status(401).json({
        message: 'Username/password combination invalid',
      })
    }
  } else {
    res
      .status(404)
      .json({ message: `User with username ${req.body.username} not found` })
  }
})

auth.get('/me', async (req, res) => {
  const token = req.get('Authorization') || ''
  const user = await getUserFromToken(token)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'User not found from token' })
  }
})
