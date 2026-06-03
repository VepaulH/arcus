'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isLoggedIn, username, loading, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/75 backdrop-blur-md border-b border-white/8 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-slate-100 hover:text-blue-300 transition-colors"
        >
          Arcus
        </Link>

        <div className="flex items-center gap-2">
          {loading ? null : isLoggedIn ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors rounded-md hover:bg-white/5">
                Dashboard
              </Link>
              <Link href="/roadmap" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors rounded-md hover:bg-white/5">
                Roadmap
              </Link>
              <Link href="/connect" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors rounded-md hover:bg-white/5">
                Connect
              </Link>
              <div className="w-px h-5 bg-white/10 mx-1" />

              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-200 font-medium">{username}</span>
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup?mode=login"
                className="px-4 py-2 text-sm font-medium text-slate-300 border border-white/15 rounded-md hover:bg-white/5 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
