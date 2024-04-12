import { Schema } from 'mongoose'

export const userBetSchema = new Schema({
  email: {
    type: String,
  },
  fullName: {
    type: String,
  },
  userName: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  superUserName: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
  },
})
