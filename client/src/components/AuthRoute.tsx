import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'

export const ReversePrivateRoute = (rest: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
        !rest.isLoggedIn ? (
          <rest.MainComponent {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

export const PrivateRoute = (rest: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
        rest.isLoggedIn ? (
          <rest.AuthComponent {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}
