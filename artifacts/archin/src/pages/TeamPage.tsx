import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { SITE_URL } from '../lib/siteConfig';

import rohithaPhoto from '@assets/team/rohitha-surya.jpeg';
import team1 from '@assets/team/member-1.jpeg';
import team2 from '@assets/team/member-2.jpeg';
import team3 from '@assets/team/member-3.png';
import team4 from '@assets/team/member-4.jpeg';
import team5 from '@assets/team/member-5.jpeg'
import team6 from '@assets/team/member6.jpeg';
import suryaKiranPhoto from '@assets/team/surya-kiran.jpeg';
/* The supplied sketch drawings with their paper keyed out. The sources are
   opaque JPEGs on an off-white ground, so as-is they would drop a grey slab
   over the sheet's rules; keyed, the hairlines and border read straight
   through. The key normalises against each drawing's own paper tone rather
   than assuming pure white, which is why no rectangle edge shows. Long edge
   capped at 700px — they never draw wider than ~420 on the page. */
import bgLeft from '@assets/team/sketch-left.png';
import bgRight from '@assets/team/sketch-right.png';
import bgBottom from '@assets/team/sketch-bottom.png';

/* Drawn to a supplied comp: an architectural drawing sheet — near-white paper,
   hairline rules, dimension runs and registration marks, everything in ink. No
   accent colour appears in the comp, so the site's --accent is deliberately
   unused on this page. */
const PAPER = '#FBFAF8';
const INK = '#000000';
/* Named for the role it plays in the layout, not for a tint any more: the body
   copy was set back at 56% ink and read washed out against the paper, so every
   run of type on this sheet is now solid black. Only the sheet's furniture — the
   rules and the dimension figures below — is still held back, since those are
   drawing marks rather than something to read. */
const MUTED = '#000000';
const FAINT = 'rgba(0,0,0,0.38)';
const RULE = 'rgba(0,0,0,0.20)';
const FRAME_BG = '#E8E5E0';
/* The one colour on an otherwise monochrome sheet — the site's brand red,
   carried here so job titles read as ROAR's rather than as more ink. */
const ACCENT = '#A5342C';

interface TeamMember {
  name: string;
  designation: string;
  photo?: string;
}

/* `dim` is the figure on each portrait's dimension run. The comp's "01"/"02"
   plate numerals and their MANAGEMENT / LEADERSHIP DESIGN labels have both been
   dropped, so no field carries them any more. */
const LEADERSHIP: (TeamMember & { bio: string; dim: string })[] = [
  {
    name: 'Surya Kiran',
    designation: 'Managing Director',
    photo: suryaKiranPhoto,
    bio: 'Leads the overall business strategy, operations and client relationships at ROAR — ensuring every project is delivered with excellence and integrity.',
    dim: '2600',
  },
  {
    name: 'Rohitha Surya',
    designation: 'Founder & Principal Architect',
    photo: rohithaPhoto,
    bio: 'Leads ROAR from Hyderabad, with an active studio in Visakhapatnam — homes, villas, commercial and hospitality projects, concept through execution.',
    dim: '4200',
  },
];

const [SURYA, ROHITHA] = LEADERSHIP;

const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Maria Mustajaab Ahmed', designation: 'Interior Designer', photo: team1 },
  { name: 'Balla Janakiram', designation: 'Senior 2d designer', photo: team2 },
  { name: 'Naveen B', designation: 'Senior 3D Designer', photo: team3 },
  { name: 'KM Naidu', designation: 'Execution Head', photo: team4 },
  {name:'Angarapu Manikanta', designation:'Site Engineer', photo:team5},
  {name:'Patnala Nagesh', designation:'Site Co-ordinator', photo:team6}
];

/* ─────────────────────────────────────────────
   Drawing-sheet furniture
───────────────────────────────────────────── */

/* L-shaped crop marks, set just outside the frame they belong to — the comp
   puts a set at every photograph and at the corners of the sheet. */
function CornerBrackets({ inset = '-8px', size = '14px' }: { inset?: string; size?: string }) {
  const common = { position: 'absolute', width: size, height: size } as const;
  return (
    <span aria-hidden="true" className="pointer-events-none">
      <span style={{ ...common, top: inset, left: inset, borderTop: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}` }} />
      <span style={{ ...common, top: inset, right: inset, borderTop: `1px solid ${RULE}`, borderRight: `1px solid ${RULE}` }} />
      <span style={{ ...common, bottom: inset, left: inset, borderBottom: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}` }} />
      <span style={{ ...common, bottom: inset, right: inset, borderBottom: `1px solid ${RULE}`, borderRight: `1px solid ${RULE}` }} />
    </span>
  );
}

