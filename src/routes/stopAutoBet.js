import express from "express";
import request from "postman-request";

import { API, options } from "../../constans.js";

const router = express.Router();

router.post("/", function (req, res) {
  clearInterval(START);
  res.send({ message: "Interval stopped" });
});

export default router;
