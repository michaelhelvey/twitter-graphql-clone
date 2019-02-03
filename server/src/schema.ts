import { gql } from 'apollo-server-express'

export default gql`
  scalar ObjectId

  type User {
    _id: ObjectId!
    name: String
    username: String
    email: String
    description: String
    link: String
    avatar: String
    cover_photo: String
    following_count: String
    followers_count: String
  }

  type Tweet {
    _id: ObjectId!
    author: User!
    in_reply_to: Tweet
    retweeting: Tweet
    body: String
    retweet_count: Int
    like_count: Int
    reply_count: Int
    is_liked: Boolean
    created_at: String
  }

  type TweetLike {
    _id: ObjectId!
    liked_by: User
    tweet: Tweet
    created_at: String
  }

  type UserFollow {
    _id: ObjectId!
    user: User
    user_to_follow: User
  }

  type Query {
    homeTweets: [Tweet]
    tweetsForUser(userId: ID!): [Tweet]
  }

  type ActionResponse {
    message: String
  }

  type Mutation {
    createTweet(body: String, retweeting: ObjectId): Tweet
    updateTweet(id: ObjectId!, body: String): Tweet
    deleteTweet(id: ObjectId!): ActionResponse

    updateProfile(
      name: String
      username: String
      description: String
      link: String
      avatar: String
      cover_photo: String
    ): User

    followUser(userId: ObjectId!): User
    unfollowUser(userId: ObjectId!): User

    likeTweet(tweetId: ObjectId!): Tweet
    unlikeTweet(tweetId: ObjectId!): Tweet
  }
`
