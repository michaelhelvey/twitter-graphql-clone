import * as React from 'react'
import PageContainer from '../components/PageContainer'
import * as Auth from '../services/auth'
import * as Nav from '../services/navigation'

export default class HomeFeed extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  public render() {
    return (
      <PageContainer>
        <div>Home Feed</div>
        <button
          className="m-3 py-2 px-4 rounded bg-white text-black"
          onClick={this.logout}
        >
          Log Out
        </button>
      </PageContainer>
    )
  }

  private logout() {
    Auth.logout()
    Nav.routeTo('/login')
  }
}
