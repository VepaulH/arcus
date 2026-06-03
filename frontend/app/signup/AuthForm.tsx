'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/8 transition-all w-full'

const labelClass = 'text-xs font-semibold text-slate-500 uppercase tracking-wider'

export default function AuthForm({ initialMode }: { initialMode: 'login' | 'signup' }) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { isLoggedIn, login, signup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) router.replace('/')
  }, [isLoggedIn, router])

  function switchMode(next: 'login' | 'signup') {
    setMode(next)
    setError(null)
    setInfo(null)
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    if (mode === 'login') {
      const { error } = await login(email, password)
      if (error) {
        setError(error)
      } else {
        router.push('/dashboard')
      }
    } else {
      const { error, requiresConfirmation } = await signup(email, password, name)
      if (error) {
        setError(error)
      } else if (requiresConfirmation) {
        setInfo('Account created! Check your email to confirm before logging in.')
      } else {
        router.push('/dashboard')
      }
    }

    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-8">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-blue-300 uppercase border border-blue-400/20 rounded-full bg-blue-400/5">
            {mode === 'login' ? 'Welcome back' : 'Get started'}
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent mb-1 text-center">
          {mode === 'login' ? 'Log in to Arcus.' : 'Create your account.'}
        </h1>
        <p className="text-slate-500 text-sm text-center mb-8">
          {mode === 'login'
            ? 'Access your workspace and continue building.'
            : 'Join Arcus and start building your startup today.'}
        </p>

        {/* Toggle */}
        <div className="flex rounded-lg bg-white/5 border border-white/8 p-1 mb-8">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error / info banners */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-400/20 text-sm text-red-300">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-400/20 text-sm text-blue-300">
            {info}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Full Name</label>
              <input type="text" placeholder="Jane Smith" value={name}
                onChange={e => setName(e.target.value)} className={inputClass} />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Email</label>
            <input type="email" placeholder="you@university.edu" value={email}
              onChange={e => setEmail(e.target.value)} required className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Password</label>
              {mode === 'login' && (
                <button type="button" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  Forgot password?
                </button>
              )}
            </div>
            <input type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} required className={inputClass} />
          </div>

          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Confirm Password</label>
              <input type="password" placeholder="••••••••" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? (mode === 'login' ? 'Logging in…' : 'Creating account…')
              : (mode === 'login' ? 'Log In' : 'Create Account')}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-slate-600 text-sm text-center mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
            className="text-slate-300 font-semibold hover:text-white transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>

      </div>
    </div>
  )
}
