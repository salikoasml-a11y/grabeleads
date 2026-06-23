import { useState } from 'react'

const INDUSTRIES = [
  'AI/ML','Analytics','Cloud','Consulting','Data','Enterprise',
  'FinTech','Finance','HealthTech','Marketing','Media','Operations','SaaS','Sales','VC/PE'
]

export default function SearchLeads() {
  const [q, setQ]               = useState('')
  const [industry, setIndustry] = useState('')
  const [results, setResults]   = useState(null)
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const params = new URLSearchParams({ q, industry })
      const res    = await fetch(`/api/search?${params}`)
      const data   = await res.json()
      setResults(data.leads)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  const isLocked = (i) => i >= 2

  return (
    <section id="search" className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="section-label">Find Your Leads</span>
          <h2 className="section-heading">Search Our Lead Database</h2>
          <p className="section-sub">Filter by industry or keyword — see who's waiting for your outreach.</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by name, title, company, or location…"
            className="input-field flex-1"
          />
          <select
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">All Industries</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <button type="submit" disabled={loading} className="btn-primary px-6 whitespace-nowrap">
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {/* Results */}
        {results !== null && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700">
                <span className="text-brand-600 text-lg font-extrabold">{total}</span> leads found
              </p>
              {total > 2 && (
                <a href="#get-leads" className="text-sm text-brand-600 font-medium hover:underline">
                  Unlock all {total} leads →
                </a>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Company</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((l, i) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isLocked(i) ? 'select-none' : ''}`}>
                      <td className={`px-4 py-3 font-medium ${isLocked(i) ? 'blur-sm text-gray-400' : 'text-gray-900'}`}>{l.name}</td>
                      <td className={`px-4 py-3 ${isLocked(i) ? 'blur-sm text-gray-400' : 'text-gray-600'}`}>{l.title}</td>
                      <td className={`px-4 py-3 ${isLocked(i) ? 'blur-sm text-gray-400' : 'text-gray-600'}`}>{l.company}</td>
                      <td className={`px-4 py-3 ${isLocked(i) ? 'blur-sm text-gray-400' : 'text-blue-600'}`}>{l.email}</td>
                      <td className={`px-4 py-3 ${isLocked(i) ? 'blur-sm text-gray-400' : 'text-gray-500'}`}>{l.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {total > 2 && (
              <div className="mt-6 text-center bg-brand-50 border border-brand-100 rounded-xl p-6">
                <p className="text-brand-800 font-semibold mb-3">
                  {total - 2} more leads are locked — get them free or buy the full list
                </p>
                <a href="#get-leads" className="btn-primary inline-flex">
                  Unlock All {total} Leads →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
