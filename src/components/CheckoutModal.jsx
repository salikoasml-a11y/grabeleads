import { useState, useEffect } from 'react'

const INITIAL = { name: '', email: '', company: '' }

export default function CheckoutModal({ plan, quantity, onClose }) {
  const [form, setForm]     = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // close on Escape
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required.'
    if (!form.email.trim())   e.email   = 'Required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.company.trim()) e.company = 'Required.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, quantity, ...form }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else throw new Error(data.error || 'Could not create checkout session.')
    } catch (err) {
      setErrors({ form: err.message })
      setLoading(false)
    }
  }

  const planLabel = plan === 'monthly' ? 'Monthly Unlimited — $99/mo' : `Pay Per Lead — $${quantity * 9} (${quantity} lead${quantity > 1 ? 's' : ''})`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Almost there!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tell us who you are, then you'll be taken to secure checkout.
          </p>
          <div className="mt-3 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 text-xs font-semibold text-brand-700">
            {planLabel}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {[
            { id: 'name',    label: 'Full Name',    type: 'text',  placeholder: 'Jane Smith' },
            { id: 'email',   label: 'Work Email',   type: 'email', placeholder: 'jane@company.com' },
            { id: 'company', label: 'Company Name', type: 'text',  placeholder: 'Acme Corp' },
          ].map(f => (
            <div key={f.id}>
              <label htmlFor={`modal-${f.id}`} className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                id={`modal-${f.id}`}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.id]}
                onChange={e => {
                  setForm(p => ({ ...p, [f.id]: e.target.value }))
                  if (errors[f.id]) setErrors(p => { const n={...p}; delete n[f.id]; return n })
                }}
                className={`input-field ${errors[f.id] ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors[f.id] && <p className="mt-1 text-xs text-red-500">{errors[f.id]}</p>}
            </div>
          ))}

          {errors.form && <p className="text-xs text-red-500 text-center font-medium">{errors.form}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Redirecting to Stripe…
              </span>
            ) : 'Continue to Payment →'}
          </button>

          <p className="text-center text-xs text-gray-400">
            Secured by Stripe · No data stored on our servers
          </p>
        </form>
      </div>
    </div>
  )
}
