/**
 * POST /api/lead — emails a campaign landing-page enquiry to the studio.
 *
 * Sibling of `contact.ts` rather than a branch inside it. The two collect
 * different things: the contact form is a free-text enquiry, while this one
 * takes the three fields needed to call an ad click back — nothing more, since
 * every extra question costs a share of the leads that were paid for. Folding
 * both into one handler would have meant a validator that required a field for
 * one caller and ignored it for the other, and a subject line that guessed
 * which it was looking at. They share the same Resend credentials and env vars.
 *
 * Required environment variables — identical to contact.ts, deliberately, so
 * the landing page starts working off the configuration the site already has:
 *   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 *
 * The subject is prefixed so these can be filtered and attributed in the inbox:
 * a lead that cost ad spend is worth answering ahead of a general enquiry.
 */

/* Vercel's Node runtime hands the handler an (req, res) pair and waits for the
 * response to be written — returning a web-standard `Response` leaves the
 * request hanging until the platform times it out. Same minimal structural
 * types as contact.ts, for the same reason: describing the surface actually
 * used here beats a dependency on @vercel/node for two declarations. */
type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const LIMITS = { name: 120, email: 200, phone: 40 };

/** Deliberately loose — a real address rejected by a strict pattern costs the
 *  studio a paid lead, which is far worse than the occasional junk one. */
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Submitted values land in an HTML email body, so anything typed by a
 *  stranger is neutralised before it gets there. */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Header-injection guard: a newline in a value that reaches a mail header
 *  (`reply_to`, `subject`) lets a submitter append headers of their own. */
const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipients = (process.env.CONTACT_TO_EMAIL ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || recipients.length === 0 || !from) {
    // Logged for the deploy owner, never echoed to the browser — which env var
    // is missing is not a visitor's business.
    console.error('lead: missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL');
    res.status(500).json({ error: 'Email is not configured on the server.' });
    return;
  }

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
  // the bot books a success and does not come back to retry.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    res.status(200).json({ ok: true });
    return;
  }

  const name = singleLine(String(body.name ?? ''));
  const email = singleLine(String(body.email ?? ''));
  const phone = singleLine(String(body.phone ?? ''));

  /* Where the click came from. Passed through from the landing page's query
     string so a lead can be attributed to the campaign that paid for it — the
     studio otherwise has an inbox of enquiries and no idea which ad worked. */
  const source = singleLine(String(body.source ?? '')).slice(0, 500);

  // Re-checked here and not merely in the markup: `required` is a convenience
  // for people, not a control — anything can POST this endpoint directly.
  // Email is optional: the phone number is what the studio actually calls back
  // on, and demanding an address as well only costs leads.
  if (!name || !phone) {
    res.status(400).json({ error: 'Name and phone are required.' });
    return;
  }
  // Only checked when one was given, so an empty field is not an error.
  if (email && !looksLikeEmail(email)) {
    res.status(400).json({ error: 'That email address does not look valid.' });
    return;
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || phone.length > LIMITS.phone) {
    res.status(400).json({ error: 'One of those fields is too long.' });
    return;
  }

  /* Email is dropped from the table when it was not given, rather than
     printing an empty row. */
  const rows: [string, string][] = [
    ['Name', name],
    ['Phone', phone],
    ...(email ? ([['Email', email]] as [string, string][]) : []),
  ];

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:#2a2420;line-height:1.6">
      <h2 style="font-weight:600;margin:0 0 4px">New consultation request</h2>
      <p style="margin:0 0 18px;font-size:13px;color:#6b625c">From the interiors campaign landing page</p>
      <table style="border-collapse:collapse;margin:0 0 18px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 18px 4px 0;color:#6b625c;vertical-align:top">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`,
          )
          .join('')}
      </table>
      ${
        source
          ? `<p style="margin:18px 0 0;font-size:12px;color:#9a938d">Source: ${escapeHtml(source)}</p>`
          : ''
      }
    </div>
  `;

  const text = [
    'New consultation request (interiors campaign landing page)',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(source ? ['', `Source: ${source}`] : []),
  ].join('\n');

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
        /* Hitting reply in the inbox answers the lead directly — but only
           when an address was given. Passing an empty reply_to would have
           Resend reject the whole send. */
        ...(email ? { reply_to: email } : {}),
        subject: `New lead — ${name}`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      console.error('lead: resend rejected the send', response.status, await response.text());
      res.status(502).json({ error: 'We could not send your request. Please try again.' });
      return;
    }
  } catch (error) {
    console.error('lead: resend request failed', error);
    res.status(502).json({ error: 'We could not send your request. Please try again.' });
    return;
  }

  res.status(200).json({ ok: true });
}
