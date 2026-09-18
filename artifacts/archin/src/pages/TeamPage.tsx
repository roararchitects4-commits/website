import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { TypewriterText } from '../components/TypewriterText';
import { SITE_URL } from '../lib/siteConfig';
import { BIO_INITIAL } from '../lib/typography';

/* The entrance shared by everything that slides onto this sheet. Matches the
 * About block on the home page, so a visitor moving between the two reads one
 * motion language rather than two. */
const SETTLE = { duration: 1.8, ease: [0.22, 1, 0.36, 1] as const };

import rohithaPhoto from '@assets/team/rohitha-surya.jpeg';
/* Maria's portrait, re-framed: the original is shot closer than the other five
   and read zoomed-in beside them. member-1-wide is that photograph with its
   backdrop extended by 14% off its own edge pixels, so the subject sits at the
   same scale in frame as the rest of the sheet. member-1.jpeg is untouched. */
import team1 from '@assets/team/member-1-wide.jpeg';
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
    name: 'A.Surya Kiran',
    designation: 'Managing Director',
    photo: suryaKiranPhoto,
    /* Written to a short-word vocabulary on purpose. The bios are justified in
       a 30-character measure, and a long word landing at the end of a line is
       what forces the spaces on that line open — "relationships" and
       "exceptional" were doing exactly that. Nothing longer than nine letters
       here, so every line fills on word spacing alone and none has to break. */
    bio: "Guides the firm's strategy, daily work and client relations, driving strong results on every ROAR project.",
    dim: '2600',
  },
  {
    name: 'A.Rohitha Surya',
    designation: 'Founder & Principal Architect',
    photo: rohithaPhoto,
    /* Same rule as above. "residential", "commercial", "hospitality",
       "functionality" and "aesthetics" were the five words breaking her
       paragraph open; the three project types survive as homes, offices and
       places to gather, which is what those categories are. */
    bio: 'Leads design at ROAR, shaping homes, offices and places to gather that blend new ideas with comfort, function and lasting style.',
   dim: '4200',
  },
];

const [SURYA, ROHITHA] = LEADERSHIP;

/* The studio by bench rather than as one run of faces — the page now sets a
 * column per team, and this is the order they read in. */
const TEAM_GROUPS: { label: string; members: TeamMember[] }[] = [
  {
    label: 'Architecture Team',
    members: [
      { name: 'Naveen B', designation: 'Senior 3D Designer', photo: team3 },
      { name: 'Balla Janakiram', designation: 'Senior 2d designer', photo: team2 },
    ],
  },
  {
    label: 'Interior Team',
    members: [
      { name: 'Maria Mustajaab Ahmed', designation: 'Interior Designer', photo: team1 },
    ],
  },
  {
    label: 'Site Execution Team',
    members: [
      { name: 'KM Naidu', designation: 'Execution Head', photo: team4 },
      { name: 'Angarapu Manikanta', designation: 'Site Engineer', photo: team5 },
      { name: 'Patnala Nagesh', designation: 'Site Co-ordinator', photo: team6 },
    ],
  },
];

/* A bench's column is as wide as the number of people on it — two units for
 * architecture, one for interiors, three for site execution — against a
 * six-unit row. Every portrait then comes out the same width and all six sit in
 * one row, instead of three equal thirds leaving the one-person column half
 * empty. Written out as whole class names rather than built from the count,
 * because Tailwind only emits the classes it can see in the source. */
const GROUP_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
};

/* The row is laid out on one track per person plus a fixed gap track between
 * benches, rather than on six equal columns. Six equal columns can only give
 * every gap the same width — the space between Balla and Maria read as no
 * different from the space between Naveen and Balla, so the three benches ran
 * together as one line of faces. With a track of its own between them, the
 * separation is wider than the spacing inside a bench and every portrait still
 * comes out exactly the same width.
 *
 * Both values are handed over as custom properties and only read back at lg,
 * because below that the benches stack into a single column and a `4 / span 1`
 * would conjure implicit columns out of the one-column grid. */
/* The member gap is set on the outer row as well as inside each bench. Without
 * it the gap between two people came out of their bench's own width, so the
 * one-person bench sat on a full track while everyone else lost half a gap —
 * Maria's frame came out 10px wider than the rest. With both gaps equal, every
 * portrait is exactly one track wide, and a bench is separated from its
 * neighbour by the extra track plus the two gaps either side of it. */
const BENCH_GAP = '2rem';
const MEMBER_GAP = '1.5rem';

const TEAM_COLUMNS = TEAM_GROUPS.map(
  (group) => `repeat(${group.members.length}, minmax(0, 1fr))`,
).join(` ${BENCH_GAP} `);

