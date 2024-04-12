import express from 'express'
import request from 'postman-request'
import { User } from '../model/user.js'

import { API, options } from '../../constans.js'
import { getUserSystem, getToken } from '../ultil/common.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const token = getToken(req)
  const body = req.body
  const { userId } = getUserSystem(token)
  const user = await User.findById(userId)

  const tokenTk88 = user.tokenBet

  request(
    {
      ...options,
      url: `${API}/font/user/info`,
      method: 'GET',
      headers: {
        ...options.headers,
        'x-session-token': tokenTk88,
      },
      body: JSON.stringify(body),
    },
    async (err, httpResponse, body) => {
      try {
        const { superUserName, phone, fullName } = body

        const user = await User.findByIdAndUpdate(userId, { superUserName, phone, fullName }, { new: true })

        const savedUser = await user.save()
        res.send(savedUser)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message || 'Server error' })
      }
    }
  )
})

export default router
