import LeadForm from './LeadForm'

export default function CallToAction() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="section-label">Get Started</span>
        <h2 className="section-heading">Ready to Fill Your Pipeline?</h2>
        <p className="section-sub">
          Join 2,000+ sales teams already using GrableLeads to crush quota every month.
        </p>

        <div className="mt-10 bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
