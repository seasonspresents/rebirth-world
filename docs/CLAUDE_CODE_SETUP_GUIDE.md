# 🛹 REBIRTH WORLD — Claude Code Setup Guide

> **Purpose:** Get Claude Code fully contextualized for the Rebirth World project so every session picks up where you left off — no re-explaining.

---

## THE SHORT VERSION (Do This Now)

### Step 1: Install the Plugin Marketplaces

Open Claude Code in your terminal and run these commands:

```bash
# Add Anthropic's official skills marketplace (auto-available but good to confirm)
/plugin marketplace add anthropics/claude-plugins-official

# Add the community marketplace with Next.js, Supabase, and more
/plugin marketplace add kivilaid/plugin-marketplace

# Add Anthropic's skills repo (document skills, frontend design, etc.)
/plugin marketplace add anthropics/skills
```

### Step 2: Install the Plugins You Need

```bash
# === CORE DEV PLUGINS ===
/plugin install nextjs-vercel-pro@ando-marketplace       # Next.js + Vercel best practices
/plugin install supabase-toolkit@ando-marketplace         # Supabase workflows
/plugin install feature-dev@ando-marketplace              # Feature development workflow
/plugin install git-workflow@ando-marketplace              # Git automation

# === QUALITY & REVIEW ===
/plugin install pr-review-toolkit@ando-marketplace        # PR review agents
/plugin install commit-commands@ando-marketplace           # Commit message standards
/plugin install testing-suite@ando-marketplace             # Testing automation

# === DOCUMENT SKILLS (from Anthropic's skills repo) ===
/plugin install document-skills@anthropic-agent-skills    # PDF, DOCX, XLSX, PPTX
/plugin install example-skills@anthropic-agent-skills     # Frontend design, theme factory, etc.
```

### Step 3: Replace Your CLAUDE.md

Copy the `CLAUDE.md` file (included below in this guide) into your repo root, replacing the existing one.

### Step 4: Add Project Docs to Your Repo

```
your-project/
├── CLAUDE.md                              ← NEW (from this guide)
├── docs/
│   ├── REBIRTH_WORLD_PRD.md               ← Copy from Claude Project
│   ├── GHL_INTEGRATION_PLAN.md            ← Already have this
│   ├── SABO_TO_REBIRTH_BLUEPRINT.md       ← Already have this
│   └── COMPETITOR_ANALYSIS.md             ← From earlier chat
├── .claude/
│   └── skills/
│       └── rebirth-brand/
│           └── SKILL.md                   ← CUSTOM SKILL (included below)
├── package.json
├── src/
└── ...
```

### Step 5: Create the Custom Rebirth Brand Skill

Create `.claude/skills/rebirth-brand/SKILL.md` in your repo (content included below).

---

## WHAT ARE SKILLS & PLUGINS?

Think of it like apps on your phone:

- **CLAUDE.md** = Your phone's wallpaper & settings — Claude reads it every single session automatically. Keep it under ~150 lines. This is your permanent brain.
- **Skills** = Specialized apps Claude loads on-demand when relevant. They live in `.claude/skills/` folders. Claude reads the name + description (~100 tokens), and if it matches your task, loads the full instructions.
- **Plugins** = App Store bundles — pre-packaged collections of skills, agents, hooks, and tools from Anthropic or the community.
- **Marketplaces** = The app stores themselves — registries you add to browse and install plugins from.

### Where Skills Live

| Location | Scope | Who Sees It |
|----------|-------|-------------|
| `~/.claude/skills/` | Personal — all your projects | Just you |
| `.claude/skills/` (in repo) | Project — shared via git | Your whole team |
| Plugin marketplace | Installable | Anyone who adds the marketplace |

### Key Concept: Progressive Disclosure

Claude doesn't load everything at once (that would eat your context window). Instead:

1. **Always loaded:** CLAUDE.md + skill names/descriptions (~100 tokens each)
2. **Loaded when relevant:** Full SKILL.md body (when Claude decides it matches your task)
3. **Loaded on demand:** Reference files, scripts, templates (only when actively needed)

