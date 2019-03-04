import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { RetryLink } from 'apollo-link-retry'

import * as Storage from './storage'
import * as AuthService from '../services/auth'
import { ServerError } from 'apollo-link-http-common'

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Storage.getItem(Storage.AUTH_TOKEN_KEY)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  }
})

const refreshToken = onError(({ networkError }) => {
  const error = <ServerError>networkError
  if (error && error.response.status === 400) {
    // refresh the token
    const refreshToken = Storage.getItem(Storage.REFRESH_TOKEN_KEY)
    if (refreshToken) {
      AuthService.refreshToken(refreshToken).then(json => {
        if (json.token) {
          AuthService.store(json.token)
        }
      })
    }
  }
})

const retryLink = new RetryLink()

const authFlowLink = retryLink.concat(authLink).concat(refreshToken)

export default new ApolloClient({
  link: authFlowLink.concat(httpLink),
  cache: new InMemoryCache(),
})
