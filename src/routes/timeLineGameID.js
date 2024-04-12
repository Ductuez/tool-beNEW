import express from "express";
import request from "postman-request";

import { API, options } from "../../constans.js";

const router = express.Router();

router.post("/", function (req, res) {
  const { gameID } = req.body || {};
  request(
    {
      ...options,
      url: `${API}/front/user/timeline/${gameID}`,
      method: "GET",
      headers: {
        ...options.headers,
        "x-session-token": "TOKEN",
      },
    },
    (err, httpResponse, body) => {
      res.send(JSON.parse(body));
    }
  );
});

/*
{
  "success": true,
  "msg": "ok",
  "code": 0,
  "t": {
    "userMoney": 197.6,
    "userNotices": [],
    "betWinNotices": [],
    "maxRewardNotices": [],
    "gameWinMoney": null,
    "lastTurnNum": "16/04/2023-0568",
    "serverTime": 1681645848556,
    "redEnpRainVO": null
  }
}

 */
export default router;
