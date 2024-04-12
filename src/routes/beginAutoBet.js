import express from 'express'
import { getRandomValue, getToken, getUserSystem, khoiTaoBetGame, layHaiSoCuoi } from '../ultil/common.js'
import { User } from '../model/user.js'
import { handlerOnlineUser, handlerStartGameBot, xuLyTurnNext, handlerStopGame } from '../ultil/handler.js'

// const Token = 'O9MEzbJ03vCDbeCrCh0EW/c6dYky5JYbP6YjwA=='
const router = express.Router()

// 4 cái đầu 75s

router.post('/mb75s', async (req, res) => {
  const { method, gameId = 162 } = req.body || {}
  var ketQuaTruoc = {}

  const ketQua = await khoiTaoBetGame({ method, req, gameId })
  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 75, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

router.post('/mbtk75s', async (req, res) => {
  const { method, gameId = 181 } = req.body || {}
  var ketQuaTruoc = {}

  const ketQua = await khoiTaoBetGame({ method, req, gameId })
  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 75, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

router.post('/mt75s', async (req, res) => {
  const { method, gameId = 164 } = req.body || {}
  var ketQuaTruoc = {}

  const ketQua = await khoiTaoBetGame({ method, req, gameId })

  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 75, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

router.post('/tkxsmt75s', async (req, res) => {
  const { method } = req.body || {}
  var ketQuaTruoc = {}

  const ketQua = await khoiTaoBetGame({ method, req, gameId })

  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 75, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})
// 1PHut
router.post('/tkxsst1p', async (req, res) => {
  const { method, gameId = 176 } = req.body || {}
  var ketQuaTruoc = {}

  const ketQua = await khoiTaoBetGame({ method, req, gameId })

  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 60, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

// 2Phut
router.post('/tkxsst2p', async (req, res) => {
  const { method, gameId = 178 } = req.body || {}
  const ketQua = await khoiTaoBetGame({ method, req, gameId })
  var ketQuaTruoc = {}

  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 120, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

router.post('/tkxsst45s', async (req, res) => {
  const { method, gameId = 173 } = req.body || {}
  var ketQuaTruoc = {}

  const ketQua = await khoiTaoBetGame({ method, req, gameId })

  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 45, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

router.post('/tkxsmn45', async (req, res) => {
  const { method, gameId = 182 } = req.body || {}
  var ketQuaTruoc = {}

  const ketQua = await khoiTaoBetGame({ method, req, gameId })

  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 45, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

router.post('/tkxsst90s', async (req, res) => {
  const { method, gameId = 177 } = req.body || {}
  var ketQuaTruoc = {}

  const ketQua = await khoiTaoBetGame({ method, req, gameId })

  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 90, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

router.post('/173mbtk45s', async (req, res) => {
  const { method, gameId = 173 } = req.body || {}
  var ketQuaTruoc = {}

  console.log(req.body, 'req.bodyreq.body')

  const ketQua = await khoiTaoBetGame({ method, req, gameId })

  const tokenTk88 = ketQua.tokenTk88

  handlerStartGameBot({ ...ketQua, timeCount: 45, ketQuaTruoc })
  handlerOnlineUser(tokenTk88)

  res.send({ message: 'Interval started' })
})

router.post('/stop', async function (req, res) {
  const intervalData = handlerStartGameBot({}).gameIntervalId
  clearInterval(intervalData)

  res.send({ message: 'Interval stopped' })
})

export default router
