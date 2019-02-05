import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import cors from 'cors'
import typeDefs from './schema'
import resolvers from './data/resolvers'
import { getUserFromToken } from './auth'
import authRoutes from './auth/routes'

require('dotenv').config()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (context: any) => {
    const req = context.req
    // get the user token from the headers
    const token = req.get('Authorization') || ''

    // get user from jwt
    try {
      const user = await getUserFromToken(token)
      // add the user to the context
      return { user }
    } catch (e) {
      // throw an error from our graphql server if there isn't a user.
      // this should never happen if our middleware is working correctly in the rest
      // of the app, but it's good to not make too many demands on the rest
      // of the system.
      throw new Error('Unauthorized')
    }
  },
})

const app = express()

const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: function(origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

app.use(cors(corsOptions))
app.use(express.json())

server.applyMiddleware({ app })

// register REST routes for managing users and auth tokens
// since we manage authorization outside of GraphQL
app.use('/auth', authRoutes)

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(
    `🚀  Server ready at http://localhost:${port}${server.graphqlPath}`
  )
})
