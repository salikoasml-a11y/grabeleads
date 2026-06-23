import { useState } from 'react'

const INITIAL = { name: '', email: '', company: '' }

export default function LeadForm({ dark = false }) {
  const [form, setForm]     = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [leads, setLeads]   = useState([])

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
      const data = await res.json()
      setLeads(data.leads || [])
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

  function downloadCSV() {
    const header = 'Name,Title,Company,Email,LinkedIn,Industry,Location'
    const rows = leads.map(l =>
      [l.name, l.title, l.company, l.email, l.linkedin, l.industry, l.location]
        .map(v => `"${(v || '').replace(/"/g, '""')}"`)
        .join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'grableleads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (status === 'success') {
    return (
      <div className="py-4 space-y-4">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Here are your 5 free leads!</h3>
        </div>
        {leads.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Company</th>
                    <th className="px-3 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-medium text-gray-900">{l.name}</td>
                      <td className="px-3 py-2 text-gray-600">{l.title}</td>
                      <td className="px-3 py-2 text-gray-600">{l.company}</td>
                      <td className="px-3 py-2 text-blue-600">{l.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={downloadCSV}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </button>
          </>
        )}
        <button
          onClick={() => { setForm(INITIAL); setLeads([]); setStatus('idle') }}
          className="text-sm text-brand-600 hover:underline font-medium w-full text-center"
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
