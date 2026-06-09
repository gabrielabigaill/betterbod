export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Cookie Policy</h1>
        <p className="text-[#999] mb-8">Last updated: June 2026</p>
        <div className="space-y-6 text-[#ccc] leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us keep you logged in and remember your preferences.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Essential cookies</strong> — Required for authentication and to keep you signed in. These cannot be disabled.</li>
              <li><strong className="text-white">Preference cookies</strong> — Store your currency preference so prices display correctly.</li>
              <li><strong className="text-white">Analytics cookies</strong> — Minimal, privacy-respecting analytics only. No third-party ad trackers.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling essential cookies will prevent you from signing in to your account.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Contact</h2>
            <p>Questions about cookies? Email us at <a href="mailto:support@betterbod.app" className="text-[#c8a96e] hover:underline">support@betterbod.app</a></p>
          </section>
        </div>
      </div>
    </main>
  )
}
