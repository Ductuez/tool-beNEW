import express from 'express'
import { BotBet } from '../model/botBet.js'

import { getToken, getUserSystem } from '../ultil/common.js'

const router = express.Router()

router.post('/add', async (req, res) => {
  const { name, quanLyVon, tangGiaTri, von, chotLai, chotLo, phuongPhap, game, status = false, isTai } = req.body
  const token = getToken(req)
  const { userId } = getUserSystem(token)

  try {
    const duLieuCanLuu = {
      name,
      quanLyVon,
      tangGiaTri,
      von,
      chotLai,
      chotLo,
      phuongPhap,
      game,
      userId,
      status,
      isTai,
    }

    const botSave = new BotBet(duLieuCanLuu)
    botSave.save()

    res.json(botSave)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.get('/list', async (req, res) => {
  const token = getToken(req)
  const { userId } = getUserSystem(token)

  try {
    const listDsBot = await BotBet.find({ userId })
    res.json(listDsBot)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { idBot } = req.body

    await BotBet.findByIdAndDelete(idBot)

    res.status(200).json({ message: 'Bot deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error })
  }
})

router.post('/stopBot', async (req, res) => {
  try {
    const { idBot } = req.body

    await BotBet.findByIdAndUpdate(idBot, { status: false }, { new: true })

    res.status(200).json({ message: 'Bot stop successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
