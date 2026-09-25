/**
 * BookHavenLogo — shared brand identity component
 *
 * Variants:
 *   "navbar"  40px icon + text side-by-side  (light navbar)
 *   "auth"    52px icon + stacked text       (login / register)
 *   "footer"  38px icon + text side-by-side  (dark footer bg)
 *   "icon"    icon only, no text
 *
 * SVG mark (viewBox 0 0 40 40):
 *   • Large open book — two spread pages with visible crease, ruling lines,
 *     and subtle page-curl at the corners; clearly the dominant shape
 *   • Deep forest green covers hugging the pages
 *   • Bold caramel-gold spine seam
 *   • Small leaf accent at top-right as secondary decoration
 *   • No background rectangle or border
 */

import { Link } from 'react-router-dom';

// ── SVG mark ──────────────────────────────────────────────────────────────────

interface MarkProps {
  size: number;
  onDark?: boolean;
}

function BookMark({ size, onDark = false }: MarkProps) {
  const coverDark  = '#0A3D26';
  const coverMid   = '#0F5132';
  const coverLight = '#186B44';
  const page       = onDark ? '#D8E8D8' : '#FFFCF2';
  const pageShadow = onDark ? '#A8C0A4' : '#E8DCC0';
  const pageRule   = onDark ? '#8AB090' : '#C4A870';
  const spineGold  = '#D4A84B';
  const leafDark   = '#1A5C38';
  const leafLight  = '#3E9662';
  const sparkGold  = '#F5C842';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ════════════════════════════════════════════
          OPEN BOOK — occupies the full icon area
          Viewed slightly from above: two open pages
          spread wide, covers visible at the edges,
          spine crease running top-to-bottom center.
          ════════════════════════════════════════════ */}

      {/* ── LEFT COVER (outside back) ── */}
      {/* Visible left strip of the cover */}
      <path d="M2 8 L20 6 L20 36 L2 34 Z" fill={coverDark}/>
      {/* Cover main tone */}
      <path d="M3 8.5 L20 6.5 L20 35.5 L3 33.5 Z" fill={coverMid}/>
      {/* Cover top-edge highlight */}
      <path d="M3 8.5 L20 6.5 L20 7.5 L3 9.5 Z" fill={coverLight} opacity="0.7"/>
      {/* Cover outer-edge bevel */}
      <path d="M2 8 L3 8.5 L3 33.5 L2 34 Z" fill={coverDark} opacity="0.6"/>

      {/* ── RIGHT COVER (outside back) ── */}
      <path d="M38 8 L20 6 L20 36 L38 34 Z" fill={coverDark}/>
      <path d="M37 8.5 L20 6.5 L20 35.5 L37 33.5 Z" fill={coverMid}/>
      <path d="M37 8.5 L20 6.5 L20 7.5 L37 9.5 Z" fill={coverLight} opacity="0.7"/>
      <path d="M38 8 L37 8.5 L37 33.5 L38 34 Z" fill={coverDark} opacity="0.6"/>

      {/* ── LEFT PAGE ── (ivory, bright) */}
      <path d="M20 7 L4 9 L4 33 L20 35 Z" fill={page}/>
      {/* Page inner shadow near spine */}
      <path d="M20 7 L16 7.6 L16 34.4 L20 35 Z" fill={pageShadow} opacity="0.35"/>

      {/* Ruling lines — left page (5 lines, evenly spaced y 14..30) */}
      <line x1="6"    y1="13.5" x2="18.5" y2="12.5" stroke={pageRule} strokeWidth="0.65" strokeLinecap="round" opacity="0.85"/>
      <line x1="6"    y1="17.5" x2="18.5" y2="16.5" stroke={pageRule} strokeWidth="0.65" strokeLinecap="round" opacity="0.85"/>
      <line x1="6"    y1="21.5" x2="18.5" y2="20.5" stroke={pageRule} strokeWidth="0.65" strokeLinecap="round" opacity="0.75"/>
      <line x1="6"    y1="25.5" x2="18.5" y2="24.5" stroke={pageRule} strokeWidth="0.65" strokeLinecap="round" opacity="0.65"/>
      <line x1="6"    y1="29.5" x2="18.5" y2="28.5" stroke={pageRule} strokeWidth="0.55" strokeLinecap="round" opacity="0.50"/>

      {/* ── RIGHT PAGE ── */}
      <path d="M20 7 L36 9 L36 33 L20 35 Z" fill={page}/>
      {/* Page inner shadow near spine */}
      <path d="M20 7 L24 7.6 L24 34.4 L20 35 Z" fill={pageShadow} opacity="0.35"/>

      {/* Ruling lines — right page */}
      <line x1="21.5" y1="12.5" x2="34"   y2="13.5" stroke={pageRule} strokeWidth="0.65" strokeLinecap="round" opacity="0.85"/>
      <line x1="21.5" y1="16.5" x2="34"   y2="17.5" stroke={pageRule} strokeWidth="0.65" strokeLinecap="round" opacity="0.85"/>
      <line x1="21.5" y1="20.5" x2="34"   y2="21.5" stroke={pageRule} strokeWidth="0.65" strokeLinecap="round" opacity="0.75"/>
      <line x1="21.5" y1="24.5" x2="34"   y2="25.5" stroke={pageRule} strokeWidth="0.65" strokeLinecap="round" opacity="0.65"/>
      <line x1="21.5" y1="28.5" x2="34"   y2="29.5" stroke={pageRule} strokeWidth="0.55" strokeLinecap="round" opacity="0.50"/>

      {/* ── TOP PAGE-EDGE (the arc where pages meet the spine at the top) ── */}
      {/* A gentle upward curve at the top center, showing the page fan */}
      <path d="M4 9 Q20 5 36 9" fill={pageShadow} stroke={pageShadow} strokeWidth="0.4" opacity="0.60"/>

      {/* ── BOTTOM PAGE-EDGE (slight curve) ── */}
      <path d="M4 33 Q20 36 36 33" fill={pageShadow} opacity="0.30"/>

      {/* ── SPINE CREASE — gold, runs full height center ── */}
      <line x1="20" y1="6"  x2="20" y2="36" stroke={spineGold} strokeWidth="2" strokeLinecap="round" opacity="0.90"/>
      {/* Top spine dot accent */}
      <circle cx="20" cy="6.5" r="1.2" fill={spineGold} opacity="0.90"/>
      {/* Bottom spine dot accent */}
      <circle cx="20" cy="35.5" r="0.9" fill={spineGold} opacity="0.70"/>

      {/* ════════════════════════════════════════════
          SMALL LEAF ACCENT — top-right corner, secondary
          (clearly smaller than the book to avoid confusion)
          ════════════════════════════════════════════ */}

      {/* Leaf body */}
      <path
        d="M33 3 C31 1 27.5 1.5 27 4 C26.5 6.5 29 8 31 7 C33 6 34.5 5 33 3 Z"
        fill={leafDark}
      />
      {/* Leaf highlight */}
      <path
        d="M33 3 C31.5 2 29 2.5 28.5 4 C28 5.5 29.5 7 31 7 C32 6.5 33 5.5 33 3 Z"
        fill={leafLight}
        opacity="0.55"
      />
      {/* Leaf vein */}
      <path
        d="M33 3 C31 4 29.5 5 28 6"
        stroke={pageShadow}
        strokeWidth="0.55"
        strokeOpacity="0.70"
        strokeLinecap="round"
        fill="none"
      />

      {/* Gold spark at leaf tip */}
      <line x1="33.5" y1="2.5" x2="33.5" y2="0.5" stroke={sparkGold} strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="33.5" y1="2.5" x2="31.5" y2="1"   stroke={sparkGold} strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="33.5" y1="2.5" x2="35.5" y2="1"   stroke={sparkGold} strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="33.5" cy="2.5" r="0.9" fill={sparkGold}/>
    </svg>
  );
}

