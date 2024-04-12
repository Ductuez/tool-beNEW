import express from "express";
import request from "postman-request";

import { API, options } from "../../constans.js";

const router = express.Router();

router.post("/", function (req, res) {
  request(
    {
      ...options,
      url: `${API}/front/user/money`,
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

export default router;
