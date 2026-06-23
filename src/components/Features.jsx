const features = [
  {
    title: 'Verified Contact Data',
    description:
      'Every email is triple-verified before delivery. Expect less than 2% bounce rate guaranteed, or we replace the leads free.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'Decision-Maker Targeting',
    description:
      'Filter by job title, seniority, department, company size, industry, and geography — reach the people who actually sign checks.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
      </svg>
    ),
    color: 'bg-brand-50 text-brand-600',
  },
  {
    title: 'Instant CRM Integration',
    description:
      'Push leads directly to HubSpot, Salesforce, or Pipedrive in one click. Or download a clean CSV with 10+ enriched data fields.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Real-Time Delivery',
    description:
      'Leads arrive in your inbox or CRM within minutes of your request — no waiting days for a batch export like legacy providers.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'bg-amber-50 text-amber-600',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Why GrableLeads</span>
          <h2 className="section-heading">Everything You Need to Fill Your Pipeline</h2>
          <p className="section-sub">
            We handle the hard part of prospecting so your team spends time selling, not searching.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card group hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Social proof strip */}
        <div className="mt-16 bg-brand-600 rounded-2xl p-8 sm:p-10 text-white text-center">
          <p className="text-2xl sm:text-3xl font-extrabold leading-snug mb-2">
            "GrableLeads cut our prospecting time in half and doubled our reply rate."
          </p>
          <p className="text-brand-200 text-sm font-medium">
            — Sarah K., VP of Sales at TechFlow Inc.
          </p>
        </div>
      </div>
    </section>
  )
}
