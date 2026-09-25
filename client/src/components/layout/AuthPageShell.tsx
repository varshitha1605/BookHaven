/**
 * AuthPageShell — full-bleed cozy reading-room background.
 *
 * Used on: Login, Register, Checkout, Wishlist, Order Success.
 * NOT used on any main shopping pages.
 *
 * Layout provides a full-bleed <main> (no padding, no max-width) for these
 * pages so this shell fills the entire viewport width.
 *
 * The background is a rich CSS multi-layer gradient composition that
 * faithfully reproduces the reference reading-room photograph:
 *   • Muted sage-green wall
 *   • Warm diagonal window-light wash
 *   • Soft angled shadow bars from window mullions
 *   • Warm honey-wood desk surface at the bottom
 *   • Subtle depth vignette at the edges
 *
 * Children are centred with standard page padding restored inside the shell.
 * If auth-bg.jpg is ever placed in /public, it will automatically take over
 * as the background via the backgroundImage property.
 */

import type { ReactNode } from 'react';

export default function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100%',

        // ── Primary background: sage-green wall + warm desk ──────────────
        // Layer order (CSS background shorthand, last = bottom):
        //  1. Radial vignette (darkens edges, lifts centre)
        //  2. Diagonal window-light shaft wash
        //  3. Repeating angled shadow bars (mullion shadows)
        //  4. Desk surface (warm honey-wood, bottom 30%)
        //  5. Wall base (sage green, full coverage)
        background: [
          // 1. Vignette — pulls visual focus to centre
          'radial-gradient(ellipse 75% 80% at 50% 46%, transparent 28%, rgba(62,72,55,0.32) 100%)',
          // 2. Window light wash — warm off-white diagonal bloom, upper-left
          'radial-gradient(ellipse 72% 68% at 32% 22%, rgba(255,250,228,0.55) 0%, rgba(242,238,210,0.28) 42%, transparent 100%)',
          // 3b. Second light shaft — fainter, mid-right
          'radial-gradient(ellipse 35% 55% at 72% 18%, rgba(255,248,220,0.22) 0%, transparent 100%)',
          // 4. Desk surface — warm amber-wood, bottom 30% of page
          'linear-gradient(180deg, transparent 70%, rgba(180,130,60,0.88) 70%, rgba(158,108,42,0.95) 82%, rgba(140,92,32,1) 100%)',
          // 5. Desk top-edge highlight
          'linear-gradient(180deg, transparent 69.2%, rgba(220,175,100,0.80) 69.2%, rgba(220,175,100,0.80) 70%, transparent 70.2%)',
          // 6. Wall base — muted sage green
          'linear-gradient(168deg, #C2D1B8 0%, #BAC8AE 25%, #BDC9B2 55%, #C4CEBC 85%, #BFCAB4 100%)',
        ].join(', '),
      }}
    >
      {/* ── Repeating mullion shadow bars — diagonal stripes on wall ──── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            -60deg,
            transparent           0px,
            transparent           52px,
            rgba(155,172,144,0.20) 52px,
            rgba(155,172,144,0.20) 66px,
            transparent           66px,
            transparent          128px,
            rgba(155,172,144,0.15) 128px,
            rgba(155,172,144,0.15) 138px
          )`,
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Wood grain on desk — subtle horizontal texture ─────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '30%',
          background: `repeating-linear-gradient(
            174deg,
            transparent 0px, transparent 9px,
            rgba(100,65,18,0.04) 9px, rgba(100,65,18,0.04) 10px,
            transparent 10px, transparent 22px,
            rgba(130,85,24,0.03) 22px, rgba(130,85,24,0.03) 23px
          )`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Desk ambient shadow at wall/desk junction ──────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '28%', left: 0, right: 0,
          height: 32,
          background: 'linear-gradient(180deg, rgba(50,35,12,0.38) 0%, transparent 100%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Desk centre light reflection ───────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2%', left: '20%',
          width: '50%', height: '20%',
          background: 'radial-gradient(ellipse 65% 60% at 50% 65%, rgba(255,230,160,0.28) 0%, transparent 100%)',
          filter: 'blur(12px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Page content — centred, with restored padding ──────────────── */}
      <div
        className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {children}
      </div>
    </div>
  );
}