/* A dimension run: witness line, arrow tick at each end, figure sitting on the
   line. Vertical reads bottom-to-top, as it does on a real drawing. */
function Dimension({
  value,
  orientation = 'vertical',
  className = '',
}: {
  value: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}) {
  const vertical = orientation === 'vertical';
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute flex items-center justify-center ${
        vertical ? 'flex-col' : 'flex-row'
      } ${className}`}
    >
      <span
        className={vertical ? 'h-2 w-px' : 'h-px w-2'}
        style={{ backgroundColor: RULE }}
      />
      <span className={`relative flex flex-1 items-center justify-center ${vertical ? 'flex-col' : ''}`}>
        <span
          className={vertical ? 'absolute h-full w-px' : 'absolute h-px w-full'}
          style={{ backgroundColor: RULE }}
        />
        <span
          className="relative px-1 py-0.5 font-sans text-[7.5px] tracking-[0.14em]"
          style={{
            color: FAINT,
            backgroundColor: PAPER,
            writingMode: vertical ? 'vertical-rl' : undefined,
            transform: vertical ? 'rotate(180deg)' : undefined,
          }}
        >
          {value}
        </span>
      </span>
      <span
        className={vertical ? 'h-2 w-px' : 'h-px w-2'}
        style={{ backgroundColor: RULE }}
      />
    </span>
  );
}

/* The plan drawing, standing in for the comp's faint background drawings.
   Small and only just blurred — enough to sit behind the type without
   competing, while still reading as a drawing rather than a smudge. */
function SketchPlate({
  src,
  className = '',
  flip = false,
}: {
  src: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute select-none blur-[1px] ${className}`}
      style={{ opacity: 0.28, transform: flip ? 'scaleX(-1)' : undefined }}
    />
  );
}

/* ─────────────────────────────────────────────
   Portrait frame — the shape the comp is built on
───────────────────────────────────────────── */

/* Every photograph on the sheet is cut the same way: a rectangle with its
   top-left corner chamfered off at 45°, with crop marks set outside it. The
   chamfer is a clip-path rather than a border trick, so the photograph itself
   is cut — no wedge of background shows through the corner. */
const CHAMFER = '26px';
const CHAMFER_SM = '18px';

function Portrait({
  photo,
  name,
  className = '',
  chamfer = CHAMFER,
  brackets = true,
}: {
  photo?: string;
  name: string;
  className?: string;
  chamfer?: string;
  brackets?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {brackets && <CornerBrackets />}
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          backgroundColor: FRAME_BG,
          clipPath: `polygon(${chamfer} 0, 100% 0, 100% 100%, 0 100%, 0 ${chamfer})`,
        }}
      >
        {photo && (
          <img
            src={photo}
            alt={name ? `${name}, ROAR Architects` : 'ROAR Architects team member'}
            className="h-full w-full object-cover object-top grayscale"
          />
        )}
      </div>
    </div>
  );
}

