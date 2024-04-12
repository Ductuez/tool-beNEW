import express from 'express'
import { User } from '../model/user.js'
import { API, options } from '../../constans.js'
import { checkToken88, getToken, getUserSystem } from '../ultil/common.js'

const router = express.Router()

router.get('/', async function (req, res) {
  try {
    const token = getToken(req)
    const { userId } = getUserSystem(token)

    let infoUser = await User.findByIdAndUpdate(userId)
    const expiredToken88 = await checkToken88(infoUser.tokenBet)
    if (!expiredToken88.success) {
      infoUser.tokenBet = ''
      infoUser.money = expiredToken88?.t || 0
      await infoUser.save()
    }

    infoUser.money = expiredToken88?.t || 0
    await infoUser.save()

    res.send(infoUser)
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error')
  }
})

router.post('/token88', async function (req, res) {
  try {
    const token = getToken(req)
    const { userId } = getUserSystem(token)

    const { tokenBet } = req.body

    let infoUser = await User.findByIdAndUpdate(userId)
    const expiredToken88 = await checkToken88(tokenBet)
    if (!expiredToken88.success) {
      res.status(500).send({ message: 'Token không tồn tại hoặc không đúng', status: false })
    } else {
      infoUser.money = expiredToken88?.t || 0
      infoUser.tokenBet = tokenBet
      await infoUser.save()

      res.send(infoUser)
    }
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error')
  }
})

export default router
