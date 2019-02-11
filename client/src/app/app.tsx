import * as React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { PrivateRoute, ReversePrivateRoute } from '../components/AuthRoute'
import LoginPage from '../pages/Login'
import HomeFeed from '../pages/HomeFeed'

import * as Auth from '../services/auth'

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
})

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <PrivateRoute
          exact
          path="/"
          AuthComponent={HomeFeed}
          isLoggedIn={Auth.isLoggedIn()}
        />
        <ReversePrivateRoute
          path="/login"
          MainComponent={LoginPage}
          isLoggedIn={Auth.isLoggedIn()}
        />
      </Switch>
    </Router>
  </ApolloProvider>
)

export default App
