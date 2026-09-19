/* Is this a number the studio can actually call back?
 *
 * The field used to accept anything with at least one digit in it, on both the
 * form and the API, so "1" was a valid enquiry. On a page fed by paid clicks
 * that is not a harmless lapse: a lead with an uncallable number has already
 * cost the ad spend, and it sits in the inbox looking exactly like a real one.
 *
 * The rule is deliberately split rather than applied uniformly. An Indian
 * number is held to the real shape of one — ten digits opening 6 to 9 — because
 * that is the traffic this page is bought for and a mistyped local number is the
 * common failure. Anything given with another country code is only checked for a
 * plausible length, since the studio works in several countries and a rule
 * written for one of them would reject the NRI enquiries outright. Rejecting a
 * real lead is far more expensive than accepting a junk one.
 */

/** Digits only, with a leading + preserved — the shape the input keeps. */
export const normalisePhone = (raw: string): string => {
  const plus = raw.trimStart().startsWith('+') ? '+' : '';
  return plus + raw.replace(/\D/g, '').slice(0, 15);
};

/** The ten national digits of an Indian number, whatever way it was written:
 *  bare, with a 0 trunk prefix, or with 91/+91 in front. Null if it is not one. */
const indianSubscriberDigits = (digits: string): string | null => {
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return null;
};

export function isValidPhone(raw: string): boolean {
  const value = raw.trim();
  const digits = value.replace(/\D/g, '');
  if (!digits) return false;

  /* Given with an explicit country code that is not India's: length is all that
     can fairly be checked. E.164 allows 15 digits including the country code,
     and no national number anywhere is shorter than about 7. */
  if (value.startsWith('+') && !digits.startsWith('91')) {
    return digits.length >= 8 && digits.length <= 15;
  }

  const subscriber = indianSubscriberDigits(digits);
  /* Indian mobile numbering: every mobile series opens 6, 7, 8 or 9. A landline
     would fail here, which is intended — the studio calls back on mobile and a
     number typed into a field labelled "10-digit mobile" that starts 040 is far
     more likely to be a mistake than a preference. */
  return subscriber !== null && /^[6-9]\d{9}$/.test(subscriber);
}
