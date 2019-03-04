import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import express from 'express'
import cors from 'cors'
import typeDefs from './schema'
import resolvers from './data/resolvers'
import { getUserFromToken } from './auth'
import authRoutes from './auth/routes'

require('dotenv').config()

const throwUnauthorized = () => {
  throw new AuthenticationError('Unauthorized')
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (context: any) => {
    const req = context.req
    // get the user token from the headers
    const token = req.get('Authorization') || ''
    if (!token) {
      return throwUnauthorized()
    }

    // get user from jwt
    try {
      const user = await getUserFromToken(token)
      // add the user to the context
      return { user }
    } catch (e) {
      // if there isn't a user, they shouldn't be able to access the graphql
      // api at all.
      return throwUnauthorized()
    }
  },
})

const app = express()

const whitelist = ['http://localhost:3000', 'http://localhost:5000']
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
