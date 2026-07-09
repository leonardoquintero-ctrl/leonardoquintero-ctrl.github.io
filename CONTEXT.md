# Quint-IA Vantage — Project Context

## Framer Project
- **URL**: https://framer.com/projects/Quint-IA-Vantage--ZQzjTw4DwzASA20kHAsl-6Cxdw
- **Project ID**: ZQzjTw4DwzASA20kHAsl
- **Live site**: https://quintiavantage.com
- **Stack**: Framer (visual builder) + HTML Embeds for custom components

## Site Structure (pages)
| Page | Path |
|------|------|
| Home | / |
| Blog | /blog |
| FAQ | /faq |
| Why AEO Matters | /why-aeo-matters |
| How AEO Works | /how-aeo-works |
| Quick Start Blueprint | /quick-start-blueprint |
| Services | /services |
| Pricing | /pricing |
| About | /about |
| Spanish (ES) | /es |

## Design Tokens
| Token | Value | Use |
|-------|-------|-----|
| `--indigo` | `#4F6EF7` | Logo IA, CTAs, eyebrows, highlights |
| `--cyan` | `#00D4FF` | Stat numbers, data elements |
| `--bg-base` | `#0B0E11` | Dark section backgrounds |
| `--bg-surface` | `#12151B` | Card backgrounds |
| `--text-primary` | `#FAFBFC` | Headlines, body on dark |
| `--text-secondary` | `#8B92A0` | Subheads, nav links, muted text |

## Typography
| Role | Spec |
|------|------|
| H1 hero | Inter 700, 64px, -0.04em tracking |
| Eyebrow | Inter 600, 12px, 0.12em tracking, uppercase |
| Stats numbers | JetBrains Mono 700, 52px, -0.03em |
| Body | Inter 400, 16-17px, 1.6 line-height |

## Fonts in use
- Inter (all weights)
- JetBrains Mono (500, 700)

## Framer MCP Setup
The Framer agent bridge is installed on this machine:
- Skills location: `C:\Users\arleo\.claude\skills\` and `C:\Users\arleo\.agents\skills\`
- Install command: `npx @framer/agent@latest setup`
- Connect to project: run `/framer` in Claude Code, then use the project URL above

### To reconnect on a new machine:
1. Install Node.js (v24+)
2. Run: `npx @framer/agent@latest setup`
3. Restart Claude Code
4. Type `/framer` in the chat
5. Authorize with your Framer account
6. Session: `npx @framer/agent@latest session new "https://framer.com/projects/Quint-IA-Vantage--ZQzjTw4DwzASA20kHAsl-6Cxdw"`

## Known Issues & Fixes

### Nav links not working in Framer HTML Embed
**Cause**: Framer sandboxes HTML embeds — `target="_parent"` is blocked.
**Fix**: Use `window.top.location.href` via click handlers (see `nav.html`).

### Active state detection broken
**Cause**: `window.parent.location` is cross-origin blocked in Framer's sandbox.
**Fix**: Use `window.top.location.pathname` inside a try/catch.

### Localization "1/0 locale" warning
**Situation**: Framer's built-in localization feature was activated but the plan doesn't include additional locales.
- The `/es` page is a **manual** Spanish page (free, works fine).
- The Framer localization feature is a separate paid add-on.
- The site default locale was accidentally set to `es-CO` — should be English.
- To fix: Go to Site Settings → Localization → remove the "Spanish site" locale and reset default to English.

### Broken page `about-2` (node ID: `yoVPlqOsi`)
**Error**: `Assertion Error: primary variant should be master`
**Status**: Cannot be deleted via API or editor. Needs Framer support.
**Action**: Contact support.framer.com with node ID `yoVPlqOsi` and project ID `ZQzjTw4DwzASA20kHAsl`.

## Components built this session

### `nav.html` — Navigation (HTML Embed)
Dark glassmorphism navbar with mobile drawer overlay.
- Use as a Framer **HTML Embed** component
- Links use `window.top.location.href` for Framer iframe compatibility
- Active state detection via `window.top.location.pathname`
- Responsive: desktop shows links + CTA, mobile shows hamburger + full-screen overlay

## Session summary (July 9, 2026)
- Set up Framer MCP bridge from scratch on Windows
- Debugged and fixed nav component link/active-state issues for Framer HTML Embed
- Diagnosed localization "1/0" billing issue
- Attempted to delete corrupted `about-2` page (blocked, needs Framer support)
- Identified dangerous git root at `C:\Users\arleo` — do NOT commit from there
