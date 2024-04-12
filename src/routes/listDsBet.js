import express from 'express'
import request from 'postman-request'
import { User } from '../model/user.js'

import { API, options } from '../../constans.js'
import { getToken, getUserSystem } from '../ultil/common.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const { page = 1, size = 5 } = req.body
  const token = getToken(req)

  const { userId } = getUserSystem(token)

  const user = await User.findById(userId)

  const tokenTk88 = user.tokenBet

  const duLieuTuyChinh = {
    page,
    size,
  }

  request(
    {
      ...options,
      url: `${API}/front/bet/official/list`,
      method: 'POST',
      headers: {
        ...options.headers,
        'x-session-token': tokenTk88,
      },
      body: JSON.stringify(duLieuTuyChinh),
    },
    async (err, httpResponse, body) => {
      console.log(body, 'body');
      res.send(JSON.parse(body))
    }
  )
})

export default router
