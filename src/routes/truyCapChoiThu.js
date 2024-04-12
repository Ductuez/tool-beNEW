import express from 'express'
import request from 'postman-request'
import { SECRET } from '../../config.js'
import jwt from 'jsonwebtoken'

import { API, options } from '../../constans.js'
import { User } from '../model/user.js'
import { getToken, getUserSystem } from '../ultil/common.js'

const router = express.Router()

router.get('/', async function (req, res) {
  const token = getToken(req)

  const { userId } = getUserSystem(token)

  try {
    request(
      {
        ...options,
        url: `${API}/front/index/loginforguest`,
        method: 'POST',
        body: JSON.stringify({ account: '!guest!', password: '46da83e1773338540e1e1c973f6c8a68' }),
      },
      async (err, httpResponse, body) => {
        try {
          if (err) throw err

          const body2 = JSON.parse(body)
          await User.findByIdAndUpdate(userId, { tokenBet: body2.t.token }, { new: true })
        } catch (error) {
          console.log(error)
          res.status(500).json({ message: 'Server error', error })
        }
      }
    )
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

export default router
