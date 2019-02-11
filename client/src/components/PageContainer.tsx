import * as React from 'react'

interface IWithChildren {
  children: any[]
}

export default ({ children }: IWithChildren) => (
  <div className="bg-blue-darkest w-full h-full text-white">
    <div className="container mx-auto">{children}</div>
  </div>
)
