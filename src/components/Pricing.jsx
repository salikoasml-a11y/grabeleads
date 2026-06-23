import { useState } from 'react'
import CheckoutModal from './CheckoutModal'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    per: 'forever',
    description: 'Try GrableLeads risk-free with a handful of leads — no card required.',
    cta: 'Get Free Leads',
    features: [
      '5 leads per month',
      'Full contact details',
      'Email verification included',
      'CSV download',
      'Community support',
    ],
    highlight: false,
  },
  {
    id: 'per-lead',
    name: 'Pay Per Lead',
    price: '$9',
    per: 'per lead',
    description: 'Perfect for testing the waters or running targeted micro-campaigns.',
    cta: 'Buy Leads',
    features: [
      'Minimum 1 lead',
      'Full contact details',
      'Email verification included',
      'CSV download',
      'LinkedIn URL included',
      'Email support',
    ],
    highlight: false,
  },
  {
    id: 'monthly',
    name: 'Monthly Unlimited',
    price: '$99',
    per: 'per month',
    description: 'Unlimited leads for high-volume sales teams ready to scale fast.',
    cta: 'Subscribe Now',
    features: [
      'Unlimited leads per month',
      'Priority verification queue',
      'CRM push integrations',
      'Advanced targeting filters',
      'Dedicated account manager',
      'Priority phone & email support',
    ],
    badge: 'Most Popular',
    highlight: true,
  },
]

function PlanCard({ plan }) {
  const [qty, setQty]       = useState(1)
  const [modal, setModal]   = useState(false)

  function handleClick() {
    if (plan.id === 'free') {
      document.getElementById('get-leads')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    setModal(true)
  }

  const isHighlight = plan.highlight

  return (
    <>
    {modal && <CheckoutModal plan={plan.id} quantity={qty} onClose={() => setModal(false)} />}
    <div className={`relative rounded-2xl p-8 flex flex-col ${
      isHighlight
        ? 'bg-brand-600 text-white shadow-2xl ring-2 ring-brand-400'
        : 'bg-white text-gray-900 shadow-sm border border-gray-100'
    }`}>
      {plan.badge && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full shadow">
          {plan.badge}
        </span>
      )}

      <div className="mb-6">
        <h3 className={`text-lg font-bold mb-1 ${isHighlight ? 'text-white' : 'text-gray-900'}`}>
          {plan.name}
        </h3>
        <p className={`text-sm mb-5 ${isHighlight ? 'text-brand-200' : 'text-gray-500'}`}>
          {plan.description}
        </p>
        <div className="flex items-end gap-1">
          <span className={`text-5xl font-extrabold leading-none ${isHighlight ? 'text-white' : 'text-gray-900'}`}>
            {plan.price}
          </span>
          <span className={`text-sm pb-1 ${isHighlight ? 'text-brand-200' : 'text-gray-400'}`}>
            /{plan.per.replace('per ', '')}
          </span>
        </div>

        {/* Quantity picker for Pay Per Lead */}
        {plan.id === 'per-lead' && (
          <div className="mt-5">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Number of leads
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition"
              >−</button>
              <span className="w-8 text-center font-bold text-gray-900">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition"
              >+</button>
              <span className="text-sm text-gray-400 ml-1">
                = <strong className="text-gray-700">${qty * 9}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <svg
              className={`w-5 h-5 flex-shrink-0 ${isHighlight ? 'text-brand-200' : 'text-brand-600'}`}
              fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd" />
            </svg>
            <span className={isHighlight ? 'text-brand-100' : 'text-gray-600'}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 ${
          isHighlight
            ? 'bg-white text-brand-600 hover:bg-brand-50 shadow-md'
            : 'btn-primary'
        }`}
      >
        {plan.cta} →
      </button>
    </div>
    </>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Simple Pricing</span>
          <h2 className="section-heading">Choose How You Want to Grow</h2>
          <p className="section-sub">
            No annual contracts, no setup fees, no hidden costs. Start today and scale at your own pace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(plan => <PlanCard key={plan.id} plan={plan} />)}
        </div>

        {/* Guarantee badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
            <svg className="w-8 h-8 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="text-left">
              <div className="text-sm font-bold text-gray-900">14-Day Money-Back Guarantee</div>
              <div className="text-xs text-gray-500">Not happy within 14 days? Full refund, no questions asked.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
