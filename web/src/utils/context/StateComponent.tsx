"use client"
import React, { ReactNode, useState } from 'react'
import context from "./context"
import { User } from '../types'

export default function StateComponent({children}: {children:ReactNode}) {
    const [user, setUser] = useState<User|null>(null)
  return (
    <context.Provider value={{user, setUser}}>
        {children}
    </context.Provider>
  )
}
