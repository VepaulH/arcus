'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  username: string
  login: (username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: '',
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('arcus_auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      setIsLoggedIn(parsed.isLoggedIn)
      setUsername(parsed.username)
    }
  }, [])

  const login = (name: string) => {
    setIsLoggedIn(true)
    setUsername(name)
    localStorage.setItem('arcus_auth', JSON.stringify({ isLoggedIn: true, username: name }))
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('arcus_auth')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
