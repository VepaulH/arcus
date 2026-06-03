'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  username: string
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null; requiresConfirmation?: boolean }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: '',
  loading: true,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('arcus_auth')
    if (stored) {
      const parsed = JSON.parse(stored) as { isLoggedIn: boolean; username: string }
      setIsLoggedIn(parsed.isLoggedIn)
      setUsername(parsed.username)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, _password: string): Promise<{ error: string | null }> => {
    const name = email.split('@')[0]
    setIsLoggedIn(true)
    setUsername(name)
    localStorage.setItem('arcus_auth', JSON.stringify({ isLoggedIn: true, username: name }))
    return { error: null }
  }

  const signup = async (email: string, _password: string, name: string): Promise<{ error: string | null }> => {
    const displayName = name || email.split('@')[0]
    setIsLoggedIn(true)
    setUsername(displayName)
    localStorage.setItem('arcus_auth', JSON.stringify({ isLoggedIn: true, username: displayName }))
    return { error: null }
  }

  const logout = async () => {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('arcus_auth')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
