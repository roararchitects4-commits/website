/* The enquiry form, and the only one on the site — the home page's Get In Touch
 * section was removed, leaving /contactus as the single place a lead can be
 * left. Everything a lead depends on therefore lives here: the fields, the
 * validation, the attribution and the conversion event.
 *
 * It posts to /api/lead, which asks only for a name and a phone number.
 */
import React, { useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { THANK_YOU_PATH } from '../lib/sections';
import { attributionString } from '../lib/attribution';
import { pushEvent } from '../lib/analytics';
import { isValidPhone, normalisePhone } from '../lib/phone';

/* Three fields, deliberately. Every extra question is another chance to
   abandon the form, and a name with a working phone number is all the studio
   needs to open the conversation — the brief, the budget and the timing are
   what the callback is for. */
const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
};

type FormState = typeof EMPTY_FORM;

const fieldClass =
  'w-full bg-white border border-line rounded-lg py-4 px-4 text-black text-[16px] placeholder:text-black/45 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors';

const labelClass = 'block text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-2';

/* ─────────────────────────────────────────────
   Lead form
───────────────────────────────────────────── */
export function LeadForm({
  id,
  nameFieldRef,
}: {
  id?: string;
  /** Put on the Name field. The page watches it to decide when the visitor
   *  has scrolled past the start of the form. */
  nameFieldRef?: React.Ref<HTMLDivElement>;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  /* Honeypot — hidden from people, filled in by naive bots. The API drops any
     submission carrying a value here. */
  const [company, setCompany] = useState('');

  /* Fires once per visitor, not once per keystroke, and held in a ref so that
     recording it never costs a render. The pair of form_start and generate_lead
     is what turns the container's numbers into a funnel: the gap between them is
     the share of people who began the form and thought better of it, which is
     the difference between a page that does not convert and traffic that was
     never going to convert anywhere. */
  const startedRef = useRef(false);
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    pushEvent('form_start', { form_id: id ?? 'lead' });
  };

  const set = (field: keyof FormState) => (value: string) => {
    markStarted();
    setForm((f) => ({ ...f, [field]: value }));
  };

  /* `type="tel"` only picks the on-screen keyboard — it accepts any character
     typed into it, so the value is filtered here. Doing it on change rather
     than on keypress cleans up pastes and autofill too. Whether what is left is
     a number anyone can actually ring is a separate question, asked at submit:
     rejecting a half-typed number under the field while it is being entered
     would shout at every visitor on their way to a perfectly good one. */
  const updatePhone = (raw: string) => {
    markStarted();
    setForm((f) => ({ ...f, phone: normalisePhone(raw) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!form.name || !form.phone) return;

    if (!isValidPhone(form.phone)) {
      setError('Please enter a 10-digit mobile number we can call you back on.');
      pushEvent('form_error', { form_id: id ?? 'lead', error_type: 'invalid_phone' });
      return;
    }

    setSending(true);
    setError(null);

    /* Read at submit rather than at mount: what the URL said when this component
       first rendered is only the campaign for someone who landed on this page
       directly, and a visitor who came through the site's nav would report
       nothing at all. See lib/attribution. */
    const source = attributionString();

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, company, source }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Something went wrong. Please try again.');
      }

      /* Pushed before the navigation, so the event cannot be lost to the route
         change, and carrying the source so the container can attribute the lead
         without re-reading a URL that no longer holds it. The thank-you page's
         own URL remains the backstop trigger; this is the one that knows which
         campaign paid, and that fires exactly once per lead rather than once per
         view of a page a visitor can reload or come back to.

         No name, phone or email goes to the dataLayer — analytics has no
         business with any of them, and pushing them would hand personal data to
         every tag in the container. */
      pushEvent('generate_lead', {
        form_id: id ?? 'lead',
        lead_source: source || '(direct)',
        page_path: window.location.pathname,
      });

      /* Cleared only once the mail is actually away — wiping the fields on a
         failed send would make the visitor retype the lot. */
      /* A real navigation rather than a flag: the thank-you page has its own
         URL, which is what an ads or analytics conversion can fire on. Cleared
         first, so the fields are empty if the visitor comes back. */
      setForm(EMPTY_FORM);
      navigate(THANK_YOU_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      pushEvent('form_error', { form_id: id ?? 'lead', error_type: 'send_failed' });
    } finally {
      setSending(false);
    }
  };

  /* Derived from the form's own id rather than fixed, since this component could
     appear twice on one page and duplicate ids would point every label at the
     first copy's fields. */
  const fieldId = (field: string) => `${id ?? 'lead'}-${field}`;

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      /* h-full lets the card fill the hero's right column so its foot lines up
         with the copy beside it; in the closing section the parent has no fixed
         height, so it simply sizes to its content there. */
      className="bg-white border border-accent rounded-2xl p-6 sm:p-8 w-full h-full flex flex-col justify-center shadow-[0_18px_50px_-24px_rgba(42,36,32,0.35)]"
    >
      <div className="flex flex-col gap-4">
        <div ref={nameFieldRef}>
          {/* htmlFor, so tapping the label puts the cursor in the field it names
              — on a phone that is a far larger target than the input's own edge
              — and so a screen reader announces the two as one thing. */}
          <label className={labelClass} htmlFor={fieldId('name')}>
            Name*
          </label>
          <input
            id={fieldId('name')}
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor={fieldId('phone')}>
            Phone*
          </label>
          <input
            id={fieldId('phone')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            placeholder="10-digit mobile"
            value={form.phone}
            onChange={(e) => updatePhone(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor={fieldId('email')}>
            Email (optional)
          </label>
          <input
            id={fieldId('email')}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set('email')(e.target.value)}
            className={fieldClass}
          />
        </div>

        {/* Honeypot — parked off-screen rather than display:none, since some
            bots skip fields they can see are hidden. Never announced to
            assistive tech, never focusable by keyboard. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="absolute left-[-9999px] w-px h-px opacity-0"
        />

        {error && (
          <p role="alert" className="text-[13px] text-accent leading-relaxed">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-white text-accent font-semibold text-[13px] tracking-[0.24em] uppercase rounded-full py-5 mt-2 border border-accent hover:bg-accent hover:text-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-accent"
        >
          {sending ? 'Sending…' : 'Submit'}
        </button>

      </div>
    </form>
  );
}