function LeaderCopy({ name, designation, bio }: { name: string; designation: string; bio: string }) {
  return (
    <div>
      {/* Leading rule, left over from the tag that used to sit here — it keeps
          the block anchored to the sheet's furniture now the label is gone. */}
      <span className="mb-5 block h-px w-6" style={{ backgroundColor: RULE }} />
      <h2
        className="font-serif text-[clamp(30px,3vw,42px)] font-light leading-[1.06]"
        style={{ color: INK }}
      >
        {name}
      </h2>
      <p
        className="mt-2 font-sans text-[13px] font-medium leading-[1.5]"
        style={{ color: ACCENT }}
      >
        {designation}
      </p>
      <span className="mt-5 block h-px w-6" style={{ backgroundColor: RULE }} />
      <p
        className="mt-5 max-w-[28ch] font-sans text-[13px] font-light leading-[1.85]"
        style={{ color: MUTED }}
      >
        {bio}
      </p>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="relative flex min-h-screen flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>Team | ROAR Architects</title>
        <meta
          name="description"
          content="Meet the architects and designers behind ROAR Architects, a Hyderabad-based design studio with an active studio in Visakhapatnam."
        />
        <link rel="canonical" href={`${SITE_URL}/team`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Team | ROAR Architects" />
        <meta property="og:url" content={`${SITE_URL}/team`} />
      </Helmet>

      <SiteHeader />

      {/* clip, not hidden: setting overflow-x to hidden makes overflow-y
          compute to auto, which turns this element into its own scroll
          container and puts a second scrollbar down the side of the page.
          overflow-x-clip trims the sketch plates' negative offsets without
          ever becoming scrollable. */}
      <main className="relative flex-1 overflow-x-clip">
        {/* Sheet border with its own crop marks, holding the whole drawing. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[max(14px,2.6vw)] inset-y-6 hidden lg:block"
          style={{ border: `1px solid ${RULE}` }}
        >
          <CornerBrackets inset="-7px" size="16px" />
        </div>

        {/* Studio line up the left margin. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[max(20px,3.4vw)] top-[26%] hidden select-none font-sans text-[8px] uppercase tracking-[0.3em] xl:block"
          style={{ color: MUTED, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          ROAR Architects &nbsp;·&nbsp; Studio &nbsp;·&nbsp; Based in Visakhapatnam
        </span>

        {/* ══ Section 1 — the two leaders ══ */}
        <section className="relative px-[max(26px,6vw)] pt-12 pb-4 lg:pt-16 lg:pb-6">
          {/* Drawn in off the edges so each plate reads whole rather than as a
              sliver. The percentages resolve against the section's width, which
              is the full viewport, so these sit just inside the screen with
              nothing clipped by main's overflow-x-clip. */}
          <SketchPlate src={bgLeft} className="left-[1%] top-[26%] hidden w-[340px] lg:block" />
          <SketchPlate src={bgRight} className="right-[11%] top-[58%] hidden w-[400px] lg:block" />

          <div className="relative mx-auto w-full max-w-[1120px]">
            {/* Two portraits interlocking: they share column 6 and the middle
                row, which is what laps Surya's over Rohitha's rather than
                setting them side by side. Below lg the blocks fall into one
                column in DOM order. */}
            <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-start lg:gap-x-5 lg:gap-y-0">
              {/* Intro */}
              <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
                <p className="font-sans text-[8.5px] uppercase tracking-[0.26em]" style={{ color: MUTED }}>
                  The People Behind ROAR
                </p>
                <h1
                  className="mt-4 font-serif text-[clamp(52px,6.6vw,96px)] font-light leading-[0.9] tracking-[-0.015em]"
                  style={{ color: INK }}
                >
                  Team.
                </h1>
                <p
                  className="mt-6 max-w-[26ch] font-sans text-[14px] font-light leading-[1.85]"
                  style={{ color: MUTED }}
                >
                  Architects and designers shaping every ROAR project, from first sketch to
                  handover.
                </p>
              </div>

              {/* Rohitha — portrait, moved out to the right of the sheet. The
                  small negative margin is what keeps Surya's portrait lapping
                  over this one: at column 7 the two cells no longer touch, so
                  without it the pair would sit apart rather than interlock. */}
              <div className="relative lg:col-span-3 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:-ml-10">
                <Dimension
                  value={ROHITHA.dim}
                  className="left-[-26px] top-0 hidden h-full lg:flex"
                />
                <Portrait
                  photo={ROHITHA.photo}
                  name={ROHITHA.name}
                  className="mx-auto aspect-[0.8] w-full max-w-[260px] lg:mx-0 lg:max-w-[290px]"
                />
              </div>

              {/* Rohitha — copy set beside the portrait on the same row
                  rather than dropped below it. */}
              <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:mt-1">
                <LeaderCopy
                  name={ROHITHA.name}
                  designation={ROHITHA.designation}
                  bio={ROHITHA.bio}
                />
              </div>

              {/* Surya — portrait, dropped lower and lapping Rohitha's. The
                  filled square at its foot is the comp's solid corner tick. */}
              <div className="relative lg:z-10 lg:col-span-3 lg:col-start-4 lg:row-span-2 lg:row-start-2">
                <Portrait
                  photo={SURYA.photo}
                  name={SURYA.name}
                  className="mx-auto aspect-[0.72] w-full max-w-[240px] lg:mx-0 lg:max-w-[265px]"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-[-5px] right-[-5px] hidden h-2.5 w-2.5 lg:block"
                  style={{ backgroundColor: INK }}
                />
                <Dimension
                  value={SURYA.dim}
                  orientation="horizontal"
                  className="bottom-[-26px] left-0 hidden w-full lg:flex"
                />
              </div>

              {/* Surya — copy, down the left margin */}
              <div className="lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:mt-16">
                <LeaderCopy name={SURYA.name} designation={SURYA.designation} bio={SURYA.bio} />
              </div>
            </div>
          </div>
        </section>

        {/* ══ Section 2 — the wider studio ══ */}
        <section className="relative px-[max(26px,6vw)] pb-10 lg:pb-14">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="h-px w-full" style={{ backgroundColor: RULE }} />

            <div className="relative pt-8 lg:pt-10">
              <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-12 lg:items-start lg:gap-x-5">
                <div className="lg:col-span-5 lg:col-start-1">
                  <p
                    className="font-sans text-[8.5px] uppercase tracking-[0.26em]"
                    style={{ color: MUTED }}
                  >
                    The Design Studio
                  </p>
                  <h2
                    className="mt-4 font-serif text-[clamp(30px,3.9vw,54px)] font-light leading-[1.06] tracking-[-0.01em]"
                    style={{ color: INK }}
                  >
                    Designing
                    <br />
                    with Purpose.
                  </h2>
                </div>
              </div>

              {/* The plate number and its label used to sit in a column to the
                  left of each photograph. That column is what set the caption
                  below out of line with the picture — the caption starts at the
                  figure's edge, which was the number's edge, not the photo's.
                  With it gone the photograph starts the figure and the name
                  below lines up with it. The dimension run is absolutely
                  positioned, so it costs no width and does not reintroduce the
                  offset. */}
              {/* One row for the whole studio at lg, where the 1120px sheet
                  gives six portraits about 150px each once the tightened gutters
                  are taken out. Below lg they step down rather than keep the row:
                  six abreast at md would leave each face near 100px, and on a
                  phone about 50px, too narrow to read. Two rows of three at md,
                  three rows of two below it. */}
              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-12 sm:gap-x-12 md:grid-cols-3 lg:mt-14 lg:grid-cols-6 lg:gap-x-10">
                {TEAM_MEMBERS.map((member, idx) => (
                  <figure key={member.photo ?? idx} className="relative flex flex-col">
                    <div className="relative w-full max-w-full">
                      <Dimension
                        value="3200"
                        className="left-[-14px] top-0 hidden h-full lg:flex"
                      />
                      <Portrait
                        photo={member.photo}
                        name={member.name}
                        chamfer={CHAMFER_SM}
                        className="aspect-[0.82] w-full"
                      />
                    </div>

                    {/* Caption only where the details have arrived — an
                        unnamed portrait shows as a portrait, with nothing
                        standing in for a name. */}
                    {(member.name || member.designation) && (
                      <figcaption className="mt-5">
                        <span className="mb-3 block h-px w-6" style={{ backgroundColor: RULE }} />
                        {member.name && (
                          <p
                            className="font-serif text-[clamp(15px,1.4vw,19px)] font-light leading-tight"
                            style={{ color: INK }}
                          >
                            {member.name}
                          </p>
                        )}
                        {member.designation && (
                          <p
                            className="mt-1 font-sans text-[9.5px] font-medium leading-[1.6]"
                            style={{ color: ACCENT }}
                          >
                            {member.designation}
                          </p>
                        )}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ Section 3 — the tally ══ */}
        <section className="relative px-[max(26px,6vw)] pb-16 lg:pb-24">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="h-px w-full" style={{ backgroundColor: RULE }} />

            <div className="relative pt-8 lg:pt-10">
              <SketchPlate src={bgBottom} className="right-[2%] top-[-64%] hidden w-[600px] lg:block" />

              {/* Dot grid, far right — the comp's tone patch. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-2 hidden h-16 w-16 lg:block"
                style={{
                  backgroundImage: `radial-gradient(${RULE} 1px, transparent 1px)`,
                  backgroundSize: '9px 9px',
                }}
              />

              <div className="relative flex flex-wrap items-center gap-x-10 gap-y-6">
                <p
                  className="font-sans text-[15px] font-medium uppercase leading-[1.8] tracking-[0.22em]"
                  style={{ color: ACCENT }}
                >
                  People
                  <br />
                  One Studio
                </p>
                <span className="hidden h-14 w-px lg:block" style={{ backgroundColor: RULE }} />
                <p
                  className="max-w-[34ch] font-sans text-[14px] font-light leading-[1.85]"
                  style={{ color: MUTED }}
                >
                  Different perspectives. One shared vision — creating spaces that inspire and
                  endure.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
