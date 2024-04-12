import express from 'express'
import request from 'postman-request'
import { User } from '../model/user.js'

import { API, options } from '../../constans.js'
import { getUserSystem, getToken } from '../ultil/common.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const token = getToken(req)
  const { userId } = getUserSystem(token)
  const user = await User.findById(userId)
  const tokenTk88 = user.tokenBet

  request(
    {
      ...options,
      url: `${API}/front/index/onlineUser`,
      method: 'POST',
      headers: {
        ...options.headers,
        'x-session-token': tokenTk88,
      },
    },
    (err, httpResponse, body) => {
      res.send(JSON.parse(body))
    }
  )
})

export default router
