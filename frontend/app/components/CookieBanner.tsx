'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'arcus_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-slate-400 flex-1 leading-relaxed">
          We use essential cookies to keep you signed in.{' '}
          <Link href="/cookies" className="text-blue-400 hover:underline">
            Cookie Policy
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 text-sm font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