This means your CLAUDE.md stays lean, and deep context lives in skills and docs/ files that Claude reads when it needs them.

---

## THE FILES YOU NEED

### File 1: CLAUDE.md (Repo Root)

Save this as `CLAUDE.md` in your project root. Claude Code reads it automatically every session.

```markdown
# Rebirth World — E-Commerce Platform

## Project
Rebirth World (rebirth.world) — premium handmade ring e-commerce brand by Daniel Malzl.
Recycled skateboard rings + wood-lined metal wedding bands, crafted on North Shore, Oahu.

## Stack
- **Framework:** Next.js 14+ (App Router)
- **Database:** Supabase (Postgres + Auth + Storage)
- **Payments:** Stripe (checkout, webhooks, subscriptions)
- **CRM/Email:** GoHighLevel (webhooks for leads, purchases, abandoned carts)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Deployment:** Vercel
- **UI Libraries:** Aceternity UI, Magic UI, 21st.dev components

## Key Files
- `docs/REBIRTH_WORLD_PRD.md` — Full brand PRD (read for brand voice, avatars, strategy)
- `docs/GHL_INTEGRATION_PLAN.md` — GoHighLevel webhook integration spec
- `docs/SABO_TO_REBIRTH_BLUEPRINT.md` — Codebase conversion notes
- `src/lib/ghl.ts` — GHL webhook helper
- `src/app/api/webhooks/stripe/route.ts` — Stripe webhook handler
- `src/app/api/newsletter/route.ts` — Newsletter signup endpoint

## Architecture Decisions
- App Router (not Pages Router) — all routes in `src/app/`
- Server Components by default, `"use client"` only when needed
- Supabase for auth + product catalog + order history
- Stripe Checkout for payments (not custom forms)
- GHL webhooks fire on: newsletter signup, purchase, abandoned cart
- CA glue finish as interior coating (not polyurethane) — this matters for product copy

## Code Style
- TypeScript strict mode
- Functional components with hooks
- Tailwind for styling — no CSS modules
- ES modules, not CommonJS
- Prettier + ESLint
- Commit messages: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

## Brand Quick Ref
- **Colors:** Charcoal #1a1a1a, Warm White #f5f0e8, Ocean Teal #2a9d8f, Burnt Amber #e07a3a, Lotus Pink #d4a0a0, Driftwood Gray #8a8578, Moss Green #5a6b4a
- **Fonts:** Clash Display (headlines), DM Sans (body), DM Mono (system/labels)
- **Voice:** Warm, authentic, skater-adjacent. Not corporate. Not salesy.
- **Tagline:** "Embrace Change 🪷"

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint check
- `npx supabase db push` — push DB migrations
- `npx stripe listen --forward-to localhost:3000/api/webhooks/stripe` — Stripe webhook testing

## Testing
- New components need test files using React Testing Library
- API routes need integration tests
- Run `npm test` before committing

## What NOT to Do
- Don't use Pages Router patterns (getServerSideProps, etc.)
- Don't install additional CSS frameworks (Tailwind only)
- Don't use `any` type — always type properly
- Don't hardcode prices — pull from Stripe/Supabase
- Don't use the word "luxury" in copy — say "premium" or "crafted"
- Don't use Inter, Roboto, or Arial fonts — use Clash Display, DM Sans, DM Mono
```

---

### File 2: Custom Brand Skill

Save as `.claude/skills/rebirth-brand/SKILL.md` in your repo:

