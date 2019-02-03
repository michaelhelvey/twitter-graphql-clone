import mongoose from 'mongoose'
import autoPopulate from 'mongoose-autopopulate'
mongoose.plugin(autoPopulate)

const Types = mongoose.Types

mongoose.connect(
  'mongodb://localhost/twitter',
  { useNewUrlParser: true }
)

export const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      name: String,
      email: String,
      password: String,
      username: String,
      description: String,
      link: String,
      following_count: { type: Number, default: 0 },
      followers_count: { type: Number, default: 0 },
    },
    { toJSON: { virtuals: true } }
  )
)
const TweetSchema = new mongoose.Schema(
  {
    author: { type: Types.ObjectId, ref: 'User', autopopulate: true },
    in_reply_to: { type: Types.ObjectId, ref: 'Tweet', autopopulate: true },
    retweeting: { type: Types.ObjectId, ref: 'Tweet', autopopulate: true },
    body: String,
    retweet_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    reply_count: { type: Number, default: 0 },
    is_liked: { type: Boolean, default: false },
    created_at: { type: Number, default: Date.now },
  },
  { toJSON: { virtuals: true } }
)
export const Tweet = mongoose.model('Tweet', TweetSchema)

export const TweetLike = mongoose.model(
  'TweetLike',
  new mongoose.Schema(
    {
      liked_by: { type: Types.ObjectId, ref: 'User' },
      tweet: { type: Types.ObjectId, ref: 'Tweet' },
      created_at: { type: Number, default: Date.now },
    },
    { toJSON: { virtuals: true } }
  )
)

export const UserFollow = mongoose.model(
  'UserFollow',
  new mongoose.Schema(
    {
      user: { type: Types.ObjectId, ref: 'User' },
      user_to_follow: { type: Types.ObjectId, ref: 'User' },
      created_at: { type: Number, default: Date.now },
    },
    { toJSON: { virtuals: true } }
  )
)
