import { useEffect, useState } from 'react'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import SearchLeads  from './components/SearchLeads'
import HowItWorks   from './components/HowItWorks'
import Features     from './components/Features'
import Pricing      from './components/Pricing'
import CallToAction from './components/CallToAction'
import Footer       from './components/Footer'

function PaymentBanner() {
  const params  = new URLSearchParams(window.location.search)
  const status  = params.get('payment')
  const plan    = params.get('plan')
  const [show, setShow] = useState(!!status)

  useEffect(() => {
    if (status) {
      // Clean the URL without reloading
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [status])

  if (!show) return null

  const isSuccess = status === 'success'

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-4 rounded-xl shadow-xl px-6 py-4 flex items-start gap-4 transition-all ${
      isSuccess ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
    }`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
        isSuccess ? 'bg-green-100' : 'bg-amber-100'
      }`}>
        {isSuccess ? (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        ) : (
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${isSuccess ? 'text-green-800' : 'text-amber-800'}`}>
          {isSuccess
            ? `Payment successful${plan === 'monthly' ? ' — welcome to Monthly Unlimited!' : '!'}`
            : 'Payment cancelled'}
        </p>
        <p className={`text-xs mt-0.5 ${isSuccess ? 'text-green-600' : 'text-amber-600'}`}>
          {isSuccess
            ? 'Your leads will be delivered to your inbox shortly. Check your email!'
            : 'No charge was made. You can try again whenever you\'re ready.'}
        </p>
      </div>
      <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 ml-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
      </button>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <PaymentBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SearchLeads />
        <HowItWorks />
        <Features />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
