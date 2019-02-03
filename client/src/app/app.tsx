import * as React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoginPage from '../pages/Login'

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
})

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
      </Switch>
    </Router>
  </ApolloProvider>
)

export default App
