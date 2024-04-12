import { Schema, model } from 'mongoose'
import { any } from 'ramda'

const botBetSchema = new Schema(
  {
    name: {
      type: String,
    },
    quanLyVon: {
      type: String,
    },
    tangGiaTri: {
      type: String,
    },
    von: {
      type: Array,
    },
    chotLai: {
      type: Number,
    },
    chotLo: {
      type: Number,
    },
    phuongPhap: {
      type: String,
    },
    game: {
      type: Array,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: Boolean,
      default: false,
    },
    moneyWin: {
      type: Number,
      default: 0,
    },
    winCount: {
      type: Number,
      default: 0,
    },
    loseCount: {
      type: Number,
      default: 0,
    },
    isTai: {
      type: String,
    },
  },
  { timestamps: true }
)

export const BotBet = model('BotBet', botBetSchema)
