import * as React from 'react'

interface ILoginState {
  username: string
  password: string
}

export default class LoginPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      username: '',
      password: '',
    }
  }

  public render() {
    return (
      <div className="bg-blue-darkest h-full w-full flex justify-center">
        <div className="container mx-auto lg:w-1/3 md:w-1/2 w-full py-8 flex flex-col justify-start items-center">
          <h1 className="font-bold text-xl text-white">Log Into Tweeter</h1>
          <form className="w-full px-6 my-8 flex flex-col">
            <div className="flex flex-col text-white py-4">
              <input
                type="text"
                placeholder={'Username'}
                className="rounded px-2 py-4 shadow-sm text-base outline-none  "
                onChange={e => this.updateForm('username', e.target.value)}
              />
            </div>
            <div className="flex flex-col text-white py-4">
              <input
                type="password"
                placeholder={'Password'}
                className="rounded px-2 py-4 shadow-sm text-base outline-none  "
                onChange={e => this.updateForm('password', e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue rounded-full font-bold text-white py-3 my-6"
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

  private updateForm(key: string, value: any) {
    this.setState((state: ILoginState) => ({
      [key]: value,
    }))
  }
}
