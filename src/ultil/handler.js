import request from 'postman-request'
import RecordBet from '../model/recordBet.js'
import * as R from 'ramda'
import moment from 'moment-timezone'

import { API, MAPPING, options } from '../../constans.js'
import {
  areEqual,
  checkWinOrLose,
  getMultiple,
  getRandomValue,
  handlerTurnBet,
  ketQuaXoSo,
  layHaiSoCuoi,
  multipleCLTX,
  xuLyLoseWinCount,
} from './common.js'
import { isToDay } from './common.js'
import recordBet from '../model/recordBet.js'
import { BotBet } from '../model/botBet.js'

export const xuLyOnLineUser = async (START, timeLineGame) => {
  const status = await request(
    {
      ...options,
      url: `${API}/front/index/onlineUser`,
      method: 'POST',
      headers: {
        ...options.headers,
        'x-session-token': 'EhQecmSirEgOnRMJkWWmav/YYQgZYNnTUBVIaA==',
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        clearInterval(START)
        clearInterval(timeLineGame)
        console.log(`stop`)
        return false
      }

      return
    }
  )

  return status()
}

export const xuLyTimeLine = async (START, timeLineGame) => {
  request(
    {
      ...options,
      url: `${API}/front/user/timeline/${162}`,
      method: 'GET',
      headers: {
        ...options.headers,
        'x-session-token': 'EhQecmSirEgOnRMJkWWmav/YYQgZYNnTUBVIaA==',
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        clearInterval(START)
        clearInterval(timeLineGame)
        console.log(`stop`)
        return
      }

      return body?.t?.turnNow
    }
  )
}

export const xuLyTurnNext = async ({ gameId = 162 }) => {
  return new Promise((resolve, reject) => {
    request(
      {
        ...options,
        url: `${API}/front/gametime/${gameId}`,
        method: 'GET',
        headers: {
          ...options.headers,
        },
      },
      (err, httpResponse, body) => {
        if (err) {
          reject(err)
          return
        }
        const result = JSON.parse(body)

        resolve(result)
      }
    )
  })
}

export const handlerOnlineUser = (tokenTk88) => {
  const intervalID = setInterval(() => {
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
      (err, httpResponse, body) => {}
    )
  }, 10000)
  return intervalID
}

export const getMoney = (tokenTk88) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: `${API}/front/user/money`,
        method: 'GET',
        headers: {
          'x-session-token': tokenTk88,
        },
      },
      (err, httpResponse, body) => {
        if (err) {
          reject(err) // handle error
          return
        }
        const money = JSON.parse(body)
        resolve(money.t) // return money
      }
    )
  })
}

export const handlerBet = async (duLieu, tokenTk88 = 'BiZOv5Qs09jaGKoaAx/CHPNcB5XhP7DIMcPj7w==', gameId) => {
  const turnNum = await xuLyTurnNext(gameId)
  const tienKhoiTao = duLieu.moneyInit
  const moneyHienTai = duLieu.money
  const amount = 100

  if (amount > moneyHienTai) {
    console.log('Bạn không đủ tiền để đặt cược.')
    return
  }

  isWinMB75s = checkWinOrLose(tienKhoiTao, moneyHienTai)

  const duLieuTuyChinh = {
    ...duLieu,
    turnNum,
    source: 1,
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
      (err, httpResponse, body) => {
        if (err) {
          reject(err) // handle error
          return
        }
        const result = JSON.parse(body)
        resolve({
          money: result.t.money,
        }) // return money
      }
    )
  })
}

