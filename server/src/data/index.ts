import * as Types from './db'
import { Document } from 'mongoose'

export const getTweetById = async (tweetId: String) => {
  const tweet = await Types.Tweet.findById(tweetId).populate('author')

  return tweet
}

export const getHomeTweets = async (user: any) => {
  // for now, just get a list of tweets ordered by created_at
  // from the users's followers
  // later we can use redis or something that's more efficient for this
  const userFollowerActions = await Types.UserFollow.find({
    user: user._id,
  }).populate('user_to_follow')

  const followerIds = userFollowerActions.map((u: any) => u.user_to_follow._id)

  const tweets = await Types.Tweet.find({
    author: { $in: followerIds },
  }).sort({ created_at: -1 })

  return tweets.map((t: any) => t.toJSON())
}

export const createTweet = async (
  user: any,
  body?: string,
  retweeting?: string
) => {
  const tweet = await Types.Tweet.create({
    body,
    retweeting,
    author: user._id,
  })
  return tweet.toJSON()
}

export const updateTweet = async (user: any, id: string, body: string) => {
  // if the user doesn't own the tweet, throw an error
  const tweet: any = await Types.Tweet.findById(id).populate('author')
  if (tweet.author._id.toJSON() !== user._id.toJSON()) {
    throw new Error(
      `User ${user.username} does not have permission to edit tweet ${id}`
    )
  }
  await Types.Tweet.findOneAndUpdate(tweet._id, { body })
  const response = await Types.Tweet.findById(tweet._id)
  if (response) {
    return response.toJSON()
  } else {
    throw new Error('Updating your tweet was unsuccessful')
  }
}

export const deleteTweet = async (user: any, id: string) => {
  // if the user doesn't own the tweet, throw an error
  const tweet: any = await Types.Tweet.findById(id).populate('author')
  if (!tweet) {
    return { message: 'Tweet does not exist' }
  }
  if (tweet.author._id.toJSON() !== user._id.toJSON()) {
    throw new Error(
      `User ${user.username} does not have permission to edit tweet ${id}`
    )
  }
  // now we can delete the tweet
  await Types.Tweet.deleteOne({ _id: tweet._id })
  return { message: 'Tweet deleted successfully' }
}

export const followUser = async (user: any, userToFollowId: string) => {
  // get both users in the relationship
  const userDoingTheFollowAction: any = await Types.User.findById(user._id)
  const userToFollow: any = await Types.User.findById(userToFollowId)

  // increment the relevent fields on each user
  userDoingTheFollowAction.following_count =
    userDoingTheFollowAction.following_count + 1
  await userDoingTheFollowAction.save()
  userToFollow.followers_count = userToFollow.followers_count + 1
  await userToFollow.save()

  // create a UserFollow object to record the relationship
  await Types.UserFollow.create({
    user: userDoingTheFollowAction._id,
    user_to_follow: userToFollow._id,
  })

  // return user to follow
  const response = <Document>await Types.User.findById(userToFollow._id)
  return response.toJSON()
}

export const unfollowUser = async (user: any, userToUnFollowId: string) => {
  // get both users in the relationship
  const userDoingTheFollowAction: any = await Types.User.findById(user._id)
  const userToUnFollow: any = await Types.User.findById(userToUnFollowId)

  // decrement the relevent fields on each user
  userDoingTheFollowAction.following_count =
    userDoingTheFollowAction.following_count - 1
  await userDoingTheFollowAction.save()
  userToUnFollow.followers_count = userToUnFollow.followers_count - 1
  await userToUnFollow.save()

  // delete the UserFollow object recording the relationship
  await Types.UserFollow.deleteOne({
    user: userDoingTheFollowAction._id,
    user_to_follow: userToUnFollow._id,
  })

  // return user just unfollowed
  const response = <Document>await Types.User.findById(userToUnFollow._id)
  return response.toJSON()
}

export const likeTweet = async (user: any, tweetId: string) => {
  // TODO: ensure on the server-side that you can't re-like a tweet

  // grab the user and the tweet
  const userLiking = <Document>await Types.User.findById(user._id)
  const tweet: any = <Document>await Types.Tweet.findById(tweetId)

  // increment tweet like number
  tweet.like_count = tweet.like_count + 1
  const response = await tweet.save()

  // create tweet like object to record relationship
  await Types.TweetLike.create({
    liked_by: userLiking._id,
    tweet: tweet._id,
    created_at: Date.now(),
  })

  // return the tweet you liked
  return response.json()
}

export const unlikeTweet = async (user: any, tweetId: any) => {
  // TODO: ensure server-side that you can't unlike a tweet that you haven't
  // previously liked

  // grab the user and the tweet
  const userLiking = <Document>await Types.User.findById(user._id)
  const tweet: any = <Document>await Types.Tweet.findById(tweetId)

  // decrement tweet like number
  tweet.like_count = tweet.like_count - 1
  tweet.save()

  // create tweet like object to record relationship
  await Types.TweetLike.deleteOne({
    liked_by: userLiking._id,
    tweet: tweet._id,
  })

  // return the tweet you unliked
  const response = <Document>await Types.Tweet.findById(tweet._id)
  return response.toJSON()
}

export const updateProfile = async (user: any, profile: any) => {
  // naively update profile...it's ok because it's just a test app
  delete profile.password // at least don't let them update their password field lol
  await Types.User.findOneAndUpdate({ _id: user._id }, profile)

  const response = <Document>await Types.User.findById(user._id)
  return response.toJSON()
}