/* Where each bench's first member falls in the row read left to right, so a
 * card can be given its place in the deal from its bench and its index within
 * it. With benches of 2, 1 and 3 this is [0, 2, 3]. */
const MEMBER_INDEX: number[] = [];
TEAM_GROUPS.reduce((count, group) => {
  MEMBER_INDEX.push(count);
  return count + group.members.length;
}, 0);

/* Where each bench starts on that track list: its own columns, then the gap. */
const GROUP_PLACEMENT: string[] = [];
TEAM_GROUPS.reduce((column, group) => {
  GROUP_PLACEMENT.push(`${column} / span ${group.members.length}`);
  return column + group.members.length + 1;
}, 1);

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
      {/* "A.Rohitha Surya" is the long one, and it was breaking after
          "A.Rohitha". Its copy sits in three of the twelve columns, which is
          about 265px at the 1120px cap — the name wanted a little over that at
          42px. Capping at 36px brings it inside the column at every width the
          clamp serves, and the nowrap is the guarantee that it stays there.
          Below lg the copy has a full-width column and never needed either. */}
      {/* preserveWhitespace is off so the nowrap class above actually applies —
          the component's inline `pre-wrap` would otherwise outrank it and put
          the name back on two lines. Safe here: a name carries no newlines. */}
      <TypewriterText
        tag="h2"
        preserveWhitespace={false}
        className="min-h-[1.06em] font-serif text-[clamp(30px,2.6vw,36px)] font-light leading-[1.06] text-black lg:whitespace-nowrap"
        text={name}
        speed={45}
        delay={0}
      />
      <TypewriterText
        tag="p"
        className="mt-2 min-h-[1.5em] font-sans text-[13px] font-medium leading-[1.5] text-accent"
        text={designation}
        speed={22}
        delay={150}
      />
      <span className="mt-5 block h-px w-6" style={{ backgroundColor: RULE }} />
      {/* Typed in as it scrolls into view, the way the leader bios on the home
          page are. `text-black` rather than the MUTED inline style the other
          runs here use — MUTED is #000 anyway, and TypewriterText takes a
          className but no style.

          The min-height reserves the finished paragraph's box. Without it the
          rule above and the portrait beside it would be shoved down a line at
          a time as the text fills; 150px is the taller of the two bios at this
          size, so both blocks hold still.

          Justified, so both bios square off against the same right edge instead
          of ragging out to wherever each line happens to end — at this measure
          one line was running a third longer than the one above it.

          No hyphenation: a justified line is normally kept even by letting a
          long word break across it, but a broken word reads badly in a bio this
          short. The bios are written to a short-word vocabulary instead, so
          each line fills on word spacing alone and nothing needs breaking —
          which is why the copy in LEADERSHIP above is worded the way it is. */}
      <TypewriterText
        tag="p"
        className="mt-5 min-h-0 max-w-[30ch] text-justify font-sans text-[13px] font-light leading-[1.85] text-black lg:min-h-[120px]"
        initialClassName={BIO_INITIAL}
        text={bio}
        speed={11}
        delay={300}
      />
    </div>
  );
}

