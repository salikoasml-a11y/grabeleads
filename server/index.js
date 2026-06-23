import express from 'express'
import Stripe from 'stripe'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

dotenv.config()

const __dirname      = path.dirname(fileURLToPath(import.meta.url))
const LEADS_FILE     = path.join(__dirname, 'leads.json')
const INVENTORY_FILE = path.join(__dirname, '..', 'data', 'leads-inventory.json')

function getInventory() {
  try { return JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf8')) } catch { return [] }
}

function pickLeads(count) {
  const all = getInventory()
  const shuffled = all.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, all.length))
}
const stripeKey   = process.env.STRIPE_SECRET_KEY
const stripe      = stripeKey && !stripeKey.includes('REPLACE') ? new Stripe(stripeKey) : null
const CLIENT_URL  = process.env.CLIENT_URL  || 'http://localhost:5173'
const ADMIN_KEY   = process.env.ADMIN_KEY   || 'changeme'
const PORT        = process.env.PORT        || 3001

// ─── Lead storage helpers ────────────────────────────────────────────────────

function readLeads() {
  try { return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')) } catch { return [] }
}

function saveLead(lead) {
  const leads = readLeads()
  leads.unshift({ ...lead, id: Date.now(), createdAt: new Date().toISOString() })
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2))
  return leads[0]
}

// ─── Email ───────────────────────────────────────────────────────────────────

const smtpConfigured =
  process.env.SMTP_USER &&
  !process.env.SMTP_USER.includes('REPLACE') &&
  process.env.SMTP_USER !== 'you@gmail.com'

const mailer = smtpConfigured
  ? nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null

