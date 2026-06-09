export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Refund Policy</h1>
        <p className="text-[#999] mb-8">Last updated: June 2026</p>
        <div className="space-y-6 text-[#ccc] leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">7-Day Money-Back Guarantee</h2>
            <p>We offer a full refund within 7 days of your initial subscription purchase if you are not satisfied with BetterBod. To request a refund, email us within 7 days of payment.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Eligibility</h2>
            <p>Refunds apply to first-time purchases only. Renewal payments are non-refundable. Digital products (ebooks, program downloads) are non-refundable once accessed.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">How to Request</h2>
            <p>Email <a href="mailto:support@betterbod.app" className="text-[#c8a96e] hover:underline">support@betterbod.app</a> with your account email and order details. We process refunds within 5–10 business days via the original payment method.</p>
          </section>
          <section>
            <h2 className="text-white text-xl font-semibold mb-2">Cancellations</h2>
            <p>You can cancel your subscription at any time from your account settings. Cancellation stops future charges but does not automatically trigger a refund for the current period.</p>
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
