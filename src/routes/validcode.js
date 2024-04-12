import express from 'express'
import request from 'postman-request'
import { SECRET } from '../../config.js'
import jwt from 'jsonwebtoken'

import { API, options } from '../../constans.js'
import { getToken, getUserSystem } from '../ultil/common.js'

const router = express.Router()

// Xử lý yêu cầu GET đến đường dẫn "/mucDich"
router.get('/', async function (req, res) {
  try {
    await request(
      {
        ...options,
        url: `https://api.tk812.com/api/front/index/getvalidatecode`,
        method: 'POST',
        body: JSON.stringify({ foo: 'bar' }),
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

export default router
