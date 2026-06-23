import { useState } from 'react'

const INITIAL = { name: '', email: '', company: '' }

export default function LeadForm({ dark = false }) {
  const [form, setForm]     = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Full name is required.'
    if (!form.email.trim())   e.email   = 'Work email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.company.trim()) e.company = 'Company name is required.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Server error')
      setStatus('success')
    } catch (err) {
      setErrors({ form: err.message || 'Something went wrong. Please try again.' })
      setStatus('idle')
    }
  }

  function handleChange(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      if (errors[field]) setErrors(errs => { const n = {...errs}; delete n[field]; return n })
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Your leads are on their way!</h3>
        <p className="text-gray-500 text-sm">
          We just sent 5 verified B2B leads to <strong>{form.email}</strong>. Check your inbox now!
        </p>
        <button
          onClick={() => { setForm(INITIAL); setStatus('idle') }}
          className="text-sm text-brand-600 hover:underline font-medium"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field
        label="Full Name"
        id="name"
        type="text"
        placeholder="Jane Smith"
        value={form.name}
        onChange={handleChange('name')}
        error={errors.name}
      />
      <Field
        label="Work Email"
        id="email"
        type="email"
        placeholder="jane@company.com"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
      />
      <Field
        label="Company Name"
        id="company"
        type="text"
        placeholder="Acme Corp"
        value={form.company}
        onChange={handleChange('company')}
        error={errors.company}
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Submitting…
          </>
        ) : 'Get My Leads →'}
      </button>

      {errors.form && (
        <p className="text-center text-xs text-red-500 font-medium">{errors.form}</p>
      )}
      <p className="text-center text-xs text-gray-400 mt-1">
        No credit card required. We respect your privacy.
      </p>
    </form>
  )
}

function Field({ label, id, type, placeholder, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
