import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import request from 'postman-request'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { getIO, init } from './socket.io.js'
import http from 'http'
import { MongoClient, ServerApiVersion } from 'mongodb'

import {
  Validcode,
  Login,
  GetMoney,
  GetUserBet,
  OnlineUserBet,
  TimeLineGameID,
  SignUpSignIn,
  BeginAutoBet,
  BetMoney,
  GetInfoUser,
  ListDsBet,
  ListDsBot,
  TruyCapChoiThu,
} from './src/routes/index.js'

import { verifyToken } from './src/ultil/common.js'
import { options } from './constans.js'

const apiProxy = createProxyMiddleware('/', {
  target: 'https://api.tk88.house', // Thay đổi địa chỉ tương ứng với trang web mà bạn muốn proxy
  changeOrigin: true, // Thay đổi host và origin trong yêu cầu gửi đi
})

const uri = 'mongodb://127.0.0.1:27017/'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

const connectDB = () => {
  try {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('oke db')
      })
      .catch((error) => console.log(error))
  } catch (error) {
    console.log(error)
  }
}

connectDB()

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const app = express()
const port = process.env.PORT || 3200

const corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', apiProxy)

app.use('/validcode', Validcode)
app.use('/login', verifyToken, Login)
app.use('/getMoney', verifyToken, GetMoney)
app.use('/userbet', verifyToken, GetUserBet)
app.use('/useronline', verifyToken, OnlineUserBet)
app.use('/timelinegame', verifyToken, TimeLineGameID)
app.use('/authorsystem', SignUpSignIn)
app.use('/auto', verifyToken, BeginAutoBet)
app.use('/bet', verifyToken, BetMoney)
app.use('/info', verifyToken, GetInfoUser)
app.use('/listbet', verifyToken, ListDsBet)
app.use('/bot', verifyToken, ListDsBot)
app.use('/trial', verifyToken, TruyCapChoiThu)
const server = http.createServer(app)

app.get('/', async (req, res) => {
  try {
    await request(
      {
        ...options,
        url: `https://www.vnlottery.net/api/front/open/lottery/history/list/5/mbmg`,
        method: 'GET',
      },
      (err, httpResponse, body) => {
        console.log(err, 'errerr')
        res.send(JSON.parse(body))
      }
    )
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

init(server)
server.listen(port, () => {
  console.log(`Server ok listening at ${port}`)
})
