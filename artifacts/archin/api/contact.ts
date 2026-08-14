/**
 * POST /api/contact — emails a contact-form submission to the studio.
 *
 * Runs as a Vercel Serverless Function inside this same project, so it ships
 * with the frontend deploy; there is no separate server to host.
 *
 * Mail goes out through Resend's HTTP API over plain `fetch` rather than an SDK
 * — one less dependency to install, audit, and keep current for a single POST.
 *
 * Required environment variables (set in Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY     — from resend.com/api-keys
 *   CONTACT_TO_EMAIL   — where submissions land
 *   CONTACT_FROM_EMAIL — a sender on a domain verified in Resend,
 *                        e.g. "Roar Architects <website@roararchitects.com>"
 */

export const config = { runtime: 'nodejs' };

type Submission = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const LIMITS = { name: 120, email: 200, phone: 40, message: 5000 };

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

/** Deliberately loose. Real addresses that a strict pattern rejects are a far
 *  worse outcome than the odd junk one, which the studio can simply ignore. */
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Submitted values land inside an HTML email body, so anything a user typed
 *  has to be neutralised before it gets there. */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Header injection guard: a newline in a value that reaches a mail header
 *  (`reply_to`, `subject`) lets a submitter append headers of their own. */
const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Logged for the deploy owner, but never echoed to the browser — which of
    // your env vars are missing is not a visitor's business.
    console.error('contact: missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL');
    return json({ error: 'Email is not configured on the server.' }, 500);
  }

  let body: Partial<Submission> & { company?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Honeypot: hidden from real users, irresistible to naive bots. Answer 200 so
  // the bot records a success and does not come back to retry.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return json({ ok: true }, 200);
  }

  const name = singleLine(String(body.name ?? ''));
  const email = singleLine(String(body.email ?? ''));
  const phone = singleLine(String(body.phone ?? ''));
  const message = String(body.message ?? '').trim();

  // Re-checked here and not merely in the markup: the browser's `required`
  // attribute is a convenience for people, not a control — anything can POST
  // this endpoint directly with whatever body it likes.
  if (!name || !email || !phone || !message) {
    return json({ error: 'Every field is required.' }, 400);
  }
  if (!looksLikeEmail(email)) {
    return json({ error: 'That email address does not look valid.' }, 400);
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    phone.length > LIMITS.phone ||
    message.length > LIMITS.message
  ) {
    return json({ error: 'One of those fields is too long.' }, 400);
  }

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:#2a2420;line-height:1.6">
      <h2 style="font-weight:600;margin:0 0 18px">New enquiry from the website</h2>
      <p style="margin:0 0 6px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 6px"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 18px"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:0 0 6px"><strong>Message</strong></p>
      <div style="white-space:pre-wrap;padding:14px 16px;background:#faf8f5;border-left:3px solid #A5342C;border-radius:6px">${escapeHtml(message)}</div>
    </div>
  `;

  const text = `New enquiry from the website

Name:  ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        // Hitting reply in the inbox answers the visitor directly.
        reply_to: email,
        subject: `New enquiry — ${name}`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      console.error('contact: resend rejected the send', response.status, await response.text());
      return json({ error: 'We could not send your message. Please try again.' }, 502);
    }
  } catch (error) {
    console.error('contact: resend request failed', error);
    return json({ error: 'We could not send your message. Please try again.' }, 502);
  }

  return json({ ok: true }, 200);
}
