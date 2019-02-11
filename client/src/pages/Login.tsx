import * as React from 'react'
import * as Auth from '../services/auth'
import * as Nav from '../services/navigation'

interface ILoginState {
  username: string
  password: string
  errorMessage: string
}

export default class LoginPage extends React.Component<any, ILoginState> {
  constructor(props: any) {
    super(props)

    this.state = {
      username: '',
      password: '',
      errorMessage: '',
    }

    this.sendLoginForm = this.sendLoginForm.bind(this)
  }

  public render() {
    return (
      <div className="bg-blue-darkest h-full w-full flex justify-center">
        <div className="container mx-auto lg:w-1/3 md:w-1/2 w-full py-8 flex flex-col justify-start items-center">
          <h1 className="font-bold text-xl text-white">Log Into Tweeter</h1>
          <form className="w-full px-6 my-8 flex flex-col">
            {this.state.errorMessage.length ? (
              <div className="p-3 bg-red-darkest rounded shadow-sm text-grey-light text-sm font-bold">
                {this.state.errorMessage}
              </div>
            ) : null}
            <div className="flex flex-col text-white py-4">
              <input
                type="text"
                autoFocus
                placeholder={'Username'}
                className="rounded p-4 shadow-sm text-base outline-none  "
                onChange={e => this.updateForm('username', e.target.value)}
              />
            </div>
            <div className="flex flex-col text-white py-4">
              <input
                type="password"
                placeholder={'Password'}
                className="rounded p-4 shadow-sm text-base outline-none  "
                onChange={e => this.updateForm('password', e.target.value)}
              />
            </div>
            <button
              type="submit"
              onClick={this.sendLoginForm}
              className="bg-blue rounded-full font-bold text-white py-3 my-6 focus:outline-none hover:bg-blue-dark"
            >
              Login
            </button>
          </form>
          <div className="flex">
            <a className="underline-none text-blue text-sm px-2">
              Forgot Password?
            </a>
            <span className="text-center text-white text-xs">•</span>
            <a className="underline-none text-blue text-sm px-2">
              Register for Tweeter
            </a>
          </div>
        </div>
      </div>
    )
  }

  private async sendLoginForm(e: any) {
    e.preventDefault()
    const { username, password } = this.state
    const json = await Auth.login(username, password)
    if (json.auth) {
      // log the user in
      this.setState(state => ({ ...state, errorMessage: '' }))
      await Auth.store(json.token!, json.refreshToken!)
      // route them
      Nav.routeTo('/')
    } else {
      this.setState(state => ({
        ...state,
        errorMessage: json.message!,
      }))
    }
  }

  private updateForm(key: string, value: any) {
    this.setState(state => ({
      ...state,
      [key]: value,
    }))
  }
}
