export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-[#999] mb-8">Last updated: June 2026</p>
        <div className="space-y-6 text-[#ccc] leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Information We Collect</h2>
            <p>We collect information you provide when creating an account (name, email, password), making a payment (processed securely by WiPay — we do not store card details), and using the Stride Club (step session data).</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process payments, send transactional emails (account confirmation, payment receipts), and display your stats on the Stride Club leaderboard.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Data Storage</h2>
            <p>Your data is stored securely using Supabase (PostgreSQL) with row-level security. We do not sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Third-Party Services</h2>
            <p>We use WiPay for payment processing, Resend for transactional email, and Vercel for hosting. Each service has its own privacy policy.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Your Rights</h2>
            <p>You may request deletion of your account and associated data at any time by contacting us at <a href="mailto:support@betterbod.app" className="text-[#c8a96e] hover:underline">support@betterbod.app</a>.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Contact</h2>
            <p>Questions? Email <a href="mailto:support@betterbod.app" className="text-[#c8a96e] hover:underline">support@betterbod.app</a></p>
          </section>
        </div>
      </div>
    </main>
  )
}
