'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isLoggedIn, username, logout } = useAuth()

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-slate-100 hover:text-blue-400 transition-colors"
        >
          Arcus
        </Link>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/arcus-ai"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                arcus.ai
              </Link>
              <Link
                href="/roadmap"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Roadmap
              </Link>
              <Link
                href="/connect"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Connect
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>

              {/* Profile */}
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-700 rounded-full hover:bg-blue-600 transition-colors"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-100 font-medium">
                  {username}
                </span>
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
                className="px-4 py-2 text-sm font-medium text-blue-400 border border-blue-500 rounded-md hover:bg-blue-950 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
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