async function notifyOwner(lead) {
  if (!mailer) {
    console.log('\n📬 [TEST] Owner notification (no SMTP configured):')
    console.log(`  Lead: ${lead.name} <${lead.email}> @ ${lead.company} — plan: ${lead.plan}`)
    return
  }
  if (!process.env.OWNER_EMAIL) return
  const planLabel = { free: 'Free', 'per-lead': 'Pay Per Lead', monthly: 'Monthly Unlimited' }
  try {
  await mailer.sendMail({
    from:    `"GrableLeads" <${process.env.SMTP_USER}>`,
    to:      process.env.OWNER_EMAIL,
    subject: `New lead: ${lead.name} @ ${lead.company} (${planLabel[lead.plan] ?? lead.plan})`,
    html: `
      <h2 style="color:#2563EB">New GrableLeads submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${lead.name}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold">Company</td><td style="padding:8px">${lead.company}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold">Plan</td><td style="padding:8px">${planLabel[lead.plan] ?? lead.plan}</td></tr>
        ${lead.quantity ? `<tr><td style="padding:8px;font-weight:bold">Leads ordered</td><td style="padding:8px">${lead.quantity}</td></tr>` : ''}
        ${lead.stripeSessionId ? `<tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold">Stripe session</td><td style="padding:8px">${lead.stripeSessionId}</td></tr>` : ''}
      </table>
    `,
  })
  } catch (err) {
    console.warn('Email notification failed (lead was still saved):', err.message)
  }
}

async function sendLeadsToBuyer(buyerEmail, buyerName, leads) {
  if (!mailer) {
    console.log(`\n📦 [TEST] Leads that would be emailed to ${buyerName} <${buyerEmail}>:`)
    leads.forEach((l, i) => console.log(`  ${i + 1}. ${l.name} (${l.title} @ ${l.company}) — ${l.email}`))
    return
  }
  const rows = leads.map((l, i) => `
    <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9fafb'}">
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${l.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${l.title}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${l.company}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb"><a href="mailto:${l.email}" style="color:#2563EB">${l.email}</a></td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb"><a href="https://${l.linkedin}" style="color:#2563EB">View</a></td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${l.industry}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${l.location}</td>
    </tr>`).join('')
  try {
    await mailer.sendMail({
      from:    `"GrableLeads" <${process.env.SMTP_USER}>`,
      to:      buyerEmail,
      subject: `Your ${leads.length} verified lead${leads.length > 1 ? 's are' : ' is'} ready — GrableLeads`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:800px;margin:0 auto;padding:32px 16px">
          <div style="background:#2563EB;border-radius:12px;padding:32px;color:white;margin-bottom:32px;text-align:center">
            <h1 style="margin:0 0 8px;font-size:28px">Your leads are here, ${buyerName.split(' ')[0]}!</h1>
            <p style="margin:0;opacity:0.9;font-size:16px">${leads.length} verified B2B contact${leads.length > 1 ? 's' : ''} — ready to reach out</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
            <thead>
              <tr style="background:#1d4ed8;color:white">
                <th style="padding:12px;text-align:left">Name</th>
                <th style="padding:12px;text-align:left">Title</th>
                <th style="padding:12px;text-align:left">Company</th>
                <th style="padding:12px;text-align:left">Email</th>
                <th style="padding:12px;text-align:left">LinkedIn</th>
                <th style="padding:12px;text-align:left">Industry</th>
                <th style="padding:12px;text-align:left">Location</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div style="margin-top:24px;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#166534">
            <strong>14-Day Money-Back Guarantee</strong> — Not satisfied? Reply to this email within 14 days for a full refund, no questions asked.
          </div>
          <p style="margin-top:24px;color:#6b7280;font-size:12px;text-align:center">
            GrableLeads · All contacts are verified · <a href="mailto:${process.env.OWNER_EMAIL}" style="color:#2563EB">Contact Support</a>
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.warn('Could not send leads to buyer:', err.message)
  }
}

// ─── Express app ─────────────────────────────────────────────────────────────

const app = express()

// Stripe webhook needs raw body — mount before json middleware
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig    = req.headers['stripe-signature']
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = (secret && stripe)
      ? stripe.webhooks.constructEvent(req.body, sig, secret)
      : JSON.parse(req.body)
  } catch (err) {
    console.error('Webhook error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object
    const meta     = session.metadata || {}
    const qty      = parseInt(meta.quantity, 10) || 1
    const buyerName  = meta.name  || session.customer_details?.name  || 'Customer'
    const buyerEmail = meta.email || session.customer_details?.email
    const lead = saveLead({
      name:            buyerName,
      email:           buyerEmail || '—',
      company:         meta.company  || '—',
      plan:            meta.plan     || 'paid',
      quantity:        qty,
      stripeSessionId: session.id,
      amountPaid:      session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : null,
      source:          'stripe',
    })
    await notifyOwner(lead)
    if (buyerEmail) {
      const leadsToSend = meta.plan === 'monthly' ? pickLeads(20) : pickLeads(qty)
      await sendLeadsToBuyer(buyerEmail, buyerName, leadsToSend)
    }
  }

  res.json({ received: true })
})

app.use(cors({ origin: CLIENT_URL }))
app.use(express.json())

// ─── Routes ──────────────────────────────────────────────────────────────────

// Free-tier / hero form lead capture
app.post('/api/leads', async (req, res) => {
  const { name, email, company } = req.body
  if (!name?.trim() || !email?.trim() || !company?.trim()) {
    return res.status(400).json({ error: 'name, email, and company are required.' })
  }
  const lead = saveLead({ name: name.trim(), email: email.trim(), company: company.trim(), plan: 'free', source: 'form' })
  await notifyOwner(lead)
  const leads = pickLeads(5)
  await sendLeadsToBuyer(email.trim(), name.trim(), leads)
  res.json({ ok: true, leads })
})

// Create Stripe checkout session (paid plans)
app.post('/api/create-checkout-session', async (req, res) => {
  const { plan, quantity = 1, name, email, company } = req.body

  if (!['per-lead', 'monthly'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan.' })
  }

  if (!stripe) {
    return res.status(503).json({ error: 'Payments are not configured yet. Please contact support.' })
  }

  try {
    const isMonthly = plan === 'monthly'
    const session   = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: isMonthly ? 'subscription' : 'payment',
      customer_email: email || undefined,
      metadata: { name: name || '', email: email || '', company: company || '', plan, quantity: String(quantity) },
      line_items: [
        isMonthly
          ? {
              price_data: {
                currency: 'usd',
                product_data: { name: 'GrableLeads — Monthly Unlimited', description: 'Unlimited verified B2B leads every month.' },
                unit_amount: 9900,
                recurring: { interval: 'month' },
              },
              quantity: 1,
            }
          : {
              price_data: {
                currency: 'usd',
                product_data: { name: 'GrableLeads — Pay Per Lead', description: 'Verified B2B leads with email, name, company, and LinkedIn URL.' },
                unit_amount: 900,
              },
              quantity: Math.max(1, parseInt(quantity, 10)),
            },
      ],
      success_url: `${CLIENT_URL}/?payment=success&plan=${plan}`,
      cancel_url:  `${CLIENT_URL}/?payment=cancelled`,
      allow_promotion_codes: true,
    })
    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Admin: view all leads
app.get('/api/leads', (req, res) => {
  if (req.query.key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized.' })
  }
  res.json(readLeads())
})

app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`GrableLeads API → http://localhost:${PORT}`))
