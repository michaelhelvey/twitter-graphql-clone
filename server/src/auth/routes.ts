import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../data/db'
import config from './config'
import { getUserFromToken } from './index'

const auth = Router()

auth.post('/refresh', async (req, res) => {
  const refreshToken = req.body.refresh_token
  if (!refreshToken) {
    res.status(400).json({
      message: 'Refresh token not found in request body',
    })
  }
  try {
    const user = await getUserFromToken(refreshToken)
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    })
    res.json({
      token,
    })
  } catch (e) {
    res.status(403)
  }
})

auth.post('/register', async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8)
  const user = await User.create({
    ...req.body,
    password: hashedPassword,
  })
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  })
  const refreshToken = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  })
  res.json({
    auth: true,
    token,
    refreshToken,
  })
})

// test login: helvetici, coolpassword420

auth.post('/login', async (req, res) => {
  const user: any = await User.findOne({ username: req.body.username })
  if (user) {
    const isAuthenticated = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (isAuthenticated) {
      // create jwt
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      })
      const refreshToken = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      })
      res.json({
        auth: true,
        token,
        refreshToken,
      })
    } else {
      res.status(401).json({
        auth: false,
        message: 'Username/password combination invalid',
      })
    }
  } else {
    res.status(401).json({
      auth: false,
      message: `User with username ${req.body.username} not found`,
    })
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

export default auth
