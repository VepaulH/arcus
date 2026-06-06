export const metadata = { title: 'Privacy Policy — Arcus' }

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">

      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated June 06, 2026</p>
      </div>

      <div className="space-y-10 text-sm">

        <p className="text-slate-400 leading-relaxed">
          This Privacy Notice for <strong className="text-slate-200">Arcus</strong> ("we," "us," or "our") describes how and why we might access, collect, store, use, and/or share your personal information when you use our services, including when you visit{' '}
          <a href="https://arcusapp.io" className="text-blue-400 hover:underline">https://arcusapp.io</a> or use the Arcus platform — a platform for student founders to network and receive guidance along their entrepreneurial journey.
        </p>
        <p className="text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Questions or concerns?</strong> Contact us at{' '}
          <a href="mailto:vepaul@arcusapp.io" className="text-blue-400 hover:underline">vepaul@arcusapp.io</a>.
        </p>

        {/* TOC */}
        <div className="rounded-xl border border-white/8 bg-white/5 p-6 space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Table of Contents</p>
          {[
            ['#infocollect',    '1. What information do we collect?'],
            ['#infouse',        '2. How do we process your information?'],
            ['#legalbases',     '3. What legal bases do we rely on?'],
            ['#whoshare',       '4. When and with whom do we share your information?'],
            ['#cookies',        '5. Do we use cookies and other tracking technologies?'],
            ['#ai',             '6. Do we offer AI-based products?'],
            ['#intltransfers',  '7. Is your information transferred internationally?'],
            ['#inforetain',     '8. How long do we keep your information?'],
            ['#infosafe',       '9. How do we keep your information safe?'],
            ['#infominors',     '10. Do we collect information from minors?'],
            ['#privacyrights',  '11. What are your privacy rights?'],
            ['#DNT',            '12. Controls for Do-Not-Track features'],
            ['#uslaws',         '13. Do United States residents have specific privacy rights?'],
            ['#policyupdates',  '14. Do we make updates to this notice?'],
            ['#contact',        '15. How can you contact us?'],
            ['#request',        '16. How can you review, update, or delete your data?'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="block text-blue-400 hover:underline text-sm">{label}</a>
          ))}
        </div>

        <Section id="infocollect" title="1. What information do we collect?">
          <p><strong className="text-slate-300">Personal information you provide.</strong> We collect personal information you voluntarily provide when you register, including:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {['Name', 'Email address', 'Username', 'Password (stored encrypted)', 'University / institution', 'Bio and profile information', 'Startup stage, skills, and experience'].map(i => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p><strong className="text-slate-300">Sensitive information.</strong> We may process student data as necessary for the Services.</p>
          <p><strong className="text-slate-300">Information automatically collected.</strong> When you visit our Services, we automatically collect certain technical information such as your IP address, browser type, device characteristics, and usage data. This is used to maintain the security and operation of our Services.</p>
          <p>We also collect information through essential browser storage (localStorage) for authentication purposes. See our <a href="/cookies" className="text-blue-400 hover:underline">Cookie Policy</a> for details.</p>
        </Section>

        <Section id="infouse" title="2. How do we process your information?">
          <p>We process your information to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Create and manage your account</li>
            <li>Provide and improve the platform (profile matching, roadmap generation, goal tracking)</li>
            <li>Enable connections between founders</li>
            <li>Maintain security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section id="legalbases" title="3. What legal bases do we rely on?">
          <p>We only process your information when we have a valid legal reason to do so under applicable law, including:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-slate-300">Consent</strong> — when you have given us permission</li>
            <li><strong className="text-slate-300">Contract performance</strong> — to provide the services you signed up for</li>
            <li><strong className="text-slate-300">Legitimate interests</strong> — to improve and secure the platform</li>
            <li><strong className="text-slate-300">Legal obligations</strong> — to comply with applicable laws</li>
          </ul>
        </Section>

        <Section id="whoshare" title="4. When and with whom do we share your information?">
          <p>We do not sell your personal information. We may share information in the following situations:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-slate-300">Service providers</strong> — Supabase (database and authentication), Railway (backend hosting), Vercel (frontend hosting)</li>
            <li><strong className="text-slate-300">Other users</strong> — your public profile (name, bio, skills, position, university) is visible to other Arcus users in the Connect section</li>
            <li><strong className="text-slate-300">Legal requirements</strong> — if required by law or to protect rights and safety</li>
          </ul>
        </Section>

        <Section id="cookies" title="5. Do we use cookies and other tracking technologies?">
          <p>We use essential browser localStorage to keep you signed in. We do not use advertising or analytics tracking cookies. See our <a href="/cookies" className="text-blue-400 hover:underline">Cookie Policy</a> for full details.</p>
        </Section>

        <Section id="ai" title="6. Do we offer AI-based products?">
          <p>The Arcus platform includes an AI guidance feature (Arcus AI). Current AI responses are generated from curated content rather than a third-party AI API. If this changes, this policy will be updated accordingly.</p>
        </Section>

        <Section id="intltransfers" title="7. Is your information transferred internationally?">
          <p>Our servers are based in the United States. If you are accessing Arcus from outside the US, your information will be transferred to and processed in the United States. By using the Services, you consent to this transfer.</p>
        </Section>

        <Section id="inforetain" title="8. How long do we keep your information?">
          <p>We retain your personal information for as long as your account is active. When you delete your account, all associated data — including your profile, roadmap progress, weekly goals, and connections — is permanently deleted. We may retain certain information as required by law.</p>
        </Section>

        <Section id="infosafe" title="9. How do we keep your information safe?">
          <p>We implement technical and organisational security measures including encrypted authentication tokens, Row Level Security (RLS) on all database tables, HTTPS-only communication, and secure server-side key management. However, no system is 100% secure and we cannot guarantee absolute security.</p>
        </Section>

        <Section id="infominors" title="10. Do we collect information from minors?">
          <p>We do not knowingly collect data from children under 13. If you become aware that a child has provided us with personal information, please contact us at <a href="mailto:vepaul@arcusapp.io" className="text-blue-400 hover:underline">vepaul@arcusapp.io</a>.</p>
        </Section>

        <Section id="privacyrights" title="11. What are your privacy rights?">
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (via Settings → Delete Account)</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:vepaul@arcusapp.io" className="text-blue-400 hover:underline">vepaul@arcusapp.io</a>.</p>
        </Section>

        <Section id="DNT" title="12. Controls for Do-Not-Track features">
          <p>Most browsers include a Do-Not-Track ("DNT") feature. Because there is no uniform standard for DNT signals, we do not currently respond to them. We do not use cross-site tracking, so this has no practical impact on your experience with Arcus.</p>
        </Section>

        <Section id="uslaws" title="13. Do United States residents have specific privacy rights?">
          <p>If you are a California, Virginia, Colorado, Connecticut, or other US state resident, you may have additional rights under applicable state privacy laws (including CCPA/CPRA). These include the right to know what data we collect, the right to delete, and the right to opt out of the sale of personal information (we do not sell personal information). To submit a request, contact <a href="mailto:vepaul@arcusapp.io" className="text-blue-400 hover:underline">vepaul@arcusapp.io</a>.</p>
        </Section>

        <Section id="policyupdates" title="14. Do we make updates to this notice?">
          <p>We may update this Privacy Notice from time to time. The updated version will be indicated by a revised date at the top of this page. We encourage you to review this notice periodically.</p>
        </Section>

        <Section id="contact" title="15. How can you contact us?">
          <p>If you have questions or comments about this notice, contact us at:</p>
          <div className="rounded-xl border border-white/8 bg-white/5 p-5 space-y-1">
            <p className="text-slate-200 font-medium">Arcus</p>
            <p>Orlando, FL 32828</p>
            <p>United States</p>
            <a href="mailto:vepaul@arcusapp.io" className="text-blue-400 hover:underline">vepaul@arcusapp.io</a>
          </div>
        </Section>

        <Section id="request" title="16. How can you review, update, or delete the data we collect from you?">
          <p>You can review and update your profile information at any time from the <a href="/profile" className="text-blue-400 hover:underline">Profile</a> page. To permanently delete your account and all associated data, go to <strong className="text-slate-300">Profile → Danger Zone → Delete account</strong>.</p>
          <p>For additional data requests, email <a href="mailto:vepaul@arcusapp.io" className="text-blue-400 hover:underline">vepaul@arcusapp.io</a>.</p>
        </Section>

      </div>
    </div>
  )
}
