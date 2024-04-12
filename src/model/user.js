import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    money: {
      type: Number,
      default: 0,
    },
    moneyRunSystem: {
      type: Number,
    },
    tokenBet: {
      type: String,
    },
    expired: {
      type: Boolean,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const User = model('User', userSchema)
