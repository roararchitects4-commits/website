/**
 * POST /api/lead — emails an enquiry to the studio.
 *
 * The site's only lead endpoint, since /Contactus is now its only form: the home
 * page's Get In Touch section and the `contact.ts` handler behind it are both
 * gone. It takes the three fields needed to call an ad click back and nothing
 * more, because every extra question costs a share of the leads that were paid
 * for.
 *
 * Required environment variables — named for the contact form they were first
 * set up for, and left that way so the page runs on configuration the site
 * already has:
 *   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 *
 * The one thing this handler cannot do is keep a lead. A submission exists only
 * as the mail it sends: if Resend drops it or a filter eats it, nothing here
 * remembers that anyone ever wrote in. A second destination — a sheet, a
 * webhook — is the fix, and it is not implemented.
 */

/* Vercel's Node runtime hands the handler an (req, res) pair and waits for the
 * response to be written — returning a web-standard `Response` leaves the
 * request hanging until the platform times it out. A minimal structural type
 * rather than @vercel/node: describing the surface actually used here beats a
 * dependency for three declarations. */
type Req = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
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

/* ─── Phone ───────────────────────────────────────────────────────────────
 * The same rule the form applies, restated here rather than imported: this
 * file is bundled as a serverless function on its own and does not share a
 * module graph with src/. If one of the two changes, change both — src/lib/phone
 * carries the reasoning for the rule.
 *
 * In short: an Indian number is held to the real shape of one, because that is
 * the traffic this page is bought for and a mistyped local number is the common
 * failure. A number given with any other country code is only checked for a
 * plausible length, since rejecting a genuine overseas enquiry costs far more
 * than accepting the occasional junk one. */
const indianSubscriberDigits = (digits: string): string | null => {
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return null;
};

const isValidPhone = (raw: string): boolean => {
  const value = raw.trim();
  const digits = value.replace(/\D/g, '');
  if (!digits) return false;

  if (value.startsWith('+') && !digits.startsWith('91')) {
    return digits.length >= 8 && digits.length <= 15;
  }

  const subscriber = indianSubscriberDigits(digits);
  return subscriber !== null && /^[6-9]\d{9}$/.test(subscriber);
};

/** Dialable form, for the call and WhatsApp links in the notification email. */
const toE164 = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  const subscriber = indianSubscriberDigits(digits);
  return subscriber ? `91${subscriber}` : digits;
};

/* ─── Throttle ────────────────────────────────────────────────────────────
 * The honeypot stops a bot that fills every field it finds; it does nothing
 * about a script posting straight at this endpoint in a loop, which would burn
 * the Resend quota and bury the real enquiries underneath it.
 *
 * In-process and therefore per-instance: a serverless function is several
 * instances under load, so this is a brake and not a gate. That is the right
 * trade here — a real store would mean provisioning one for a form that takes a
 * handful of submissions a day, and slowing a flood by an order of magnitude is
 * most of the benefit. A warm instance keeps the map between invocations; a cold
 * one starts empty, which is the usual case for a legitimate visitor.
 *
 * The second map is the one that matters day to day: the same number submitted
 * twice inside the window is answered 200 without sending again, so an impatient
 * double-tap does not arrive as two leads the studio calls twice. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const recentByIp = new Map<string, number[]>();
const recentByPhone = new Map<string, number>();

/* Both maps are swept on every request, so an instance that stays warm for days
   does not accumulate an entry per visitor it has ever seen. */
const sweep = (now: number) => {
  for (const [key, times] of recentByIp) {
    const live = times.filter((time) => now - time < WINDOW_MS);
    if (live.length) recentByIp.set(key, live);
    else recentByIp.delete(key);
  }
  for (const [key, time] of recentByPhone) {
    if (now - time >= WINDOW_MS) recentByPhone.delete(key);
  }
};

/** The client's address as Vercel's proxy reports it. The first entry is the
 *  caller; the rest are the hops, which anyone can prepend to. */
const clientIp = (req: Req): string => {
  const header = req.headers?.['x-forwarded-for'];
  const value = Array.isArray(header) ? header[0] : header;
  return value?.split(',')[0]?.trim() || 'unknown';
};

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

  const now = Date.now();
  sweep(now);

  const ip = clientIp(req);
  const attempts = recentByIp.get(ip) ?? [];
  if (attempts.length >= MAX_PER_WINDOW) {
    /* 429 rather than a silent 200: a person who has genuinely sent five
       enquiries in ten minutes should be told why the sixth will not go, and a
       script is not discouraged by being lied to. */
    res.setHeader('Retry-After', String(Math.ceil(WINDOW_MS / 1000)));
    res.status(429).json({ error: 'Too many submissions. Please try again shortly, or call us.' });
    return;
  }
  recentByIp.set(ip, [...attempts, now]);

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
  /* The number is the whole lead — an enquiry nobody can ring back is an ad
     click already paid for and thrown away. */
  if (!isValidPhone(phone)) {
    res.status(400).json({ error: 'Please enter a 10-digit mobile number we can call you back on.' });
    return;
  }

  const dialable = toE164(phone);

  /* Answered as a success, because from the visitor's side it was one: their
     enquiry is already in the studio's inbox. Sending it twice would only have
     them called twice. */
  if (recentByPhone.has(dialable)) {
    res.status(200).json({ ok: true });
    return;
  }

  /* Email is dropped from the table when it was not given, rather than
     printing an empty row. */
  const rows: [string, string][] = [
    ['Name', name],
    ['Phone', phone],
    ...(email ? ([['Email', email]] as [string, string][]) : []),
  ];

  /* The reason these are here rather than left to whoever opens the mail: an
     interiors enquiry is worth several times more answered in minutes than
     answered tomorrow, and the gap between the two is usually nothing more than
     having to copy a number out of an email and into a phone. One tap from the
     notification removes that step on the device the mail is most often read
     on. */
  const callHref = `tel:+${dialable}`;
  const whatsappHref = `https://wa.me/${dialable}?text=${encodeURIComponent(
    `Hi ${name}, thank you for your enquiry with ROAR Architects. When would be a good time to talk about your project?`,
  )}`;

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
      <p style="margin:0 0 18px">
        <a href="${callHref}" style="display:inline-block;background:#A5342C;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 22px;border-radius:999px;margin-right:8px">Call ${escapeHtml(phone)}</a>
        <a href="${whatsappHref}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 22px;border-radius:999px">WhatsApp</a>
      </p>
      <p style="margin:0;font-size:12px;color:#9a938d">Answered within the hour converts several times better than answered tomorrow.</p>
      ${
        source
          ? `<p style="margin:14px 0 0;font-size:12px;color:#9a938d">Source: ${escapeHtml(source)}</p>`
          : ''
      }
    </div>
  `;

  const text = [
    'New consultation request (interiors campaign landing page)',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Call: +${dialable}`,
    `WhatsApp: ${whatsappHref}`,
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

  /* Recorded only now. Marking it before the send would mean a lead lost to a
     Resend outage could not be retried — the second attempt would be waved
     through as a duplicate of one that never arrived. */
  recentByPhone.set(dialable, now);

  res.status(200).json({ ok: true });
}