export default function TeamPage() {
  /* Arriving here from the nav is a fresh page, so it opens at its own top
     rather than at whatever offset the previous page was left at — wouter swaps
     the component but never touches the window's scroll position. The other
     three pages already do this; this one was the only route that did not.

     useLayoutEffect rather than useEffect so the jump happens before the
     browser paints. On the effect timing the visitor gets one frame of the team
     sheet already scrolled down before it snaps back.

     It also matters for what is on this page in particular: the two leader
     portraits animate in on mount, so landing mid-page would spend their
     entrance somewhere above the fold and leave a visitor scrolling up to
     static pictures. */
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const reduceMotion = useReducedMotion();

  /* Rohitha enters from the left of the screen and Surya from the right, so the
     two cross past each other on the way to the positions they interlock in —
     the same pairing the About block on the home page uses, mirrored. Both are
     above the fold, so these run on mount rather than on scroll.

     The travel is in vw so each portrait genuinely starts off the edge of the
     screen at any width, rather than a fixed distance that reads as a nudge on
     a desktop and a flight on a phone. `main` clips overflow on the x axis, so
     nothing here can widen the document while it is out there. */
  const enterFrom = (side: 'left' | 'right') =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, x: side === 'left' ? '-60vw' : '60vw' },
          animate: { opacity: 1, x: 0 },
          transition: SETTLE,
        };

  /* The studio's six portraits arrive as a deck of cards: every one starts
     stacked at the same point just off the left edge of the screen, then they
     peel off one at a time and stick where they belong.

     Stacking them means each card needs its own travel — a card that belongs
     three columns in has further to come than the first one — so the distance
     is measured rather than written. `deckX` below is where the whole stack
     sits, and each card's offset is whatever moves it from its own laid-out
     position to there.

     The trigger cannot live on the cards themselves. `whileInView` watches the
     element it is on, and a card parked off the left of the screen never
     intersects the viewport — so the only thing that could bring it into view
     is the animation that is waiting for it to come into view. The leftmost
     bench sat invisible for exactly that reason. The observer goes on the row
     instead, which never moves. */
  const benchRowRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const [deckOffsets, setDeckOffsets] = React.useState<number[]>([]);
  const benchRowInView = useInView(benchRowRef, { once: true, amount: 0.15 });

  React.useLayoutEffect(() => {
    if (reduceMotion) return;
    setDeckOffsets(
      cardRefs.current.map((card) => {
        if (!card) return 0;
        const box = card.getBoundingClientRect();
        /* One card-width clear of the left edge, so the stack is fully hidden
           before it is dealt. */
        const deckX = -(box.width + 40);
        return deckX - box.left;
      }),
    );
    /* Measured once, on mount. Any drift between now and the moment the row is
       scrolled to only moves where the stack waits while it is off-screen —
       every card still animates to x: 0, which is its true laid-out position,
       so the places they stick are exact either way. */
  }, [reduceMotion]);

  const dealCard = (index: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, x: deckOffsets[index] ?? -600, rotate: -8 + index * 2 },
          animate: benchRowInView ? { opacity: 1, x: 0, rotate: 0 } : undefined,
          transition: { ...SETTLE, delay: index * 0.13 },
        };

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
                <TypewriterText
                  tag="p"
                  className="font-sans text-[8.5px] uppercase tracking-[0.26em] text-black"
                  text="The People Behind ROAR"
                  speed={26}
                  delay={200}
                />
                {/* min-height on the display line specifically: at 96px a single
                    typed line costs 86px of layout, so without it the intro
                    below jumps most of a screen as the word lands. */}
                {/* Inter, the same face as the label above it, rather than the
                    serif. -0.02em is the tracking the hero headline, the About
                    statement and Get In Touch all use for Inter at display
                    size, and at 96px this is the largest of them. */}
                <TypewriterText
                  tag="h1"
                  className="mt-4 min-h-[1em] font-sans text-[clamp(52px,6.6vw,96px)] font-light leading-[0.9] tracking-[-0.02em] text-black"
                  text="Team."
                  speed={90}
                  delay={500}
                />
                <TypewriterText
                  tag="p"
                  className="mt-6 min-h-0 max-w-[26ch] font-sans text-[14px] font-light leading-[1.85] text-black lg:min-h-[78px]"
                  text="Architects and designers shaping every ROAR project, from first sketch to handover."
                  speed={11}
                  delay={900}
                />
              </div>

              {/* Rohitha — portrait, moved out to the right of the sheet. The
                  small negative margin is what keeps Surya's portrait lapping
                  over this one: at column 7 the two cells no longer touch, so
                  without it the pair would sit apart rather than interlock. */}
              {/* The whole cell travels, not just the photograph — the
                  dimension run belongs to this portrait and would otherwise sit
                  drawn on an empty sheet while the picture flew in to meet it.
                  A transform does not disturb grid placement, so the column and
                  row it is assigned to are unaffected. */}
              <motion.div
                {...enterFrom('left')}
                className="relative lg:col-span-3 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:-ml-10"
              >
                <Dimension
                  value={ROHITHA.dim}
                  className="left-[-26px] top-0 hidden h-full lg:flex"
                />
                <Portrait
                  photo={ROHITHA.photo}
                  name={ROHITHA.name}
                  className="mx-auto aspect-[0.8] w-full max-w-[260px] lg:mx-0 lg:max-w-[290px]"
                />
              </motion.div>

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
              <motion.div
                {...enterFrom('right')}
                /* The -ml-10 is what makes this portrait the same size as
                   Rohitha's. Three columns come to 265px, so the 290px cap on
                   the frame below never bound and Surya rendered ~9% smaller
                   than her — she reaches 290 only because her own cell carries
                   the same negative margin.

                   Taken off the left, and the frame is right-aligned inside it,
                   so the right edge does not move: the 20px by which Rohitha's
                   portrait laps this one is the interlock the layout is built
                   on, and widening rightwards would have doubled it. The 25px
                   this reaches back into Surya's copy column is empty — his
                   name is the widest thing in it at about 216px of 265. */
                className="relative lg:z-10 lg:col-span-3 lg:col-start-4 lg:row-span-2 lg:row-start-2 lg:-ml-10"
              >
                {/* Same frame as Rohitha's — 0.8 rather than the 0.72 this
                    carried, and the same widths — so the two portraits read as
                    a matched pair on the sheet rather than one being slightly
                    taller and narrower than the other. */}
                {/* ml-auto rather than the mx-0 Rohitha's carries: this frame
                    sits at the right of its widened cell, which is what holds
                    its right edge where it was. Below lg both are mx-auto at
                    the same width and always matched. */}
                <Portrait
                  photo={SURYA.photo}
                  name={SURYA.name}
                  className="mx-auto aspect-[0.8] w-full max-w-[260px] lg:ml-auto lg:mr-0 lg:max-w-[290px]"
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
              </motion.div>

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
                {/* Eight columns rather than five: at 54px the line needs about
                    500px and the five-column cell gave it 445, so it broke after
                    "with" whether or not the markup asked it to. The nowrap is
                    the guarantee — the cell is now wide enough at every width
                    the clamp can serve. Below lg it wraps as it always did. */}
                <div className="lg:col-span-8 lg:col-start-1">
                  <TypewriterText
                    tag="p"
                    className="font-sans text-[8.5px] uppercase tracking-[0.26em] text-black"
                    text="The Design Studio"
                    speed={26}
                    delay={150}
                  />
                  {/* Same as the leader names: preserveWhitespace off so the
                      nowrap that keeps this on one line survives. */}
                  <TypewriterText
                    tag="h2"
                    preserveWhitespace={false}
                    className="mt-4 min-h-[1.06em] font-serif text-[clamp(30px,3.9vw,54px)] font-light leading-[1.06] tracking-[-0.01em] text-black lg:whitespace-nowrap"
                    text="Designing with Purpose."
                    speed={45}
                    delay={500}
                  />
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
              {/* One row, three columns — a column per bench, so the studio
                  reads as architecture, interiors and site execution rather
                  than as six faces in a line. The columns run to their own
                  length; interiors is one person and site execution three,
                  which is what the studio is.

                  Two abreast inside each column, at every width. At lg that
                  puts each portrait near 160px — the size they were when the
                  six sat in a single row — and keeps the tallest column to two
                  rows rather than three stacked full-width portraits. Below sm
                  the three columns fall into one, and the pairing inside them
                  is what stops a phone scrolling through six of them. */}
              <div
                /* The row gap only ever separates the three benches, and only
                   on a phone — from lg up they sit side by side on a single
                   row, where a row gap has nothing to space. 56px there left
                   each bench label floating well clear of the portraits above
                   it; 32px still reads as a break between benches without the
                   sheet turning into a long scroll of gaps. The lg value is
                   kept as a statement of intent, not because it renders. */
                ref={benchRowRef}
                className="mt-10 grid grid-cols-1 gap-y-8 lg:mt-14 lg:gap-y-14 lg:[column-gap:var(--member-gap)] lg:[grid-template-columns:var(--team-columns)]"
                style={
                  {
                    '--team-columns': TEAM_COLUMNS,
                    '--member-gap': MEMBER_GAP,
                  } as React.CSSProperties
                }
              >
                {TEAM_GROUPS.map((group, groupIdx) => (
                  <div
                    key={group.label}
                    className="lg:[grid-column:var(--bench-placement)]"
                    style={{ '--bench-placement': GROUP_PLACEMENT[groupIdx] } as React.CSSProperties}
                  >
                    {/* Solid ink, both the name and the line under it: these
                        divide the sheet into its three benches, so they are
                        read as structure rather than as the faint furniture
                        the dimension runs and crop marks are drawn in. */}
                    <TypewriterText
                      tag="p"
                      className="min-h-[1.5em] text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-black lg:text-[12px]"
                      text={group.label}
                      speed={26}
                      delay={150 + groupIdx * 120}
                    />
                    <span className="mt-3 block h-px w-full" style={{ backgroundColor: INK }} />

                    <div
                      className={`mt-8 grid grid-cols-2 gap-y-12 [column-gap:var(--member-gap)] ${
                        GROUP_COLS[group.members.length]
                      }`}
                      style={{ '--member-gap': MEMBER_GAP } as React.CSSProperties}
                    >
                      {group.members.map((member, idx) => (
                        /* A bench of one lands in the left half of the phone
                           grid's two columns, which reads as hanging off the
                           label centred over it. Spanning both columns and then
                           taking a single column's width back centres it
                           without drawing it any larger than the portraits on
                           the benches either side — the width is the column
                           formula itself, (row - gap) / 2, so it follows
                           MEMBER_GAP rather than restating it.

                           Below lg only. From lg up each bench sets its own
                           column count through GROUP_COLS, where a bench of one
                           already fills its single track. */
                        <motion.figure
                          key={member.photo ?? idx}
                          /* Position across the whole row, not within the
                             bench, so the six deal out as one left-to-right
                             run rather than three benches dealing at once. */
                          ref={(node: HTMLElement | null) => {
                            cardRefs.current[MEMBER_INDEX[groupIdx] + idx] = node;
                          }}
                          {...dealCard(MEMBER_INDEX[groupIdx] + idx)}
                          className={`relative flex flex-col ${
                            group.members.length === 1
                              ? 'max-lg:col-span-2 max-lg:mx-auto max-lg:w-[calc((100%_-_var(--member-gap))/2)]'
                              : ''
                          }`}
                        >
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
                              <span
                                className="mb-3 block h-px w-6"
                                style={{ backgroundColor: RULE }}
                              />
                              {/* Sized to the longest name on the sheet:
                                  "Maria Mustajaab Ahmed" measures 164px at 17px
                                  against a 148px column, so it broke after the
                                  second word while every other name sat on one
                                  line. The clamp stays tied to the viewport, so
                                  it goes on fitting as the columns narrow. */}
                              {member.name && (
                                <TypewriterText
                                  tag="p"
                                  className="min-h-[1.25em] font-serif text-[clamp(11px,1.05vw,15px)] font-light leading-tight text-black"
                                  text={member.name}
                                  speed={26}
                                  delay={120}
                                />
                              )}
                              {member.designation && (
                                <TypewriterText
                                  tag="p"
                                  className="mt-1 min-h-[1.6em] font-sans text-[9.5px] font-medium leading-[1.6] text-accent"
                                  text={member.designation}
                                  speed={22}
                                  delay={320}
                                />
                              )}
                            </figcaption>
                          )}
                        </motion.figure>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ Section 3 — the tally ══ */}
        <section className="relative px-[max(26px,6vw)] pb-8 lg:pb-12">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="h-px w-full" style={{ backgroundColor: RULE }} />

            {/* Tighter top and bottom than the sections above: this is a closing
                strip of one line, and the air it used to carry read as an empty
                panel under the studio rather than as the foot of the sheet. */}
            <div className="relative pt-5 lg:pt-6">
              {/* Smaller and lifted, now the strip under it is one line tall:
                  at 600px the drawing stood 279px high against a 90px band, so
                  it ran out under the footer and was cut in half. A pixel offset
                  rather than a percentage — percentages resolve against the
                  band's own height, so the plate would move again the next time
                  this block's padding changed. Sat on the strip rather than
                  above it: at -120px the drawing climbed into the row of names
                  over it. */}
              <SketchPlate src={bgBottom} className="right-[2%] top-[-56px] hidden w-[420px] lg:block" />

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
                {/* The <br /> becomes a newline in the string: the typewriter
                    takes text, not markup, and the component's `pre-wrap` is
                    what renders the break. */}
                <TypewriterText
                  tag="p"
                  className="min-h-[3em] font-sans text-[15px] font-medium uppercase leading-[1.5] tracking-[0.22em] text-accent"
                  text={'One Studio.\nShared Purpose.'}
                  speed={30}
                  delay={150}
                />
                <span className="hidden h-10 w-px lg:block" style={{ backgroundColor: RULE }} />
                {/* Set in the same voice as "Designing with Purpose." above it
                    — the sheet's light serif rather than the sans the body copy
                    uses — so the two read as the pair of statements they are.
                    Held at 22px rather than the heading's clamp: this is a full
                    sentence, and at heading size it could not stay on the one
                    line it is meant to close the page with.

                    That single line runs from lg up, where the 1120px column
                    has room for it beside the label. The measure and the wrap
                    are kept for narrower screens, where nothing would fit. */}
                {/* preserveWhitespace off, for the nowrap that holds this to
                    the single line it closes the page with at lg. */}
                <TypewriterText
                  tag="p"
                  preserveWhitespace={false}
                  className="min-h-[2.6em] max-w-[34ch] font-serif text-[17px] font-light leading-snug tracking-[-0.01em] text-black lg:min-h-0 lg:max-w-none lg:whitespace-nowrap lg:text-[22px]"
                  text={'Different perspectives. One shared vision — creating spaces that inspire and endure.'}
                  speed={13}
                  delay={400}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
