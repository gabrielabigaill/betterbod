export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-[#999] mb-8">Last updated: June 2026</p>
        <div className="space-y-6 text-[#ccc] leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Acceptance</h2>
            <p>By using BetterBod you agree to these terms. If you disagree, please do not use the service.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Service Description</h2>
            <p>BetterBod provides fitness programs, nutritional guidance, and a step-tracking community (Stride Club) via a subscription service.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Subscriptions & Payments</h2>
            <p>Subscriptions are billed through WiPay. Plans auto-renew unless cancelled before the renewal date. Prices are displayed in TTD or USD based on your location.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Acceptable Use</h2>
            <p>You agree not to misuse the service, attempt to manipulate leaderboard data, or share your account credentials with others.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Health Disclaimer</h2>
            <p>BetterBod provides general fitness information and is not a substitute for professional medical advice. Consult a healthcare professional before starting any new exercise program.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Limitation of Liability</h2>
            <p>BetterBod is provided "as is." We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
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
