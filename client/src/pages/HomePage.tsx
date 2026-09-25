import { Link } from 'react-router-dom';
import { useListCategoriesQuery, useSearchBooksQuery, useListAuthorsQuery } from '@/store/api/booksApi';
import BookCard from '@/components/books/BookCard';
import Spinner from '@/components/common/Spinner';

// ── Category meta ─────────────────────────────────────────────────────────────
interface CatMeta { icon: string; bg: string; iconBg: string; text: string; accent: string; desc: string }

const CATEGORY_META: Record<string, CatMeta> = {
  'Fiction':               { icon: '📖', bg: '#FDF4EE', iconBg: '#F9DDD0', text: '#3B2409', accent: '#C98268', desc: 'Explore imaginary worlds' },
  'Science Fiction':       { icon: '🚀', bg: '#EEF4FA', iconBg: '#CCE0F5', text: '#1E3A50', accent: '#4A90C4', desc: 'Journey beyond reality' },
  'Horror':                { icon: '🎭', bg: '#F6EEEE', iconBg: '#F0CCCC', text: '#3B0A0A', accent: '#C05050', desc: 'Thrills and chills' },
  'Mystery':               { icon: '🔍', bg: '#F5F0EB', iconBg: '#E8D9C4', text: '#2A1F0E', accent: '#8B6340', desc: 'Unravel the unknown' },
  'Thriller':              { icon: '⚡', bg: '#F2EEF8', iconBg: '#DDD0F0', text: '#1A0A2E', accent: '#7B4FBB', desc: 'Edge-of-seat reads' },
  'Personal Development':  { icon: '🌱', bg: '#EEF4EE', iconBg: '#C8DFC8', text: '#0A2410', accent: '#3F7A3F', desc: 'A better you today' },
  'Self Help':             { icon: '💚', bg: '#EEF4EE', iconBg: '#C8DFC8', text: '#0A2410', accent: '#3F7A3F', desc: 'A better you today' },
  'Romance':               { icon: '❤️', bg: '#FEF0F4', iconBg: '#F5C8D4', text: '#3B0A1A', accent: '#C05070', desc: 'Stories of love and more' },
  'Programming':           { icon: '💻', bg: '#EEF4F4', iconBg: '#C8DFE0', text: '#0A1E24', accent: '#3F7A80', desc: 'Write better code' },
  'Software Engineering':  { icon: '⚙️',  bg: '#EEF4F4', iconBg: '#C8DFE0', text: '#0A1E24', accent: '#3F7A80', desc: 'Build great software' },
  'Programming Languages': { icon: '🖥️', bg: '#EEF4F4', iconBg: '#C8DFE0', text: '#0A1E24', accent: '#3F7A80', desc: 'Master any language' },
  'Data & AI':             { icon: '🤖', bg: '#EEF4FA', iconBg: '#CCE0F5', text: '#1E3A50', accent: '#4A90C4', desc: 'Intelligence & insights' },
};

function getCategoryMeta(name: string): CatMeta {
  return CATEGORY_META[name] ?? { icon: '📚', bg: '#EBF0E9', iconBg: '#CCDBCE', text: '#293B32', accent: '#0F5132', desc: 'Discover great reads' };
}

// ── Author avatar hash ────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#0F5132','#6B8F71','#C98268','#C9A96A','#1A6B44','#5D7258','#D29278','#A8883E'];
function nameHash(s: string): number {
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h);
}