export const handlerStartGameBot = async ({
  betEndTime,
  tokenTk88,
  turnNumBegin,
  method,
  gameId,
  userId,
  username,
  moneyWinEnd,
  moneyLoseEnd,
  methodCau = {},
  botId,
  von,
  ketQuaTruoc,
  timeCount,
  tangGiaTri,
  isTai,
}) => {
  const remainingTime = Math.max(0, betEndTime - Date.now()) / 1000
  let indexLoseChanLe = 0
  let indexLoseTX = 0
  let indexWinChanLe = 0
  let indexWinTX = 0
  let turn = turnNumBegin
  var historyBetToday
  let isWin = true
  let checkFirst = true
  let gameIntervalID = null
  let timeOutRemaning = null
  let winMoney = 0
  let timeInit = timeCount
  let count = 0

  const { methodCauTx = [], methodCauCL = [] } = methodCau

  const chuyenDoiTX = methodCauTx.map((str) => R.propOr(str, str, MAPPING)) || [] // LON, NHO
  const transformedCL = methodCauCL.map((str) => R.propOr(str, str, MAPPING)) || [] // CHAN , LE

  let betInfoCL = methodCauTx[0]
  let playCL = chuyenDoiTX[0]

  let betInfoTX = methodCauCL[0]
  let playTX = transformedCL[0]

  const baseMultipleTX = getMultiple(von[0])
  const baseMultipleCL = getMultiple(von[0])
  let multipleTx = baseMultipleTX
  let multipleChanLe = baseMultipleCL

  try {
    timeOutRemaning = setTimeout(async () => {
      if (checkFirst) {
        const date = moment().tz('Asia/Ho_Chi_Minh')
        const dateString = date.format('YYYY-MM-DD')
        historyBetToday = await RecordBet.findOne({ userId, date: dateString })
        let botBetGameFrist = await BotBet.findById(botId)
        botBetGameFrist.status = true
        await botBetGameFrist.save()
      }
      gameIntervalID = setInterval(
        async () => {
          const getTurnNow = (await xuLyTurnNext({ gameId }))?.t
          let botBetGame = await BotBet.findById(botId)
          const checkStatusBotBet = botBetGame?.status

          if (!checkStatusBotBet) {
            clearInterval(gameIntervalID)
          }

          const { turnNum } = getTurnNow
          turn = turnNum

          if (checkFirst) {
            handlerTurnBet({
              isWin,
              method,
              tokenTk88,
              indexLoseChanLe,
              indexLoseTX,
              gameId,
              turnNow: turnNum,
              userId,
              username,
              multipleTx,
              multipleChanLe,
              betInfoCL,
              playCL,
              betInfoTX,
              playTX,
              ketQuaTruoc,
              winMoney,
              isTai,
            })
          } else {
            const resultKQ = await ketQuaXoSo(gameId)
            const haiSoCuoi = layHaiSoCuoi(resultKQ?.t?.issueList[0]?.openNum)
            const { ketQuaTruocTX, ketQuaTruocChanLe, moneyBetCl, moneyBetTx } = ketQuaTruoc

            const laChan = haiSoCuoi % 2 === 0
            const laTai = haiSoCuoi >= 50

            const isWinChanLe = areEqual(laChan, ketQuaTruocChanLe)
            const isWinTaiXiu = areEqual(laTai, ketQuaTruocTX)

            indexLoseChanLe = isWinChanLe ? 0 : indexLoseChanLe + 1
            indexLoseTX = isWinTaiXiu ? 0 : indexLoseTX + 1

            indexWinChanLe = isWinChanLe ? indexWinChanLe + 1 : 0
            indexWinTX = isWinTaiXiu ? indexWinTX + 1 : 0
            count = count + 1
            if (count === von.length) {
              count = 0
            }
            const multipleCLTXFn = multipleCLTX({
              isWinChanLe,
              indexLoseChanLe,
              indexLoseTX,
              von,
              baseMultipleCL,
              isWinTaiXiu,
              methodCauTx,
              methodCauCL,
              baseMultipleTX,
              transformedCL,
              chuyenDoiTX,
              indexWinChanLe,
              indexWinTX,
              indexWinChanLe,
              indexWinTX,
              tangGiaTri,
              count,
            })

            multipleChanLe = multipleCLTXFn.multipleChanLe
            multipleTx = multipleCLTXFn.multipleTx
            betInfoTX = multipleCLTXFn.betInfoTX
            playTX = multipleCLTXFn.playTX
            betInfoCL = multipleCLTXFn.betInfoCL
            playCL = multipleCLTXFn.playCL

            // const ketQua = await xuLyLoseWinCount({ BotBet, isWinChanLe, isWinTaiXiu, moneyBetCl, moneyBetTx, botId })

            // const { newMoneyBotBet } = ketQua

            // if (newMoneyBotBet > moneyWinEnd || newMoneyBotBet < -moneyLoseEnd) {
            //   clearInterval(gameIntervalID)
            // } else {

            // }
            handlerTurnBet({
              isWin,
              method,
              tokenTk88,
              indexLoseChanLe,
              indexLoseTX,
              gameId,
              turnNow: turnNum,
              userId,
              username,
              multipleTx,
              multipleChanLe,
              betInfoCL,
              playCL,
              betInfoTX,
              playTX,
              ketQuaTruoc,
              winMoney,
              botBetGame,
              isWinChanLe,
              isWinTaiXiu,
              indexWinChanLe,
              indexWinTX,
              isTai,
            })
          }
          checkFirst = false
        },

        timeCount * 1000
      )

      return {
        gameIntervalId: gameIntervalID,
        indexLoseChanLe,
        indexLoseTX,
      }
    }, remainingTime * 1000)
  } catch (error) {
    console.log(error)
  }
}

export const handleMoneyInsert = async ({ userId, money, username }) => {
  const date = moment().tz('Asia/Ho_Chi_Minh')
  const dateString = date.format('YYYY-MM-DD')

  const homNay = isToDay()

  if (homNay) {
    const updatedRecord = await recordBet.findOneAndUpdate(
      { date: dateString },
      { $set: { balance: money, userId, username, loseCount } },
      { new: true }
    )
  } else {
    const newRecord = new RecordBet({
      date: dateString,
      balance: money,
      userId,
      username,
      loseCount,
    })
    await newRecord.save()
    console.log(`Created new record for ${dateString}:`, newRecord)
    return newRecord
  }
}

export const handlerStopGame = () => {
  prevMoney
  loseCount = 0
  currentMoney = 0
  isWinMB75s = true
  checkFirst = true
  clearInterval(gameIntervalID)
  clearTimeout(timeOutRemaning)
}
