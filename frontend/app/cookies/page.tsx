export const metadata = { title: 'Cookie Policy — Arcus' }

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">

      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Cookie Policy</h1>
        <p className="text-sm text-slate-500">Last updated June 06, 2026</p>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-slate-400 leading-relaxed">

        <p>
          This Cookie Policy explains how <strong className="text-slate-200">Arcus</strong> ("Company," "we," "us," and "our")
          uses cookies and similar technologies to recognize you when you visit our website at{' '}
          <a href="https://arcusapp.io" className="text-blue-400 hover:underline">https://arcusapp.io</a>{' '}
          ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
            as well as to provide reporting information.
          </p>
          <p className="mt-3">
            Cookies set by the website owner (in this case, Arcus) are called "first-party cookies." Cookies set by
            parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party
            features or functionality to be provided on or through the website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Why do we use cookies?</h2>
          <p>
            We use first-party cookies for essential reasons only. These cookies are strictly necessary for our Website
            to operate — specifically to keep you signed in and maintain your session securely. We do not use
            advertising, analytics, or tracking cookies of any kind.
          </p>
          <div className="mt-4 rounded-xl border border-white/8 bg-white/5 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Cookies we use</p>
            <div className="space-y-3">
              {[
                { name: 'arcus_token',           purpose: 'Stores your authentication token to keep you signed in.' },
                { name: 'arcus_refresh_token',   purpose: 'Allows your session to be securely renewed without logging in again.' },
                { name: 'arcus_username',        purpose: 'Stores your display name locally for faster page loads.' },
                { name: 'arcus_user_id',         purpose: 'Stores your user identifier to identify your session.' },
              ].map(c => (
                <div key={c.name} className="flex gap-4">
                  <code className="text-xs text-blue-300 shrink-0 mt-0.5">{c.name}</code>
                  <p className="text-sm text-slate-400">{c.purpose}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-4">
              All items above are stored in browser localStorage, not traditional HTTP cookies.
              They are treated equivalently for the purposes of this policy.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">How can I control cookies?</h2>
          <p>
            Because all cookies and local storage items we use are strictly necessary for authentication,
            they cannot be disabled without preventing you from using the service. You can clear them at any time
            by logging out, which removes all session data from your browser.
          </p>
          <p className="mt-3">
            You may also clear browser storage manually through your browser's developer tools or settings. Note that
            doing so will log you out of Arcus.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">How can I control cookies on my browser?</h2>
          <p>Visit your browser's help documentation to manage storage settings:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            {[
              { label: 'Chrome',           href: 'https://support.google.com/chrome/answer/95647' },
              { label: 'Firefox',          href: 'https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop' },
              { label: 'Safari',           href: 'https://support.apple.com/en-ie/guide/safari/sfri11471/mac' },
              { label: 'Edge',             href: 'https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd' },
              { label: 'Opera',            href: 'https://help.opera.com/en/latest/web-preferences/' },
            ].map(b => (
              <li key={b.label}>
                <a href={b.href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  {b.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Do you serve targeted advertising?</h2>
          <p>
            No. Arcus does not serve targeted advertising and does not share your data with advertising networks.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">How often will you update this Cookie Policy?</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes to the technologies we use or for
            legal or regulatory reasons. The date at the top of this page indicates when it was last updated.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Where can I get further information?</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please email us at{' '}
            <a href="mailto:vepaul@arcusapp.io" className="text-blue-400 hover:underline">vepaul@arcusapp.io</a>.
          </p>
          <p className="mt-2">Arcus · Orlando, FL 32828 · United States</p>
        </section>

      </div>
    </div>
  )
}