// ── Reading Corner Illustration ───────────────────────────────────────────────
function ReadingCornerIllustration() {
  return (
    <svg
      viewBox="0 0 520 420"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Background warm peach-beige */}
        <linearGradient id="bg2" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#F2E4CF"/>
          <stop offset="100%" stopColor="#E6CFA8"/>
        </linearGradient>
        {/* Wood table */}
        <linearGradient id="tbl2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C88C40"/>
          <stop offset="100%" stopColor="#8C5C18"/>
        </linearGradient>
        {/* Lamp shade */}
        <linearGradient id="shade2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D46A38"/>
          <stop offset="100%" stopColor="#E88A58"/>
        </linearGradient>
        {/* Warm glow */}
        <radialGradient id="glow2" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#FFD060" stopOpacity="0"/>
        </radialGradient>
        {/* Book drop shadows */}
        <filter id="bs2" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#3A1800" floodOpacity="0.30"/>
        </filter>
        <filter id="blur2">
          <feGaussianBlur stdDeviation="2.5"/>
        </filter>
        {/* Page-edge texture gradient (right side of each book) */}
        <linearGradient id="pages1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EDE0C8"/>
          <stop offset="40%" stopColor="#F8F4EC"/>
          <stop offset="70%" stopColor="#EDE0C8"/>
          <stop offset="100%" stopColor="#D8C8A8"/>
        </linearGradient>
        <linearGradient id="pages2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8D8C0"/>
          <stop offset="50%" stopColor="#F5F0E8"/>
          <stop offset="100%" stopColor="#D0C0A0"/>
        </linearGradient>
      </defs>

      {/* ── Background ── */}
      <rect width="520" height="420" fill="url(#bg2)"/>

      {/* ── Warm wall accent panel ── */}
      <rect x="0" y="0" width="520" height="320" fill="#E8CFA0" opacity="0.18"/>

      {/* ── Lamp glow on wall ── */}
      <ellipse cx="462" cy="100" rx="90" ry="76" fill="url(#glow2)" opacity="0.9"/>

      {/* ══════════════════════════════════════════════════ */}
      {/* ── FLOOR LAMP (right side) ── */}
      {/* Pole */}
      <rect x="456" y="120" width="8" height="200" rx="4" fill="#A07838"/>
      {/* Base */}
      <rect x="446" y="315" width="28" height="10" rx="5" fill="#C09050"/>
      <ellipse cx="460" cy="328" rx="22" ry="5" fill="#7A4A10" opacity="0.35"/>
      {/* Shade */}
      <path d="M428 122 L492 122 L480 78 L440 78 Z" fill="url(#shade2)"/>
      <path d="M441 78 L446 122 L451 122 L447 78 Z" fill="white" opacity="0.18"/>
      <path d="M430 122 L490 122 L478 82 L442 82 Z" fill="#F0A070" opacity="0.38"/>
      <ellipse cx="460" cy="126" rx="36" ry="11" fill="#FFD060" opacity="0.45" filter="url(#blur2)"/>
      <line x1="428" y1="122" x2="492" y2="122" stroke="#FFD060" strokeWidth="2" opacity="0.5"/>

      {/* ══════════════════════════════════════════════════ */}
      {/* ── WALL POSTER (framed) — upper left area ── */}
      <rect x="18" y="20" width="96" height="88" rx="7" fill="#C9924A"/>
      <rect x="24" y="26" width="84" height="76" rx="5" fill="#FDF6EC"/>
      <text x="66" y="52"  textAnchor="middle" fill="#0F5132" fontSize="11" fontWeight="800" fontFamily="Georgia,serif">READ</text>
      <text x="66" y="66"  textAnchor="middle" fill="#0F5132" fontSize="11" fontWeight="800" fontFamily="Georgia,serif">MORE</text>
      <text x="66" y="80"  textAnchor="middle" fill="#0F5132" fontSize="10" fontWeight="700" fontFamily="Georgia,serif">BE KIND</text>
      <text x="66" y="93" textAnchor="middle" fill="#5A7A40" fontSize="8.5" fontWeight="600" fontFamily="Georgia,serif">STAY CURIOUS</text>
      <line x1="34" y1="97" x2="98" y2="97" stroke="#C9A96A" strokeWidth="1.5" opacity="0.9"/>

      {/* ══════════════════════════════════════════════════ */}
      {/* ── LARGE POTTED PLANT — far left ── */}
      <ellipse cx="44" cy="354" rx="28" ry="6" fill="#6B4010" opacity="0.22"/>
      <path d="M22 322 Q20 350 44 350 Q68 350 66 322 Z" fill="#A07040"/>
      <rect x="28" y="315" width="32" height="9" rx="4" fill="#C09050"/>
      <rect x="28" y="315" width="32" height="3" rx="2" fill="#D4A870" opacity="0.50"/>
      <path d="M44 315 C30 288 10 264 -2 228 C16 248 36 275 44 296 Z" fill="#3D7025" opacity="0.95"/>
      <path d="M44 315 C58 286 78 262 92 226 C74 248 58 274 44 296 Z" fill="#2A5218" opacity="0.95"/>
      <path d="M44 302 C26 274 8 250 -4 212 C14 234 32 262 44 282 Z" fill="#4E8C30" opacity="0.82"/>
      <path d="M44 302 C62 272 84 248 98 210 C78 232 60 260 44 282 Z" fill="#3D7025" opacity="0.82"/>
      <line x1="44" y1="315" x2="0" y2="232" stroke="#1A4010" strokeWidth="1" opacity="0.30"/>
      <line x1="44" y1="315" x2="90" y2="230" stroke="#1A4010" strokeWidth="1" opacity="0.30"/>

      {/* ══════════════════════════════════════════════════ */}
      {/* ── TABLE ── */}
      <rect x="20" y="318" width="480" height="20" rx="5" fill="url(#tbl2)"/>
      <rect x="20" y="318" width="480" height="5" rx="3" fill="#D4A050" opacity="0.35"/>
      <rect x="20" y="336" width="480" height="3" rx="1" fill="#6B3C08" opacity="0.15"/>
      {/* Legs */}
      <rect x="46"  y="338" width="12" height="36" rx="4" fill="#8C5C18"/>
      <rect x="462" y="338" width="12" height="36" rx="4" fill="#8C5C18"/>

      {/* ══════════════════════════════════════════════════ */}
      {/*
          ── BOOK STACK (upright books side-by-side, spines facing viewer) ──
          Each book has:
            • spine (left, narrow, darker)
            • front cover (main body, lighter shade)
            • page-edge block (right side, cream/off-white)
            • top edge line
            • decorative details on spine
          Books are arranged left→right, slightly varied heights.
          Stack sits ON the table top (y=318) so book bottoms = 318.
          Centre region: x 145 → 430, width ≈ 285
      */}

      {/* ── Stack cast shadow ── */}
      <ellipse cx="290" cy="320" rx="145" ry="7" fill="#3A1800" opacity="0.18" filter="url(#blur2)"/>

      {/* ─────────────────────────────────── */}
      {/* BOOK A — Forest Green (leftmost, tallest) */}
      {/* height=188, width=42 */}
      {/* spine x=145..159, cover x=159..181, pages x=181..187 */}
      {/* bottom y=318, top y=130 */}

      {/* Spine */}
      <rect x="145" y="130" width="14" height="188" rx="3" fill="#1B5E35"/>
      <rect x="145" y="130" width="14" height="5"   rx="2" fill="#2D8A52"/>
      <rect x="145" y="313" width="14" height="5"   fill="#0F3D22"/>
      {/* Cover */}
      <rect x="159" y="130" width="38" height="188" rx="0" fill="#2A7A45" filter="url(#bs2)"/>
      {/* Cover highlight */}
      <rect x="159" y="130" width="38" height="188" fill="none" stroke="#3D9660" strokeWidth="1" opacity="0.5"/>
      {/* Cover inner panel */}
      <rect x="164" y="140" width="28" height="168" rx="2" fill="#1E6B3C" opacity="0.35"/>
      {/* Page edges */}
      <rect x="197" y="132" width="6" height="184" fill="url(#pages1)"/>
      {/* Page lines */}
      <line x1="197" y1="145" x2="203" y2="145" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="160" x2="203" y2="160" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="175" x2="203" y2="175" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="190" x2="203" y2="190" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="205" x2="203" y2="205" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="220" x2="203" y2="220" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="235" x2="203" y2="235" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="250" x2="203" y2="250" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="265" x2="203" y2="265" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="280" x2="203" y2="280" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="197" y1="295" x2="203" y2="295" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      {/*
        ── BOOK A decoration — Forest Green ──
        Cover: x=159..197, center-x=178, mid-y=224. No text.
        Design: thin gold inner border + centered diamond emblem + bookmark ribbon.
      */}
      {/* Spine top/bottom rule lines */}
      <line x1="147" y1="147" x2="157" y2="147" stroke="#A8D8B8" strokeWidth="1" opacity="0.7"/>
      <line x1="147" y1="311" x2="157" y2="311" stroke="#A8D8B8" strokeWidth="1" opacity="0.7"/>
      {/* Gold inner border on cover face */}
      <rect x="163" y="138" width="30" height="172" rx="2"
        fill="none" stroke="#C9A96A" strokeWidth="0.8" opacity="0.50"/>
      {/* Thin horizontal rule near top of cover */}
      <line x1="166" y1="148" x2="190" y2="148" stroke="#C9A96A" strokeWidth="0.7" opacity="0.55"/>
      {/* Diamond emblem — center of cover */}
      {/* Diamond: center (178, 224), half-width 9, half-height 11 */}
      <polygon points="178,213 187,224 178,235 169,224"
        fill="none" stroke="#C9A96A" strokeWidth="1" opacity="0.60"/>
      {/* Inner diamond (smaller) */}
      <polygon points="178,218 183,224 178,230 173,224"
        fill="#C9A96A" opacity="0.20"/>
      {/* Center dot */}
      <circle cx="178" cy="224" r="1.5" fill="#C9A96A" opacity="0.55"/>
      {/* Thin horizontal rule near bottom */}
      <line x1="166" y1="300" x2="190" y2="300" stroke="#C9A96A" strokeWidth="0.7" opacity="0.55"/>
      {/* Bookmark ribbon */}
      <path d="M163 130 L168 130 L168 158 L165.5 155 L163 158 Z" fill="#F5C040"/>

      {/* ─────────────────────────────────── */}
      {/* BOOK B — Navy Blue */}
      {/* height=172, width=38 */}
      {/* spine x=203..215, cover x=215..249, pages x=249..254 */}
      {/* bottom y=318, top y=146 */}

      <rect x="203" y="146" width="12" height="172" rx="3" fill="#0E2A5C"/>
      <rect x="203" y="146" width="12" height="5"   rx="2" fill="#1A4898"/>
      <rect x="203" y="313" width="12" height="5"   fill="#08163A"/>
      <rect x="215" y="146" width="34" height="172" rx="0" fill="#1C3E7A" filter="url(#bs2)"/>
      <rect x="215" y="146" width="34" height="172" fill="none" stroke="#2A5AAA" strokeWidth="1" opacity="0.5"/>
      {/* Gold decorative border on cover */}
      <rect x="219" y="155" width="26" height="154" rx="2" fill="none" stroke="#C9A96A" strokeWidth="1" opacity="0.55"/>
      <rect x="249" y="148" width="5" height="168" fill="url(#pages2)"/>
      <line x1="249" y1="160" x2="254" y2="160" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="249" y1="178" x2="254" y2="178" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="249" y1="196" x2="254" y2="196" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="249" y1="214" x2="254" y2="214" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="249" y1="232" x2="254" y2="232" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="249" y1="250" x2="254" y2="250" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="249" y1="268" x2="254" y2="268" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="249" y1="286" x2="254" y2="286" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="249" y1="304" x2="254" y2="304" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      {/*
        ── BOOK B decoration — Navy Blue ──
        Cover: x=215..249, center-x=232, mid-y=232. No text.
        Design: existing gold inner border + a six-pointed star emblem at center.
      */}
      {/* Spine dots — decorative */}
      <circle cx="209" cy="200" r="1.4" fill="#8AAAD8" opacity="0.45"/>
      <circle cx="209" cy="218" r="1.4" fill="#8AAAD8" opacity="0.45"/>
      <circle cx="209" cy="236" r="1.4" fill="#8AAAD8" opacity="0.45"/>
      <circle cx="209" cy="254" r="1.4" fill="#8AAAD8" opacity="0.45"/>
      <circle cx="209" cy="272" r="1.4" fill="#8AAAD8" opacity="0.45"/>
      <line x1="205" y1="162" x2="213" y2="162" stroke="#8AAAD8" strokeWidth="1" opacity="0.7"/>
      <line x1="205" y1="312" x2="213" y2="312" stroke="#8AAAD8" strokeWidth="1" opacity="0.7"/>
      {/* Six-pointed star (two overlapping triangles) at cover center */}
      {/* Center (232, 232), size r=9 */}
      <polygon points="232,221 240,236 224,236"
        fill="none" stroke="#C9A96A" strokeWidth="0.9" opacity="0.65"/>
      <polygon points="232,243 240,228 224,228"
        fill="none" stroke="#C9A96A" strokeWidth="0.9" opacity="0.65"/>
      {/* Center dot */}
      <circle cx="232" cy="232" r="1.5" fill="#C9A96A" opacity="0.50"/>
      {/* Horizontal accent lines above and below star */}
      <line x1="222" y1="218" x2="242" y2="218" stroke="#8AAAD8" strokeWidth="0.6" opacity="0.40"/>
      <line x1="222" y1="246" x2="242" y2="246" stroke="#8AAAD8" strokeWidth="0.6" opacity="0.40"/>

      {/* ─────────────────────────────────── */}
      {/* BOOK C — Terracotta / Burnt Orange */}
      {/* height=182, width=44 */}
      {/* spine x=254..268, cover x=268..310, pages x=310..316 */}
      {/* bottom y=318, top y=136 */}

      <rect x="254" y="136" width="14" height="182" rx="3" fill="#8C2808"/>
      <rect x="254" y="136" width="14" height="5"   rx="2" fill="#C04020"/>
      <rect x="254" y="313" width="14" height="5"   fill="#5A1800"/>
      <rect x="268" y="136" width="42" height="182" rx="0" fill="#C84820" filter="url(#bs2)"/>
      <rect x="268" y="136" width="42" height="182" fill="none" stroke="#E06840" strokeWidth="1" opacity="0.5"/>
      {/* Simple circular medallion on cover */}
      <circle cx="289" cy="218" r="14" fill="#A83810" opacity="0.55"/>
      <circle cx="289" cy="218" r="11" fill="none" stroke="#F0A070" strokeWidth="1" opacity="0.60"/>
      <rect x="310" y="138" width="6" height="178" fill="url(#pages1)"/>
      <line x1="310" y1="152" x2="316" y2="152" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="310" y1="170" x2="316" y2="170" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="310" y1="188" x2="316" y2="188" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="310" y1="206" x2="316" y2="206" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="310" y1="224" x2="316" y2="224" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="310" y1="242" x2="316" y2="242" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="310" y1="260" x2="316" y2="260" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="310" y1="278" x2="316" y2="278" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="310" y1="296" x2="316" y2="296" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      {/*
        ── BOOK C decoration — Terracotta ──
        Cover: x=268..310, center-x=289. No text.
        Design: refined circular medallion + thin gold border + accent lines.
        Existing circle at (289,218) r=14 outer, r=11 inner already present.
        Add a third innermost circle and thin top/bottom rules on cover.
      */}
      {/* Third inner circle — smallest */}
      <circle cx="289" cy="218" r="5" fill="none" stroke="#F0A070" strokeWidth="0.8" opacity="0.55"/>
      {/* Center dot of medallion */}
      <circle cx="289" cy="218" r="1.5" fill="#F0A070" opacity="0.60"/>
      {/* Thin horizontal rule above medallion on cover */}
      <line x1="272" y1="155" x2="306" y2="155" stroke="#F0A070" strokeWidth="0.7" opacity="0.50"/>
      {/* Thin horizontal rule below medallion on cover */}
      <line x1="272" y1="282" x2="306" y2="282" stroke="#F0A070" strokeWidth="0.7" opacity="0.50"/>
      {/* Spine top/bottom rules */}
      <line x1="256" y1="152" x2="266" y2="152" stroke="#E8A080" strokeWidth="1" opacity="0.7"/>
      <line x1="256" y1="312" x2="266" y2="312" stroke="#E8A080" strokeWidth="1" opacity="0.7"/>

      {/* ─────────────────────────────────── */}
      {/* BOOK D — Deep Teal */}
      {/* height=168, width=38 */}
      {/* spine x=316..328, cover x=328..362, pages x=362..368 */}
      {/* bottom y=318, top y=150 */}

      <rect x="316" y="150" width="12" height="168" rx="3" fill="#0D4848"/>
      <rect x="316" y="150" width="12" height="5"   rx="2" fill="#1A7878"/>
      <rect x="316" y="313" width="12" height="5"   fill="#082E2E"/>
      <rect x="328" y="150" width="34" height="168" rx="0" fill="#1A6B6B" filter="url(#bs2)"/>
      <rect x="328" y="150" width="34" height="168" fill="none" stroke="#2A9090" strokeWidth="1" opacity="0.5"/>
      {/* Cover detail — small horizontal bands */}
      <rect x="332" y="165" width="26" height="3" rx="1" fill="#2A9090" opacity="0.50"/>
      <rect x="332" y="175" width="26" height="3" rx="1" fill="#2A9090" opacity="0.35"/>
      <rect x="362" y="152" width="6" height="164" fill="url(#pages2)"/>
      <line x1="362" y1="165" x2="368" y2="165" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="362" y1="182" x2="368" y2="182" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="362" y1="199" x2="368" y2="199" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="362" y1="216" x2="368" y2="216" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="362" y1="233" x2="368" y2="233" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="362" y1="250" x2="368" y2="250" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="362" y1="267" x2="368" y2="267" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="362" y1="284" x2="368" y2="284" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="362" y1="301" x2="368" y2="301" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      {/*
        ── BOOK D decoration — Deep Teal ──
        Cover: x=328..362, center-x=345, mid-y=234. No text.
        Design: three evenly-spaced horizontal rules (top, mid, bottom of cover)
        + a small leaf-shaped path centered on the cover.
      */}
      {/* Spine dashes — decorative */}
      <line x1="319" y1="190" x2="325" y2="190" stroke="#60C0B8" strokeWidth="1.2" opacity="0.45"/>
      <line x1="319" y1="207" x2="325" y2="207" stroke="#60C0B8" strokeWidth="1.2" opacity="0.45"/>
      <line x1="319" y1="224" x2="325" y2="224" stroke="#60C0B8" strokeWidth="1.2" opacity="0.45"/>
      <line x1="319" y1="241" x2="325" y2="241" stroke="#60C0B8" strokeWidth="1.2" opacity="0.45"/>
      <line x1="319" y1="258" x2="325" y2="258" stroke="#60C0B8" strokeWidth="1.2" opacity="0.45"/>
      <line x1="319" y1="275" x2="325" y2="275" stroke="#60C0B8" strokeWidth="1.2" opacity="0.45"/>
      <line x1="318" y1="166" x2="326" y2="166" stroke="#60C0B8" strokeWidth="1" opacity="0.7"/>
      <line x1="318" y1="312" x2="326" y2="312" stroke="#60C0B8" strokeWidth="1" opacity="0.7"/>
      {/* Three horizontal rules on cover face */}
      <line x1="332" y1="165" x2="358" y2="165" stroke="#60C0B8" strokeWidth="0.8" opacity="0.45"/>
      <line x1="332" y1="234" x2="358" y2="234" stroke="#60C0B8" strokeWidth="0.8" opacity="0.45"/>
      <line x1="332" y1="303" x2="358" y2="303" stroke="#60C0B8" strokeWidth="0.8" opacity="0.45"/>
      {/* Small leaf emblem centered on cover (345, 234) */}
      {/* Leaf: elongated teardrop pointing up, height=18, width=10 */}
      <path d="M345,222 C341,226 340,232 343,237 C346,242 349,237 348,232 C347,227 345,222 345,222 Z"
        fill="none" stroke="#A0D8D0" strokeWidth="0.9" opacity="0.55"/>
      {/* Leaf vein */}
      <line x1="345" y1="222" x2="344" y2="236" stroke="#A0D8D0" strokeWidth="0.5" opacity="0.40"/>

      {/* ─────────────────────────────────── */}
      {/* BOOK E — Deep Navy / Gold (IKIGAI) */}
      {/* height=160, width=36 */}
      {/* spine x=368..380, cover x=380..412, pages x=412..418 */}
      {/* bottom y=318, top y=158 */}

      <rect x="368" y="158" width="12" height="160" rx="3" fill="#0C1A42"/>
      <rect x="368" y="158" width="12" height="5"   rx="2" fill="#1A3898"/>
      <rect x="368" y="313" width="12" height="5"   fill="#06102A"/>
      <rect x="380" y="158" width="32" height="160" rx="0" fill="#1A2E60" filter="url(#bs2)"/>
      <rect x="380" y="158" width="32" height="160" fill="none" stroke="#2A4898" strokeWidth="1" opacity="0.5"/>
      {/* Gold circle motif on cover */}
      <circle cx="396" cy="235" r="12" fill="none" stroke="#F5C040" strokeWidth="1.5" opacity="0.65"/>
      <circle cx="396" cy="235" r="6"  fill="none" stroke="#F5C040" strokeWidth="1" opacity="0.45"/>
      <rect x="412" y="160" width="6" height="156" fill="url(#pages1)"/>
      <line x1="412" y1="172" x2="418" y2="172" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="412" y1="188" x2="418" y2="188" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="412" y1="204" x2="418" y2="204" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="412" y1="220" x2="418" y2="220" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="412" y1="236" x2="418" y2="236" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="412" y1="252" x2="418" y2="252" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="412" y1="268" x2="418" y2="268" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="412" y1="284" x2="418" y2="284" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      <line x1="412" y1="300" x2="418" y2="300" stroke="#C8B890" strokeWidth="0.5" opacity="0.6"/>
      {/*
        ── BOOK E decoration — Deep Navy ──
        Cover: x=380..412, center-x=396, mid-y=238. No text.
        Design: existing concentric gold circles (already in SVG above) + a cross-hair
        accent + thin top/bottom rules on cover.
      */}
      {/* Thin horizontal rule near top of cover */}
      <line x1="383" y1="168" x2="409" y2="168" stroke="#C9A040" strokeWidth="0.7" opacity="0.45"/>
      {/* Cross-hair marks through the circle center (396, 235) */}
      <line x1="388" y1="235" x2="393" y2="235" stroke="#C9A040" strokeWidth="0.7" opacity="0.40"/>
      <line x1="399" y1="235" x2="404" y2="235" stroke="#C9A040" strokeWidth="0.7" opacity="0.40"/>
      <line x1="396" y1="227" x2="396" y2="232" stroke="#C9A040" strokeWidth="0.7" opacity="0.40"/>
      <line x1="396" y1="238" x2="396" y2="243" stroke="#C9A040" strokeWidth="0.7" opacity="0.40"/>
      {/* Thin horizontal rule near bottom of cover */}
      <line x1="383" y1="306" x2="409" y2="306" stroke="#C9A040" strokeWidth="0.7" opacity="0.45"/>
      {/* Spine top/bottom rules */}
      <line x1="370" y1="174" x2="378" y2="174" stroke="#C9A040" strokeWidth="1" opacity="0.7"/>
      <line x1="370" y1="312" x2="378" y2="312" stroke="#C9A040" strokeWidth="1" opacity="0.7"/>

      {/* ─────────────────────────────────── */}
      {/* BOOK F — Cream / Wine (SAPIENS, rightmost) */}
      {/* height=175, width=40 */}
      {/* spine x=418..430, cover x=430..448, pages x=0 (right edge cut) */}
      {/* bottom y=318, top y=143 */}

      <rect x="418" y="143" width="12" height="175" rx="3" fill="#8C1818"/>
      <rect x="418" y="143" width="12" height="5"   rx="2" fill="#C02020"/>
      <rect x="418" y="313" width="12" height="5"   fill="#5A0808"/>
      <rect x="430" y="143" width="28" height="175" rx="0" fill="#FAF0E0" filter="url(#bs2)"/>
      <rect x="430" y="143" width="28" height="175" fill="none" stroke="#D8C8A8" strokeWidth="1" opacity="0.6"/>
      {/* Cover detail — thin rule lines (like endpapers) */}
      <rect x="434" y="152" width="20" height="1.5" rx="0.5" fill="#C8A060" opacity="0.50"/>
      <rect x="434" y="157" width="20" height="1.5" rx="0.5" fill="#C8A060" opacity="0.35"/>
      <rect x="434" y="300" width="20" height="1.5" rx="0.5" fill="#C8A060" opacity="0.50"/>
      <rect x="434" y="306" width="20" height="1.5" rx="0.5" fill="#C8A060" opacity="0.35"/>
      {/*
        ── BOOK F decoration — Cream ──
        Cover: x=430..458, center-x=444, mid-y=230. No text.
        Design: endpaper-style stacked rules (4 near top, 4 near bottom) + a small
        oval cameo in the center — classic premium hardcover look.
      */}
      {/* Mid-cover rules (existing top/bottom pairs already rendered above) */}
      <rect x="434" y="220" width="20" height="1"   rx="0.5" fill="#C8A060" opacity="0.35"/>
      <rect x="434" y="225" width="20" height="0.8" rx="0.5" fill="#C8A060" opacity="0.22"/>
      <rect x="434" y="234" width="20" height="0.8" rx="0.5" fill="#C8A060" opacity="0.22"/>
      <rect x="434" y="239" width="20" height="1"   rx="0.5" fill="#C8A060" opacity="0.35"/>
      {/* Small oval cameo at vertical center */}
      <ellipse cx="444" cy="230" rx="7" ry="9"
        fill="none" stroke="#C8A060" strokeWidth="0.8" opacity="0.45"/>
      {/* Center dot */}
      <circle cx="444" cy="230" r="1.5" fill="#C8A060" opacity="0.35"/>
      {/* Spine top/bottom rules */}
      <line x1="420" y1="159" x2="428" y2="159" stroke="#C05050" strokeWidth="1" opacity="0.7"/>
      <line x1="420" y1="312" x2="428" y2="312" stroke="#C05050" strokeWidth="1" opacity="0.7"/>

      {/* ══════════════════════════════════════════════════ */}
      {/* ── MUG — forest green, left of books ── */}
      <ellipse cx="115" cy="320" rx="30" ry="5" fill="#2A4010" opacity="0.16"/>
      {/* Body */}
      <rect x="90" y="265" width="50" height="52" rx="10" fill="#1A6B40"/>
      <rect x="90" y="265" width="9"  height="52" rx="9"  fill="#2A8850" opacity="0.42"/>
      {/* Rim */}
      <rect x="90" y="265" width="50" height="7"  rx="4"  fill="#2A8850"/>
      {/* Handle */}
      <path d="M140 277 Q160 277 160 293 Q160 309 140 309" fill="none" stroke="#2A8850" strokeWidth="7" strokeLinecap="round"/>
      <path d="M140 280 Q157 280 157 293 Q157 306 140 306" fill="none" stroke="#3A9860" strokeWidth="2.5" strokeLinecap="round" opacity="0.45"/>
      {/* Mug text */}
      <text x="115" y="289" textAnchor="middle" fill="#F5C040" fontSize="7.5" fontWeight="700" fontFamily="Georgia,serif">A Better</text>
      <text x="115" y="301" textAnchor="middle" fill="#F5C040" fontSize="7.5" fontWeight="700" fontFamily="Georgia,serif">You Today</text>
      {/* Steam */}
      <path d="M102 261 Q98 251 102 241 Q106 231 101 221" fill="none" stroke="#9FC8B0" strokeWidth="1.8" strokeLinecap="round" opacity="0.50"/>
      <path d="M115 259 Q111 249 115 239 Q119 229 114 219" fill="none" stroke="#9FC8B0" strokeWidth="1.8" strokeLinecap="round" opacity="0.42"/>
      <path d="M128 261 Q124 251 128 241 Q132 231 127 221" fill="none" stroke="#9FC8B0" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>

      {/* ══════════════════════════════════════════════════ */}
      {/* ── SMALL DESK PLANT — right of lamp base area ── */}
      {/* (moved to between mug and books so it doesn't cover books) */}
      {/* Actually place it far left near big plant area */}
      {/* Position: x≈76, on table */}
      <ellipse cx="76" cy="320" rx="14" ry="3" fill="#6B3C08" opacity="0.18"/>
      <path d="M64 300 Q62 318 76 318 Q90 318 88 300 Z" fill="#B07840"/>
      <rect x="68" y="295" width="16" height="7" rx="3" fill="#C89050"/>
      <path d="M76 295 C68 282 60 269 56 254 C66 266 74 281 76 290 Z" fill="#3D7025" opacity="0.92"/>
      <path d="M76 295 C84 282 92 267 96 252 C86 265 78 281 76 290 Z" fill="#2A5218" opacity="0.92"/>
      <path d="M76 288 C66 275 58 263 54 246 C64 259 72 274 76 284 Z" fill="#4E8C30" opacity="0.78"/>

      {/* ══════════════════════════════════════════════════ */}
      {/*
        ── QUOTE CARD ──
        Card: x=160, y=38, width=150, height=82  → right=310, bottom=120
        True center-x = 160 + 75 = 235
        Content zone (12px padding): x 172..298, y 50..108
        Layout:
          • Small leaf accent: top-left corner (173, 50), purely decorative
          • Line 1 "Books make a"          y=64  (center of text row)
          • Line 2 "kinder, brighter you." y=78
          • Thin gold rule                  y=88
          • Attribution "— BookHaven"       y=99
      */}
      {/* Card background */}
      <rect x="160" y="38" width="150" height="82" rx="12" fill="white" opacity="0.96"/>
      {/* Card border */}
      <rect x="160" y="38" width="150" height="82" rx="12" fill="none" stroke="#DDD0B8" strokeWidth="1.5"/>
      {/* Subtle drop shadow hint (painted behind, same color slightly offset) */}
      <rect x="162" y="41" width="150" height="82" rx="12" fill="#C8B898" opacity="0.10"/>

      {/* Small leaf accent — top-left corner, small so it doesn't shift text */}
      <circle cx="174" cy="52" r="6" fill="#D8EED8"/>
      <path d="M174 57 C171.5 52 170 47 172 43.5 C173.5 40.5 177 41 177.5 44 C178 47 176 52 174 57 Z" fill="#2D7A28"/>
      {/* Tiny vein */}
      <line x1="174" y1="57" x2="172" y2="46" stroke="#7ECBA1" strokeWidth="0.5" strokeOpacity="0.7"/>

      {/* Quote line 1 — centered on card center-x=235 */}
      <text
        x="235" y="64"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#1A2A1A"
        fontSize="9.5"
        fontWeight="700"
        fontFamily="Georgia,serif"
        letterSpacing="0.3"
      >Books make a</text>

      {/* Quote line 2 */}
      <text
        x="235" y="79"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#2A3A2A"
        fontSize="9.5"
        fontWeight="400"
        fontFamily="Georgia,serif"
        fontStyle="italic"
        letterSpacing="0.2"
      >kinder, brighter you.</text>

      {/* Thin decorative rule between quote and attribution */}
      <line x1="210" y1="90" x2="260" y2="90" stroke="#D4A84B" strokeWidth="0.8" opacity="0.55"/>

      {/* Attribution */}
      <text
        x="235" y="101"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#C9A040"
        fontSize="8"
        fontWeight="500"
        fontFamily="Georgia,serif"
        letterSpacing="0.5"
      >— BookHaven</text>

      {/* ══════════════════════════════════════════════════ */}
      {/* ── CORNER BOTANICAL LEAVES ── */}
      <path d="M0 60 C18 38 42 16 68 4 C50 26 26 50 4 72 Z" fill="#2D7A28" opacity="0.40"/>
      <path d="M0 84 C22 58 50 34 78 18 C58 44 32 68 6 94 Z" fill="#1A5218" opacity="0.28"/>
      <path d="M0 340 C16 320 34 305 54 298 C40 312 24 328 2 348 Z" fill="#2D7A28" opacity="0.35"/>
      <path d="M0 362 C12 348 26 337 44 333 C30 344 16 357 0 372 Z" fill="#1A5218" opacity="0.24"/>
    </svg>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useSearchBooksQuery({
    sort: 'averageRating,desc', size: 8, inStockOnly: true,
  });
  const { data: newArrivals, isLoading: newLoading } = useSearchBooksQuery({
    sort: 'publishedDate,desc', size: 4, inStockOnly: true,
  });
  const { data: categories } = useListCategoriesQuery();
  const { data: authors } = useListAuthorsQuery();
  const topCategories = (categories ?? []).filter((c) => !c.parentId).slice(0, 8);
  const featuredAuthors = (authors ?? []).filter((a) => a.bookCount > 0).slice(0, 6);

  return (
    <div className="space-y-14">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8"
        style={{ backgroundColor: '#F5EBDD' }}
      >
        <div
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2"
          style={{ minHeight: 420 }}
        >
          {/* ── Left: editorial text panel ── */}
          <div
            className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 sm:py-14"
            style={{ backgroundColor: '#FAF5EC' }}
          >
            {/* Top badge */}
            <div
              className="inline-flex items-center gap-2 self-start rounded-full px-3.5 py-1.5 mb-5"
              style={{
                backgroundColor: '#FBF6EC',
                border: '1px solid #D4A84B',
                color: '#7A5528',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
              }}
            >
              {/* Gold leaf icon — decorative */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 11 C4.2 8 2 5 3.5 2.8 C5 0.8 8.5 1.5 8.5 4.2 C8.5 6.8 6 9.2 6 11Z" fill="#C9A96A"/>
                <line x1="6" y1="11" x2="6" y2="5" stroke="#A8883E" strokeWidth="0.8"/>
              </svg>
              Discover · Learn · Grow
            </div>

            {/* Main heading — single h1 with two styled lines */}
            <h1
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(2.4rem, 5.5vw, 3.6rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                marginBottom: '1rem',
              }}
            >
              <span style={{ color: '#0F5132', display: 'block' }}>Find Your Next</span>
              <span style={{ color: '#C85C3A', display: 'block' }}>Great Read</span>
            </h1>

            <p
              className="leading-relaxed mb-7"
              style={{
                fontSize: 'clamp(0.92rem, 1.5vw, 1.05rem)',
                color: '#2E4A3E',
                maxWidth: 380,
              }}
            >
              Explore thousands of books across every genre — Fiction, Horror,
              Sci-Fi, Personal Development, and more.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 font-semibold text-sm text-white rounded-xl px-6 py-3 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F5132]"
                style={{ backgroundColor: '#0F5132' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A3D26')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0F5132')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
                Browse Books →
              </Link>
              <Link
                to="/browse?sort=averageRating,desc"
                className="inline-flex items-center gap-2 font-semibold text-sm rounded-xl px-6 py-3 border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D4A84B]"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#D4A84B', color: '#0F5132' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FBF6EC')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#C9A96A' }} aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Best Sellers
              </Link>
            </div>

            {/* Stats row */}
            <div
              className="flex flex-wrap gap-5 pt-5"
              style={{ borderTop: '1px solid #D8C8A8' }}
            >
              {[
                {
                  value: '40+', label: 'Books',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ color: '#0F5132' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                    </svg>
                  ),
                },
                {
                  value: '10', label: 'Categories',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ color: '#0F5132' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
                    </svg>
                  ),
                },
                {
                  value: '4.7★', label: 'Avg Rating',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#C9A96A' }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ),
                },
                {
                  value: 'Free', label: 'Ship ₹4K+',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ color: '#0F5132' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                    </svg>
                  ),
                },
              ].map(({ value, label, icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="flex-shrink-0">{icon}</span>
                  <div>
                    <p
                      className="font-bold leading-tight"
                      style={{ fontSize: '0.95rem', color: '#1A2E22', fontFamily: 'Georgia,serif' }}
                    >
                      {value}
                    </p>
                    <p className="text-xs" style={{ color: '#5A6B5E' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: illustration panel ── */}
          <div
            className="hidden lg:block overflow-hidden relative"
            style={{ backgroundColor: '#EDD9C3', minHeight: 420 }}
          >
            {/* SVG is absolutely positioned to fill from bottom */}
            <div className="absolute inset-0 flex items-end justify-center">
              <ReadingCornerIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── Browse by Category ────────────────────────────────────── */}
      {topCategories.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: '#1A2E22', fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Browse by Category
              </h2>
              <p className="text-sm mt-1" style={{ color: '#68736B' }}>Explore genres that match your mood</p>
            </div>
            <Link
              to="/browse"
              className="text-sm font-semibold transition-colors hover:underline flex items-center gap-1"
              style={{ color: '#0F5132' }}
            >
              View All →
            </Link>
          </div>

          {/* Horizontal scrollable single row */}
          <div
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          >
            {topCategories.map((cat) => {
              const meta = getCategoryMeta(cat.name);
              return (
                <Link
                  key={cat.id}
                  to={`/browse?categoryId=${cat.id}`}
                  className="group rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 shrink-0"
                  style={{
                    backgroundColor: meta.bg,
                    border: `1px solid ${meta.accent}25`,
                    minWidth: 205,
                    maxWidth: 245,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: meta.iconBg }}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight" style={{ color: meta.text }}>{cat.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: meta.accent, opacity: 0.9 }}>{meta.desc}</p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${meta.accent}20` }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ color: meta.accent }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Best Sellers ──────────────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1A2E22', fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Best Sellers
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#68736B' }}>Highest rated by our community</p>
          </div>
          <Link to="/browse?sort=averageRating,desc" className="text-sm font-semibold hover:underline transition-colors" style={{ color: '#0F5132' }}>
            See all →
          </Link>
        </div>
        {featuredLoading ? (
          <div className="flex items-center justify-center py-20"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featured?.content.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────── */}
      <section
        className="rounded-3xl p-6 sm:p-8"
        style={{ backgroundColor: '#F5EBDD', border: '1px solid #E8DECE' }}
      >
        <div className="flex items-end justify-between mb-5">
          <div>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2"
              style={{ backgroundColor: '#EBF0E9', color: '#0F5132' }}
            >
              🌿 New this season
            </span>
            <h2 className="text-2xl font-bold" style={{ color: '#1A2E22', fontFamily: 'Georgia, "Times New Roman", serif' }}>
              New Arrivals
            </h2>
          </div>
          <Link to="/browse?sort=publishedDate,desc" className="text-sm font-semibold hover:underline transition-colors" style={{ color: '#0F5132' }}>
            See all →
          </Link>
        </div>
        {newLoading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newArrivals?.content.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </section>

      {/* ── Featured Authors ──────────────────────────────────────── */}
      {featuredAuthors.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#1A2E22', fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Featured Authors
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#68736B' }}>Meet the writers behind the books</p>
            </div>
            <Link to="/authors" className="text-sm font-semibold hover:underline transition-colors" style={{ color: '#0F5132' }}>
              All authors →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredAuthors.map((author) => {
              const bg = AVATAR_COLORS[nameHash(author.name) % AVATAR_COLORS.length];
              const initials = author.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const primaryGenre = author.genre?.split(',')[0].trim() ?? '';
              return (
                <Link
                  key={author.id}
                  to={`/authors/${author.id}`}
                  className="group bg-white rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                  style={{ border: '1px solid #EDE7DC' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white select-none mb-3 shadow-sm"
                    style={{ backgroundColor: bg }}
                  >
                    {initials}
                  </div>
                  <p className="text-xs font-semibold leading-tight line-clamp-2" style={{ color: '#293B32' }}>
                    {author.name}
                  </p>
                  {primaryGenre && (
                    <p className="text-[10px] mt-1 truncate w-full" style={{ color: '#A8B5A0' }}>{primaryGenre}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Why BookHaven ─────────────────────────────────────────── */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: '#1A2E22', fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Why Choose BookHaven?
          </h2>
          <p className="text-sm mt-1" style={{ color: '#68736B' }}>Everything you need for a great reading experience</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '📚', title: 'Wide Selection',    desc: 'Browse 40+ books across 10 categories — Fiction to Data & AI.',  bg: '#EBF0E9', ring: '#CCDBCE' },
            { icon: '🔒', title: 'Secure Shopping',   desc: 'Your account and payment details are always protected.',          bg: '#F5EBDD', ring: '#E8DECE' },
            { icon: '🚚', title: 'Free Shipping',     desc: 'Free delivery on orders above ₹4,000.',                          bg: '#EBF0E9', ring: '#CCDBCE' },
            { icon: '↩️', title: 'Easy Cancellation', desc: 'Cancel any order within 48 hours, subject to order status.',     bg: '#FBF6EC', ring: '#F5E9CE' },
          ].map(({ icon, title, desc, bg, ring }) => (
            <div key={title} className="rounded-2xl p-5 flex items-start gap-4" style={{ backgroundColor: bg }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: ring }}>
                {icon}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1A2E22' }}>{title}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#68736B' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Explore Authors CTA ───────────────────────────────────── */}
      <section
        className="rounded-3xl p-8 text-center relative overflow-hidden"
        style={{ backgroundColor: '#1E3228' }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #C9A96A 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        {/* Decorative leaf shapes — aria-hidden, purely visual */}
        <svg className="absolute top-4 left-8 w-12 h-12 opacity-[0.15]" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M20 4 C28 4 36 12 36 24 C36 32 28 36 20 36 C20 36 4 28 4 16 C4 8 12 4 20 4Z" fill="#A8B5A0"/>
        </svg>
        <svg className="absolute bottom-4 right-8 w-10 h-10 opacity-[0.15]" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M20 4 C28 4 36 12 36 24 C36 32 28 36 20 36 C20 36 4 28 4 16 C4 8 12 4 20 4Z" fill="#C9A96A"/>
        </svg>

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#C9A96A' }}>
            Meet the writers
          </p>
          <h2
            className="text-2xl font-bold mb-3 text-white"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Explore Author Profiles
          </h2>
          <p className="text-sm max-w-md mx-auto mb-6 leading-relaxed" style={{ color: '#BAC8B5' }}>
            Learn about the authors behind your favourite books — their biographies, famous works, and more titles in our catalogue.
          </p>
          <Link
            to="/authors"
            className="inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C9A96A]"
            style={{ backgroundColor: '#C9A96A', color: '#1A2E22' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B8944E')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C9A96A')}
          >
            Browse Authors →
          </Link>
        </div>
      </section>

    </div>
  );
}
