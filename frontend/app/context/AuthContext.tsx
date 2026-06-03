'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../../lib/api'

interface AuthContextType {
  isLoggedIn: boolean
  username: string
  userId: string
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null; requiresConfirmation?: boolean }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: '',
  userId: '',
  loading: true,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('arcus_token')
    const storedUsername = localStorage.getItem('arcus_username')
    const storedUserId = localStorage.getItem('arcus_user_id')
    if (token) {
      setIsLoggedIn(true)
      setUsername(storedUsername ?? '')
      setUserId(storedUserId ?? '')
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { data, error } = await authApi.login(email, password)
    if (error || !data) return { error: error ?? 'Login failed' }

    localStorage.setItem('arcus_token', data.session.access_token)
    localStorage.setItem('arcus_username', data.username)
    localStorage.setItem('arcus_user_id', data.user.id)
    setIsLoggedIn(true)
    setUsername(data.username)
    setUserId(data.user.id)
    return { error: null }
  }

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error: string | null; requiresConfirmation?: boolean }> => {
    const { data, error } = await authApi.signup(email, password, name)
    if (error || !data) return { error: error ?? 'Signup failed' }

    if (data.session) {
      const displayName = name || email.split('@')[0]
      localStorage.setItem('arcus_token', data.session.access_token)
      localStorage.setItem('arcus_username', displayName)
      localStorage.setItem('arcus_user_id', data.user.id)
      setIsLoggedIn(true)
      setUsername(displayName)
      setUserId(data.user.id)
    }

    return { error: null, requiresConfirmation: data.requiresConfirmation }
  }

  const logout = async () => {
    await authApi.logout()
    localStorage.removeItem('arcus_token')
    localStorage.removeItem('arcus_username')
    localStorage.removeItem('arcus_user_id')
    setIsLoggedIn(false)
    setUsername('')
    setUserId('')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userId, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
