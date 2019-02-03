import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'

export const PrivateRouteComponent = (rest: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
        rest.isLoggedIn ? (
          <rest.AuthComponent {...props} />
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
