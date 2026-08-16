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
 *   CONTACT_TO_EMAIL   — where submissions land. Comma-separate to notify
 *                        several people:
 *                          studio@example.com,rohitha@example.com
 *                        A second variable cannot be added for this — env var
 *                        names are unique per environment, so the list lives
 *                        in this one value.
 *   CONTACT_FROM_EMAIL — a sender Resend accepts, e.g.
 *                        "ROAR Architects <onboarding@resend.dev>", or an
 *                        address on a domain verified in Resend.
 */

/* Vercel's Node runtime calls handlers with an (req, res) pair and waits for
 * the response to be written. Returning a web-standard `Response` object
 * instead does nothing: the request hangs until the platform times it out, and
 * the browser sits on "Sending…" forever. These minimal structural types
 * describe just the surface used here, so the contract stays explicit without
 * pulling in @vercel/node purely for two type declarations. */
type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const LIMITS = { name: 120, email: 200, phone: 40, message: 5000 };

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

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  /* One variable, one or many recipients. Splitting here rather than adding a
     CONTACT_TO_EMAIL_2 because env var names are unique per environment —
     there is no second slot to add. Empty entries are dropped so a stray
     trailing comma cannot send Resend a blank address and fail the whole
     delivery. */
  const recipients = (process.env.CONTACT_TO_EMAIL ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || recipients.length === 0 || !from) {
    // Logged for the deploy owner, but never echoed to the browser — which of
    // your env vars are missing is not a visitor's business.
    console.error('contact: missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL');
    res.status(500).json({ error: 'Email is not configured on the server.' });
    return;
  }

  // Vercel parses a JSON body for us, but only when the content-type says so.
  // Anything else arrives as a raw string, and a hand-rolled request may send
  // nothing at all — so all three shapes are handled rather than assumed.
  let body: Record<string, unknown>;
  try {
    body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : ((req.body ?? {}) as Record<string, unknown>);
  } catch {
    res.status(400).json({ error: 'Invalid request body.' });
    return;
  }

  // Honeypot: hidden from real users, irresistible to naive bots. Answer 200 so
  // the bot records a success and does not come back to retry.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    res.status(200).json({ ok: true });
    return;
  }

  const name = singleLine(String(body.name ?? ''));
  const email = singleLine(String(body.email ?? ''));
  const phone = singleLine(String(body.phone ?? ''));
  const message = String(body.message ?? '').trim();

  // Re-checked here and not merely in the markup: the browser's `required`
  // attribute is a convenience for people, not a control — anything can POST
  // this endpoint directly with whatever body it likes.
  if (!name || !email || !phone || !message) {
    res.status(400).json({ error: 'Every field is required.' });
    return;
  }
  if (!looksLikeEmail(email)) {
    res.status(400).json({ error: 'That email address does not look valid.' });
    return;
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    phone.length > LIMITS.phone ||
    message.length > LIMITS.message
  ) {
    res.status(400).json({ error: 'One of those fields is too long.' });
    return;
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
        to: recipients,
        // Hitting reply in the inbox answers the visitor directly.
        reply_to: email,
        subject: `New enquiry — ${name}`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      console.error('contact: resend rejected the send', response.status, await response.text());
      res.status(502).json({ error: 'We could not send your message. Please try again.' });
      return;
    }
  } catch (error) {
    console.error('contact: resend request failed', error);
    res.status(502).json({ error: 'We could not send your message. Please try again.' });
    return;
  }

  res.status(200).json({ ok: true });
}
