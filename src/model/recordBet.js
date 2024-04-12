import mongoose from 'mongoose'

const { Schema } = mongoose

const recordBetSchema = new Schema(
  {
    date: {
      type: Date,
    },
    balance: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    username: {
      type: String,
    },
    winCount: {
      type: Number,
      default: 0,
    },
    loseCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model('RecordBet', recordBetSchema)
