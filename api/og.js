import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const PALETTE = {
  home:     { accent: '#ff4444', label: 'PORTFOLIO',  glow: 'rgba(255,68,68,0.18)' },
  resume:   { accent: '#ff4444', label: 'RESUME',     glow: 'rgba(255,68,68,0.18)' },
  roofroof: { accent: '#ff4444', label: 'CASE STUDY', glow: 'rgba(255,68,68,0.18)' },
  wheaton:  { accent: '#d9a14a', label: 'CASE STUDY', glow: 'rgba(217,161,74,0.20)' },
  sentinel: { accent: '#4ade80', label: 'CASE STUDY', glow: 'rgba(74,222,128,0.18)' },
  papi:     { accent: '#c084fc', label: 'CASE STUDY', glow: 'rgba(192,132,252,0.20)' },
};

const TITLES = {
  home:     'Karim Sangid',
  resume:   'Resume',
  roofroof: 'RoofRoof.solutions',
  wheaton:  'Wheaton Valet Cleaners',
  sentinel: 'SentinelIQ',
  papi:     'Papi AI',
};

const SUBTITLES = {
  home:     'AI & Security Engineer · Founder, Hummus Development LLC',
  resume:   'AI & Security Engineer · Full-Stack Product Builder',
  roofroof: 'Live roofing-lead marketplace — Stripe, Twilio, Supabase + RLS',
  wheaton:  'Client engagement — Next.js 16 multi-brand rebuild + federal launch',
  sentinel: 'AI-powered SIEM companion — LLM embeddings + natural-language query',
  papi:     'Cross-platform AI wingman — RN mobile + custom LoRA on RTX 4060 Ti',
};

const BADGES = {
  home:     ['MS CS @ GMU', 'Azure AZ-204', '23 shipped projects'],
  resume:   ['MS CS @ GMU', 'Azure AZ-204', '75K+ LOC'],
  roofroof: ['Live in production', '8K+ LOC', 'Stripe + Twilio + Supabase'],
  wheaton:  ['Multi-brand rebuild', '5 brand pages', 'Federal launch'],
  sentinel: ['AI × Cybersecurity', 'Multi-format ingest', 'NL query engine'],
  papi:     ['Mobile + Backend + LoRA', 'RTX 4060 Ti', 'Tailscale-served'],
};

// Helper: build a vdom node without JSX or React.
const h = (type, props = {}, children = undefined) => ({
  type,
  props: children !== undefined ? { ...props, children } : props,
  key: null,
});

export default function handler(req) {
  const url = new URL(req.url);
  const slug = (url.searchParams.get('slug') || 'home').toLowerCase();
  const p = PALETTE[slug] || PALETTE.home;
  const title = TITLES[slug] || TITLES.home;
  const subtitle = SUBTITLES[slug] || SUBTITLES.home;
  const badges = BADGES[slug] || BADGES.home;

  const tree = h(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        background: '#050507',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 76px 56px',
        position: 'relative',
        fontFamily: 'sans-serif',
        color: '#ffffff',
      },
    },
    [
      // Glow blob (accent color, top-right)
      h('div', {
        style: {
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: p.glow,
          filter: 'blur(80px)',
          display: 'flex',
        },
      }),
      // Bottom-left subtle glow
      h('div', {
        style: {
          position: 'absolute',
          bottom: '-180px',
          left: '-160px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(217,161,74,0.10)',
          filter: 'blur(80px)',
          display: 'flex',
        },
      }),
      // Top label row: K.S logo + slug badge
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '40px',
          zIndex: 1,
        },
      }, [
        h('div', {
          style: {
            fontSize: '34px',
            fontWeight: 700,
            letterSpacing: '0.6px',
            display: 'flex',
            alignItems: 'baseline',
          },
        }, [
          h('span', { style: { display: 'flex' } }, 'K'),
          h('span', { style: { color: p.accent, display: 'flex' } }, '.'),
          h('span', { style: { display: 'flex' } }, 'S'),
        ]),
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            letterSpacing: '3px',
            color: p.accent,
            fontWeight: 600,
          },
        }, [
          h('div', {
            style: {
              width: '8px',
              height: '8px',
              background: p.accent,
              borderRadius: '50%',
              display: 'flex',
            },
          }),
          h('span', { style: { display: 'flex' } }, p.label),
        ]),
      ]),
      // Spacer to push title to vertical center-ish
      h('div', { style: { display: 'flex', flexGrow: 1 } }),
      // Main title
      h('div', {
        style: {
          fontSize: title.length > 16 ? '88px' : '108px',
          fontWeight: 800,
          letterSpacing: '-3px',
          lineHeight: 1.0,
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          zIndex: 1,
        },
      }, [
        h('span', { style: { display: 'flex' } }, title),
      ]),
      // Subtitle
      h('div', {
        style: {
          fontSize: '28px',
          color: '#b8bcc8',
          lineHeight: 1.35,
          maxWidth: '1000px',
          marginBottom: '48px',
          fontWeight: 400,
          display: 'flex',
          zIndex: 1,
        },
      }, subtitle),
      // Badge row
      h('div', {
        style: {
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '32px',
          zIndex: 1,
        },
      }, badges.map((b) => h('div', {
        style: {
          padding: '10px 18px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '4px',
          fontSize: '18px',
          color: '#ffffff',
          fontWeight: 500,
          letterSpacing: '0.4px',
          display: 'flex',
        },
      }, b))),
      // Footer line
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingTop: '28px',
          borderTop: `1px solid ${p.accent}66`,
          fontSize: '20px',
          color: '#b8bcc8',
          letterSpacing: '0.6px',
          zIndex: 1,
        },
      }, [
        h('span', { style: { display: 'flex' } }, 'karimsangid.dev'),
        h('span', { style: { display: 'flex', color: p.accent } }, 'Hummus Development LLC'),
      ]),
    ]
  );

  return new ImageResponse(tree, {
    width: 1200,
    height: 630,
    headers: {
      // Cache on Vercel edge for 1 hour, allow stale for a day
      'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
