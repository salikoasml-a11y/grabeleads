const steps = [
  {
    number: '01',
    title: 'Tell Us Your Ideal Customer',
    description:
      'Fill in your target industry, company size, and job titles. The more specific you are, the hotter the leads you receive.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We Find & Verify the Leads',
    description:
      'Our engine scans millions of company profiles, verifies email deliverability, and filters for decision-makers — all in real time.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Leads Land in Your Inbox',
    description:
      'Receive a clean CSV or direct CRM push with name, email, company, title, and LinkedIn URL ready for outreach.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Simple Process</span>
          <h2 className="section-heading">How GrableLeads Works</h2>
          <p className="section-sub">
            From sign-up to sales conversations in three easy steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-brand-100" style={{left:'16.66%', right:'16.66%'}} />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Number bubble */}
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border-2 border-brand-100 shadow-sm flex flex-col items-center justify-center mb-6 group-hover:border-brand-600 group-hover:shadow-md transition-all duration-200">
                <span className="text-brand-600">{step.icon}</span>
                <span className="absolute -top-3 -right-3 w-7 h-7 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