// ── Text block ────────────────────────────────────────────────────────────────

interface TextProps {
  brandColor: string;
  taglineColor: string;
  taglineSize: string;
  brandSize: string;
  showTagline: boolean;
}

function BrandText({ brandColor, taglineColor, brandSize, taglineSize, showTagline }: TextProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, userSelect: 'none' }}>
      <span
        style={{
          fontSize: brandSize,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: brandColor,
          fontFamily: 'Georgia, "Times New Roman", serif',
          lineHeight: 1.1,
        }}
      >
        BookHaven
      </span>
      {showTagline && (
        <span
          style={{
            fontSize: taglineSize,
            fontWeight: 500,
            letterSpacing: '0.06em',
            color: taglineColor,
            fontFamily: 'Inter, system-ui, sans-serif',
            marginTop: 3,
            lineHeight: 1,
          }}
        >
          Cozy · Curated · Premium
        </span>
      )}
    </div>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

type LogoVariant = 'navbar' | 'auth' | 'footer' | 'icon';

interface BookHavenLogoProps {
  variant?: LogoVariant;
  href?: string;
  noLink?: boolean;
  className?: string;
}

export default function BookHavenLogo({
  variant = 'navbar',
  href = '/',
  noLink = false,
  className = '',
}: BookHavenLogoProps) {

  const configs: Record<LogoVariant, {
    iconSize: number;
    gap: number;
    brandSize: string;
    taglineSize: string;
    brandColor: string;
    taglineColor: string;
    showTagline: boolean;
    onDark: boolean;
  }> = {
    navbar: {
      iconSize: 40,
      gap: 8,
      brandSize: '17px',
      taglineSize: '10px',
      brandColor: '#0F5132',
      taglineColor: '#5A8060',
      showTagline: true,
      onDark: false,
    },
    auth: {
      iconSize: 52,
      gap: 13,
      brandSize: '23px',
      taglineSize: '12px',
      brandColor: '#0F5132',
      taglineColor: '#5A8060',
      showTagline: true,
      onDark: false,
    },
    footer: {
      iconSize: 38,
      gap: 9,
      brandSize: '16px',
      taglineSize: '10px',
      brandColor: '#FFFFFF',
      taglineColor: '#8FA38A',
      showTagline: true,
      onDark: true,
    },
    icon: {
      iconSize: 36,
      gap: 0,
      brandSize: '0',
      taglineSize: '0',
      brandColor: 'transparent',
      taglineColor: 'transparent',
      showTagline: false,
      onDark: false,
    },
  };

  const c = configs[variant];

  const markup = (
    <>
      <BookMark size={c.iconSize} onDark={c.onDark} />
      {variant !== 'icon' && (
        <BrandText
          brandColor={c.brandColor}
          taglineColor={c.taglineColor}
          brandSize={c.brandSize}
          taglineSize={c.taglineSize}
          showTagline={c.showTagline}
        />
      )}
    </>
  );

  const sharedStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: c.gap,
    flexShrink: 0,
    textDecoration: 'none',
    outline: 'none',  // prevents browser focus ring appearing as black rectangle
  };

  if (noLink) {
    return (
      <span className={className} style={sharedStyle}>
        {markup}
      </span>
    );
  }

  return (
    <Link
      to={href}
      aria-label="BookHaven home"
      className={className}
      style={sharedStyle}
    >
      {markup}
    </Link>
  );
}
