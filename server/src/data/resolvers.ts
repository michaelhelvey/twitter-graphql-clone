import ObjectId from './ObjectIdType'
import {
  createTweet,
  updateTweet,
  deleteTweet,
  followUser,
  unfollowUser,
  likeTweet,
  unlikeTweet,
  updateProfile,
  getHomeTweets,
} from '../data'

export default {
  ObjectId,
  Query: {
    homeTweets: async (_: any, args: any, context: any) =>
      getHomeTweets(context.user),
    tweetsForUser: () => [],
  },
  Mutation: {
    createTweet: async (_: any, args: any, context: any) =>
      createTweet(context.user, args.body, args.retweeting),
    updateTweet: async (_: any, args: any, context: any) =>
      updateTweet(context.user, args.id, args.body),
    deleteTweet: async (_: any, args: any, context: any) =>
      deleteTweet(context.user, args.id),

    followUser: async (_: any, args: any, context: any) =>
      followUser(context.user, args.userId),
    unfollowUser: async (_: any, args: any, context: any) =>
      unfollowUser(context.user, args.userId),

    likeTweet: async (_: any, args: any, context: any) =>
      likeTweet(context.user, args.tweetId),
    unlikeTweet: async (_: any, args: any, context: any) =>
      unlikeTweet(context.user, args.tweetId),

    updateProfile: async (_: any, args: any, context: any) =>
      updateProfile(context.user, args),
  },
}
