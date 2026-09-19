/* Where a visitor came from, remembered for as long as their visit lasts.
 *
 * The enquiry form used to read `window.location.search` at the moment it
 * mounted, which only works for someone who lands on /contactus directly. Anyone
 * who arrives on the home page with a `gclid` and then clicks "Get in Touch" in
 * the nav reaches the form on a clean URL, and their lead was reported as having
 * no source at all — the studio saw an enquiry and the campaign that paid for it
 * saw nothing. So the parameters are captured once, when the site first loads,
 * and read back at submit time from wherever the visitor has wandered to since.
 *
 * sessionStorage rather than localStorage: attribution belongs to this visit. A
 * click paid for in March should not still be claiming credit for an enquiry in
 * June, which is what a persistent store would do.
 */

const STORAGE_KEY = 'roar:attribution';

/* The parameters worth keeping, rather than the whole query string: it also
   carries wouter's own routing noise and anything a visitor pasted in, and the
   server truncates the field at 500 characters — better to spend those on the
   values that identify a campaign than to have them cut off mid-way. */
const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid', // Google Ads
  'wbraid', // Google Ads, web-to-app
  'gbraid',
  'fbclid', // Meta
  'msclkid', // Microsoft Ads
] as const;

type Attribution = Record<string, string>;

const read = (): Attribution | null => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    /* Private mode, blocked storage, or a value something else corrupted. The
       form still sends — without a source, which is what it did before. */
    return null;
  }
};

const write = (value: Attribution) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* As above. Nothing downstream depends on this having worked. */
  }
};

/** Called once as the app starts. Safe to call again — it will not overwrite a
 *  campaign already recorded unless the visitor has arrived on a new one. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const captured: Attribution = {};

  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) captured[key] = value.slice(0, 120);
  }

  const hasCampaign = Object.keys(captured).length > 0;

  /* A visit that already carries a campaign keeps it, unless this load brought a
     new one — someone who clicks a second ad mid-session should be attributed to
     the ad that actually brought them back. Without the guard, every in-site
     navigation would overwrite a real campaign with an empty record. */
  if (!hasCampaign && read()) return;

  /* An internal link is not a referrer worth recording: it would just report the
     site referring itself, and overwrite the real one. */
  const referrer = document.referrer;
  const external = referrer && !referrer.startsWith(window.location.origin);

  write({
    ...captured,
    ...(external ? { referrer: referrer.slice(0, 200) } : {}),
    landing: window.location.pathname.slice(0, 120),
    at: new Date().toISOString(),
  });
}

/** The stored attribution as a query-string-shaped line, which is the form the
 *  lead email and the API already expect. Empty when there is nothing to say. */
export function attributionString(): string {
  if (typeof window === 'undefined') return '';

  const stored = read();
  if (!stored) return '';

  return new URLSearchParams(stored).toString();
}
