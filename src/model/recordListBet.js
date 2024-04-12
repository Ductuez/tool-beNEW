import mongoose from 'mongoose'
const Schema = mongoose.Schema

const recordListBetSchema = new Schema(
  {
    date: {
      type: Date,
    },
    balance: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: {
      type: String,
    },
    winCount: {
      type: String,
      defaultL: '0',
    },
    loseCount: {
      type: String,
      defaultL: '0',
    },
  },
  { timestamps: true }
)
export default mongoose.model('recordListBet', recordListBetSchema)