```markdown
---
name: rebirth-brand
description: Rebirth World brand context, voice, and design system. Use this skill whenever writing copy, designing UI components, creating landing pages, building product pages, writing emails, or making any creative/marketing decisions for the Rebirth World e-commerce site. Also use when the user mentions "brand voice", "copy", "landing page", "product page", "email sequence", "wedding band", or "skateboard ring".
---

# Rebirth World Brand Skill

For full brand context, read `docs/REBIRTH_WORLD_PRD.md` — it contains:
- Brand origin story (Daniel Malzl, Austrian jeweler heritage, North Shore)
- Three customer avatars (Conscious Rider, Alternative Groom, Gift Giver)
- Complete voice & tone guide with examples per channel
- Visual identity (colors, typography, photography direction)
- Competitive landscape and positioning
- Advisory Council for strategic decisions
- Marketing funnel architecture and email frameworks

## Brand Voice Quick Rules

**We sound like:** A grounded skater friend who's also a master craftsman.

**Always:**
- Lead with story, follow with specs
- Use "crafted" not "manufactured"
- Show sustainability, don't preach it
- Reference the community (boards donated by local skaters)

**Never:**
- Corporate jargon or salesy language
- "Luxury" (say "premium" sparingly)
- "Eco-friendly" as a lead (show don't tell)
- "Handcrafted artisanal" (too pretentious)
- Generic stock-photo aesthetics

## Design System

- Background: #f5f0e8 (warm white) with subtle grain texture overlay
- Text: #1a1a1a (charcoal) for headers, #8a8578 (driftwood gray) for body
- CTA Primary: #2a9d8f (ocean teal)
- CTA Secondary: #e07a3a (burnt amber)
- Use Framer Motion for scroll animations and hover states
- Grain/noise SVG overlay on backgrounds to kill "AI slop" feel
- Natural photography: golden hour, lifestyle > sterile product shots

## Product Context

| Product | Price | Key Selling Point |
|---------|-------|-------------------|
| Skateboard Rings | ~$25 | 7-layer recycled maple from donated boards |
| Wedding Bands | $75-200+ | Gold-plated steel + stabilized ancient wood liners |
| Apparel | $35-70 | Branded hoodies and tees |
| Laser Engraving | +$9 | Up to 10 chars or custom graphic |

Wedding band sizing: Size 9 shell (18.8mm ID) → 0.8mm wood liner → wearable size 7.
Interior finish: thin CA glue (not polyurethane).
```

---

## USEFUL RESOURCES

| Resource | URL | What It Is |
|----------|-----|-----------|
| **Anthropic Official Skills Repo** | github.com/anthropics/skills | Official skills you can install or study |
| **Official Plugin Marketplace** | github.com/anthropics/claude-plugins-official | Curated, verified plugins |
| **Community Marketplace** | github.com/kivilaid/plugin-marketplace | 87+ plugins from community |
| **SkillHub** | skillhub.club | 7,000+ community skills, searchable |
| **SkillsMP** | skillsmp.com | Another community skills aggregator |
| **Awesome Claude Skills** | github.com/travisvn/awesome-claude-skills | Curated list with categories |
| **Awesome Claude Skills (Composio)** | github.com/ComposioHQ/awesome-claude-skills | Action-oriented skills (email, Slack, etc.) |
| **Claude Code Best Practices** | rosmur.github.io/claudecode-best-practices | Community-compiled best practices |
| **Claude Code Docs (Skills)** | code.claude.com/docs/en/skills | Official documentation |
| **Claude Code Docs (Plugins)** | code.claude.com/docs/en/discover-plugins | Official plugin docs |

---

## TIPS FOR WORKING WITH CLAUDE CODE

1. **CLAUDE.md under 150 lines** — Deep context goes in `docs/` files and skills, not here
2. **Use `/clear` aggressively** — Context degrades over long sessions. Clear and re-orient.
3. **Plan before coding** — Say "plan this, don't code yet" → review → then "execute"
4. **Point to docs explicitly** — "Read docs/REBIRTH_WORLD_PRD.md section 6 for voice guide"
5. **Skills auto-trigger** — If you named the skill well, Claude loads it when relevant
6. **Don't @-file large docs** — Instead say "see docs/file.md" so Claude reads on demand
7. **Commit often** — Git is your undo button. Commit before big changes.

---

*This guide was generated from your Rebirth World Claude Project. Keep it in your repo's `docs/` folder for reference.*
