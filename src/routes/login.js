import express from 'express'
import request from 'postman-request'
import { User } from '../model/user.js'

import { API, options } from '../../constans.js'
import { getToken, getUserSystem } from '../ultil/common.js'

const router = express.Router()

router.post('/', function (req, res) {
  const { account, loginSrc = 0, password, validCode, validCodeIdentity } = req.body || {}
  const token = getToken(req)

  const { userId } = getUserSystem(token)

  const duLieuTuyChinh = {
    account,
    loginSrc,
    password,
    // validCode,
    // validCodeIdentity,
  }

  request(
    {
      ...options,
      url: `${API}/front/index/login`,
      method: 'POST',
      body: JSON.stringify(duLieuTuyChinh),
    },
    async (err, httpResponse, body) => {
      if (err) res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau', err })

      try {
        let body2 = JSON.parse(body)
        const duLieuTuyChinh = {
          tokenBet: body2?.t?.token,
          phone: body2?.t?.phone,
          money: body2?.t?.money || 0,
        }
        const user = await User.findByIdAndUpdate(userId, duLieuTuyChinh, { new: true })

        await user.save()

        res.send(user)
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error', error })
      }
    }
  )
})

export default router
