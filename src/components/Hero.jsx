import LeadForm from './LeadForm'

const stats = [
  { value: '12,000+', label: 'Leads Delivered' },
  { value: '94%',     label: 'Verified Contacts' },
  { value: '3×',      label: 'Avg. Pipeline Growth' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 text-white">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-brand-400 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 text-brand-100 border border-white/20 px-3 py-1 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              New leads available daily
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Qualified B2B Leads<br />
              <span className="text-brand-300">Delivered Instantly.</span>
            </h1>

            <p className="mt-6 text-lg text-brand-100 leading-relaxed max-w-lg">
              Stop wasting time cold-prospecting. GrableLeads sends you verified decision-maker contacts so your sales team can focus on closing, not searching.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-brand-200">
              {['No contracts', 'Cancel anytime', '100% verified emails'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap gap-8">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-white">{s.value}</div>
                  <div className="text-sm text-brand-300 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div id="get-leads" className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Start Getting Leads Today</h2>
            <p className="text-sm text-gray-500 mb-6">Fill in the form and get 5 verified leads instantly — no credit card required.</p>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  )
}
