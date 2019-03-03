import * as React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import PageContainer from '../components/PageContainer'
import * as Auth from '../services/auth'
import * as Nav from '../services/navigation'

const HOME_FEED_QUERY = gql`
  query {
    homeTweets {
      _id
      body
      author {
        _id
        name
        username
      }
    }
  }
`

export default class HomeFeed extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  public render() {
    return (
      <PageContainer>
        <Query query={HOME_FEED_QUERY}>
          {({ loading, error, data }) => {
            if (loading) {
              return 'Loading...'
            }
            if (error) {
              return `Error! ${error.message}`
            }

            return data.homeTweets.map((tweet: any) => (
              <div
                className="border-b-2 border-grey p-3 text-white flex"
                key={tweet._id}
              >
                <div className="w-1/6 flex flex-col justify-start">
                  <div className="bg-grey-light rounded-full w-12 h-12" />
                </div>
                <div className="flex flex-col">
                  <div className="flex pb-2">
                    <a className="font-bold text-white underline">
                      {tweet.author.name}
                    </a>
                    <span className="text-grey-light px-2">
                      {`@${tweet.author.username}`}
                    </span>
                  </div>
                  {tweet.body}
                </div>
              </div>
            ))
          }}
        </Query>
        <div className="py-4 flex w-full justify-center items-center">
          <button
            className="m-3 py-2 px-4 rounded bg-white text-black"
            onClick={this.logout}
          >
            Log Out
          </button>
        </div>
      </PageContainer>
    )
  }

  private logout() {
    Auth.logout()
    Nav.routeTo('/login')
  }
}
