'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function AuthForm({ initialMode }: { initialMode: 'login' | 'signup' }) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { login } = useAuth()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const displayName = mode === 'signup' ? name || email.split('@')[0] : email.split('@')[0]
    login(displayName)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="animate-float w-full max-w-md bg-blue-700 rounded-2xl p-8">

        {/* Toggle */}
        <div className="flex rounded-lg bg-blue-800 p-1 mb-8">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-blue-600 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === 'signup'
                ? 'bg-blue-600 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-white mb-2">
          {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
        </h1>
        <p className="text-blue-100 text-sm mb-8">
          {mode === 'login'
            ? 'Log in to access your Arcus workspace.'
            : 'Join Arcus and start building your startup today.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-blue-100 text-sm font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-600 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-blue-100 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-600 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-blue-100 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-600 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-blue-100 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-600 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button type="button" className="text-blue-200 text-xs hover:text-white transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-400 transition-colors"
          >
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-blue-200 text-sm text-center mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-white font-semibold hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  )
}
