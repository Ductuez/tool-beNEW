import jwt from 'jsonwebtoken'
import { SECRET } from '../../config.js'
import moment from 'moment-timezone'
import { LIEN_KET_API, options, API } from '../../constans.js'
import { reject } from 'ramda'
import request from 'postman-request'
import { User } from '../model/user.js'
import { getIO } from '../../socket.io.js'
import { xuLyTurnNext } from './handler.js'

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization

  const token2 = token.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Auth token is not provided' })
  }

  try {
    const decoded = jwt.verify(token2, SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const getRandomValue = () => {
  return Math.random() >= 0.5
}
export const getToken = (req) => {
  const authHeader = req.headers['authorization'] || false
  return authHeader
}

export const getUserSystem = (token) => {
  const user = jwt.verify(token, SECRET, function (err, decoded) {
    if (err) {
    } else {
      return decoded
    }
  })

  return user
}

export const checkWinOrLose = (init, currentMoney) => {
  if (currentMoney > init) {
    return true // Người chơi đã thắng
  } else {
    return false // Người chơi đã thua hoặc chưa có lợi nhuận
  }
}

export const getMultiple = (value) => {
  return value / 1000
}

export const isToDay = (date = new Date()) => {
  const dateInUTC7 = moment(date).tz('Asia/Ho_Chi_Minh')
  const isToday = moment().isSame(dateInUTC7, 'day')

  return isToday
}

export const layHaiSoCuoi = (str) => {
  const strWithoutCommas = str.replace(/,/g, '')

  const concatenatedInt = parseInt(strWithoutCommas)

  const lastTwoDigits = concatenatedInt % 100

  return lastTwoDigits
}

export const areEqual = (value1, value2) => {
  return value1 === value2
}

export const handlerTurnBet = async ({
  tokenTk88,
  gameId,
  turnNow,
  multipleTx,
  multipleChanLe,
  indexLoseChanLe,
  indexLoseTX,
  betInfoCL,
  playCL,
  betInfoTX,
  playTX,
  ketQuaTruoc,
  isTai,
}) => {
  const valueRandomChanLe = getRandomValue()
  const valueRandomTX = getRandomValue()

  ketQuaTruoc.ketQuaTruocChanLe = valueRandomChanLe
  ketQuaTruoc.ketQuaTruocTX = valueRandomTX
  ketQuaTruoc.moneyBetCl = multipleChanLe
  ketQuaTruoc.moneyBetTx = multipleTx

  console.log(multipleChanLe, '==> isTai')

  const duLieuTuyChinh = {
    gameId,
    source: 0,
    turnNum: turnNow,
    bets: [
      {
        betNum: 1,
        // betInfo: valueRandomChanLe ? 'Chẵn' : 'Lẻ',
        // play: valueRandomChanLe ? 'CHAN' : 'LE',

        betInfo: isTai ? 'Tài' : 'Xỉu',
        play: isTai ? 'LON' : 'NHO',
        multiple: multipleChanLe,
        money: 1000,
        playCate: 'GDL2S',
      },
      // {
      //   betNum: 1,
      //   // betInfo: valueRandomTX ? 'Tài' : 'Xỉu',
      //   // play: valueRandomTX ? 'LON' : 'NHO',
      //   betInfo: isTai ? 'Tài' : 'Xỉu',
      //   play: isTai ? 'LON' : 'NHO',
      //   multiple: multipleTx,
      //   money: 1000,
      //   playCate: 'GDL2S',
      // },
    ],
  }

  return new Promise((resolve, reject) => {
    request(
      {
        ...options,
        url: `${API}/front/bet/add`,
        method: 'POST',
        headers: {
          ...options.headers,
          'x-session-token': tokenTk88,
        },
        body: JSON.stringify(duLieuTuyChinh),
      },
      async (err, httpResponse, body) => {
        if (err) {
          reject(err)
          return
        }
        // const check = await checkToken88(tokenTk88)
        // let infoUser = await User.findOne({ tokenBet: tokenTk88 })

        // infoUser.money = check?.t || 0

        // await infoUser.save()
        resolve(JSON.parse(body))
      }
    )
  })
}

export const ketQuaXoSo = async (data) => {
  return new Promise((resolve, reject) => {
    request(
      {
        ...options,
        url: LIEN_KET_API[data],
        method: 'GET',
      },
      async (err, httpResponse, body) => {
        if (err) {
          reject(err)
          return
        }
        resolve(JSON.parse(body))
      }
    )
  })
}

export const checkToken88 = async (tokenTk88) => {
  return new Promise((resolve, reject) => {
    request(
      {
        ...options,
        url: `${API}/front/user/money`,
        method: 'GET',
        headers: {
          ...options.headers,
          'x-session-token': tokenTk88,
        },
      },
      async (err, httpResponse, body) => {
        if (err) return reject(err)

        resolve(JSON.parse(body))
      }
    )
  })
}

export const handleSocket = () => {
  const io = getIO()
}

export const xuLyLoseWinCount = async ({ BotBet, isWinChanLe, isWinTaiXiu, moneyBetCl, moneyBetTx, botId }) => {
  var botBetGame = await BotBet.findById(botId)
  const moneyBotBet = botBetGame?.moneyWin || 0
  let { loseCount = 0, winCount = 0 } = botBetGame || {}
  winCount = isWinTaiXiu ? winCount + 1 : winCount
  loseCount = !isWinTaiXiu ? loseCount + 1 : loseCount

  winCount = isWinChanLe ? winCount + 1 : winCount
  loseCount = !isWinChanLe ? loseCount + 1 : loseCount

  const newMoneyBotBet =
    moneyBotBet +
    (isWinChanLe ? moneyBetCl * 1000 * 0.997 : -moneyBetCl * 1000) +
    (isWinTaiXiu ? moneyBetTx * 1000 * 0.997 : -moneyBetTx * 1000)

  // botBetGame.moneyWin = newMoneyBotBet
  botBetGame.winCount = winCount || 0
  botBetGame.loseCount = loseCount || 0

  const result = await botBetGame.save()

  return {
    ...result,
    moneyWin: newMoneyBotBet || 0,
  }
}

export const multipleCLTX = ({
  von = [],
  isWinChanLe,
  indexLoseChanLe,
  indexLoseTX,
  baseMultipleCL,
  isWinTaiXiu,
  methodCauTx,
  methodCauCL,
  baseMultipleTX,
  transformedCL,
  chuyenDoiTX,
  indexWinChanLe,
  indexWinTX,
  tangGiaTri,
  count,
}) => {
  const doDaiArrayVon = von.length

  const duLieuParam = {
    isWinChanLe,
    indexLoseChanLe,
    indexLoseTX,
    baseMultipleCL,
    isWinTaiXiu,
    methodCauTx,
    methodCauCL,
    baseMultipleTX,
    transformedCL,
    chuyenDoiTX,
    doDaiArrayVon,
    indexWinChanLe,
    indexWinTX,
    count,
    von,
  }

  const result =
    tangGiaTri === 'gapLose'
      ? methodGapLose(duLieuParam)
      : tangGiaTri === 'gapWin'
      ? methodGapWin(duLieuParam)
      : methodAlwayTang(duLieuParam)

  const { multipleChanLe, multipleTx, betInfoTX, playTX, betInfoCL, playCL } = result

  return {
    playCL,
    betInfoCL,
    playTX,
    multipleTx,
    multipleChanLe,
    betInfoTX,
  }
}

export const khoiTaoBetGame = async ({ req, method, gameId }) => {
  const token = getToken(req)
  const { userId, username } = getUserSystem(token)
  const user = await User.findById(userId)

  // const { methodMoney, methodCau } = method

  const { chotLai, chotLo, von, phuongPhap, isTai } = req.body

  const duLieuTuyChinh = {
    ...req.body,
    moneyWinEnd: chotLai,
    moneyLoseEnd: chotLo,
    phuongPhap: method,
    von: von[0].split(',').map(Number),
    phuongPhap,
    isTai,
  }

  const tokenTk88 = user.tokenBet
  const getTurnNowMB75 = (await xuLyTurnNext({ gameId }))?.t

  const { turnNum, betStartTime, betEndTime, openTime } = getTurnNowMB75

  const paramInit = {
    betEndTime,
    betStartTime,
    openTime,
    tokenTk88,
    turnNumBegin: turnNum,
    gameId,
    userId,
    username,
    ...duLieuTuyChinh,
  }

  return paramInit
}

export const methodGapLose = ({
  isWinChanLe,
  indexLoseChanLe,
  indexLoseTX,
  baseMultipleCL,
  isWinTaiXiu,
  methodCauTx,
  methodCauCL,
  baseMultipleTX,
  transformedCL,
  chuyenDoiTX,
  doDaiArrayVon,
  von,
}) => {
  const multipleChanLe = isWinChanLe
    ? getMultiple(von[0])
    : indexLoseChanLe < doDaiArrayVon
    ? getMultiple(von[indexLoseChanLe])
    : baseMultipleCL

  const multipleTx = isWinTaiXiu
    ? getMultiple(von[0])
    : indexLoseTX < doDaiArrayVon
    ? getMultiple(von[indexLoseTX])
    : baseMultipleTX

  const betInfoTX = isWinTaiXiu
    ? methodCauTx[0]
    : indexLoseTX < doDaiArrayVon
    ? methodCauTx[indexLoseTX]
    : methodCauTx[0]

  const playTX = isWinTaiXiu ? chuyenDoiTX[0] : indexLoseTX < doDaiArrayVon ? chuyenDoiTX[indexLoseTX] : chuyenDoiTX[0]

  const betInfoCL = isWinChanLe
    ? methodCauCL[0]
    : indexLoseChanLe < doDaiArrayVon
    ? methodCauCL[indexLoseChanLe]
    : methodCauCL[0]

  const playCL = isWinChanLe
    ? transformedCL[0]
    : indexLoseChanLe < doDaiArrayVon
    ? transformedCL[indexLoseChanLe]
    : transformedCL[0]

  return { multipleChanLe, multipleTx, betInfoTX, playTX, betInfoCL, playCL }
}

export const methodGapWin = ({
  isWinChanLe,
  baseMultipleCL,
  isWinTaiXiu,
  methodCauTx,
  methodCauCL,
  baseMultipleTX,
  transformedCL,
  chuyenDoiTX,
  doDaiArrayVon,
  indexWinChanLe,
  indexWinTX,
  von,
}) => {
  const multipleChanLe = isWinChanLe
    ? indexWinChanLe < doDaiArrayVon
      ? getMultiple(von[indexWinChanLe])
      : baseMultipleCL
    : baseMultipleCL

  const multipleTx = isWinTaiXiu
    ? indexWinTX < doDaiArrayVon
      ? getMultiple(von[indexWinTX])
      : baseMultipleTX
    : baseMultipleTX

  const betInfoTX = isWinTaiXiu
    ? indexWinTX < doDaiArrayVon
      ? methodCauTx[indexWinTX]
      : methodCauTx[0]
    : methodCauTx[0]

  const playTX = isWinTaiXiu ? (indexWinTX < doDaiArrayVon ? chuyenDoiTX[indexWinTX] : chuyenDoiTX[0]) : chuyenDoiTX[0]

  const betInfoCL = isWinChanLe
    ? indexWinChanLe < doDaiArrayVon
      ? methodCauCL[indexWinChanLe]
      : methodCauCL[0]
    : methodCauCL[0]

  const playCL = isWinChanLe
    ? indexWinTX < doDaiArrayVon
      ? transformedCL[indexWinTX]
      : transformedCL[0]
    : transformedCL[0]

  return { multipleChanLe, multipleTx, betInfoTX, playTX, betInfoCL, playCL }
}

export const methodAlwayTang = ({
  baseMultipleCL,
  methodCauTx,
  methodCauCL,
  baseMultipleTX,
  transformedCL,
  chuyenDoiTX,
  count,
  von,
}) => {
  const multipleChanLe = getMultiple(von[count])
  const multipleTx = getMultiple(von[count])
  const betInfoTX = methodCauTx[count]
  const playTX = chuyenDoiTX[count]
  const betInfoCL = methodCauCL[count]
  const playCL = transformedCL[count]

  return { multipleChanLe, multipleTx, betInfoTX, playTX, betInfoCL, playCL }
}
