# Satori AI — Project DNA & Decision Framework

## How Sabo and Satori Come Together

**Sabo** is the boilerplate — a production-grade Next.js 16 template with authentication (Supabase), payments (Stripe), a dashboard, MDX content system, 70+ UI components, and full deployment infrastructure on Vercel. It is the chassis.

**Satori AI** (satori.world) is the product built on top of that chassis — an AI assistant for tattoo artists that handles DMs, SMS, voice calls, and follow-ups so artists can stay in the chair and focus on their craft. The Sabo template provides the engineering foundation; Satori provides the soul, the voice, and the market positioning.

Everything user-facing — the landing page, the copy, the brand, the persuasion flow, the channel showcase, the CTAs, the lead capture — is Satori. Everything under the hood — the auth system, the API routes, the component library, the build pipeline — is Sabo infrastructure serving Satori's mission.

When building or extending this project, the technical decisions follow Next.js and Sabo conventions (documented in `CLAUDE.md`). But every decision that touches what the user **sees, reads, or feels** must follow Satori's research-driven framework described below.

---

## The Research-First Rule

**Every decision that involves copy, messaging, positioning, tone, feature framing, UI language, page structure, persuasion logic, or anything that communicates to the end user MUST begin with the research documents.**

No copy is written from intuition. No headline is guessed at. No section is built because "it feels right." The research documents are the source of truth for what tattoo artists actually think, feel, say, fear, desire, and respond to. They contain verbatim language from real artists, quantified emotional drivers, ranked mechanisms, and tested frameworks.

**Before any of the following, consult the research first:**

- Writing or editing any marketing copy (headlines, subheads, body text, CTAs)
- Naming or describing product features
- Choosing which sections to add, remove, or reorder on a page
- Deciding what emotional angle to lead with
- Creating ad copy, email sequences, or social content
- Building new landing pages or modifying the persuasion flow
- Framing the product for a specific audience segment
- Choosing words, phrases, or metaphors in any user-facing context
- Making decisions about brand voice, tone, or personality
- Designing the onboarding experience or dashboard copy
- Structuring any form of sales or lead nurture content

**The process is:**

1. **Read the research.** Study the relevant documents thoroughly before forming any opinion.
2. **Find the language.** Use the exact words, phrases, and emotional patterns documented from real tattoo artists. Their language is always better than ours.
3. **Match the avatar.** Know which macro-avatar you are speaking to and what their core desire, dominant emotion, awareness level, and limiting beliefs are.
4. **Apply the mechanism.** Use the ranked unique mechanisms to frame the problem and the solution in the way most likely to create recognition and belief shift.
5. **Then build.** Only after steps 1-4 should any code be written, any component be designed, or any copy be committed.

---

## Research Document Index

All research documents live in `docs/research/` and serve specific functions:

### `macro-avatar-language.md`
**What it is:** Five voice-of-customer language banks — one per macro-avatar — containing verbatim quotes pulled from real tattoo artist communities online. Every quote is sourced and attributed.

**When to use it:** Whenever you need the exact words tattoo artists use to describe their problems, emotions, beliefs, failed solutions, transformations, or daily experiences. This is the primary reference for writing copy that sounds like it came from the artist's own mouth.

**Key sections per avatar:** Problem Language, Daily Experience Language, Belief Language, Psychological/Mental State Language, Emotional Expression, Failed Solutions Language, Identity & Relationship Language, Discovery/Learning Language, Transformation Language, Authority Reference Language, Timeline/Regret Language, High-Frequency Words, Taboo Words.

### `macro-avatars.md`
**What it is:** The complete macro-avatar research dossier. Five detailed avatar profiles with trigger experiences, current behaviors, limiting beliefs (with what shatters each), awareness levels, ad angles, example ad copy, and landing page focus recommendations.

**When to use it:** When making any strategic decision about who we are talking to, what angle to take, or how to structure a page or campaign. This is the master strategy document.

**Key data:** Avatar comparison table, source tracking by platform, recommended test priority order, cross-avatar insights, the untapped emotional lever (spouse/partner perspective).

### `market-awareness-research.md`
**What it is:** Comprehensive market awareness analysis across 230+ sources. Breaks down the tattoo artist market by awareness stage (Unaware through Most Aware), with search data, competitive landscape, and failed solution analysis.

**When to use it:** When deciding how to position the product, what level of education the copy needs to provide, and how to bridge the gap between Problem Aware and Solution Aware. Also critical for competitive positioning.

**Key finding:** The dominant awareness level is Problem Aware (~35-40%). The primary competitor is not another product — it is the artist's own resignation that DM chaos is "just how it is." There is near-zero organic awareness of AI-specific solutions in the tattoo vertical.

### `mass-desires-research.md`
**What it is:** 250+ customer voices distilled into 10 ranked surface desires with 30 mapped emotional drivers, keyword frequency analysis, four natural customer segments, and product requirements.

**When to use it:** When deciding which desire to lead with on any page, email, or ad. When choosing the emotional angle for a section. When validating whether a feature or message aligns with what the market actually wants.

**Key finding:** The highest-opportunity desires are #6 (preserve family relationships) and #8 (extend career longevity) — both carry 5.0 and 4.5 emotional intensity respectively, and zero competitors market against them directly.

### `unique-mechanisms.md`
**What it is:** 19 unique mechanisms organized by avatar, each containing observable proof, the unique mechanism of the problem (UMP), the unique mechanism of the solution (UMS), and a believability check. These are the persuasion engines.

**When to use it:** When structuring any argument, sales narrative, VSL, landing page section, or ad. Each mechanism is a complete problem-reframe-solution arc designed to create an "oh, THAT'S why" recognition moment.

**Key mechanisms:** "The 6,000-Message Math Problem" (Avatar 1), "The First-Responder Wins Rule" (Avatar 2), "The Boundary Trap" (Avatar 3), "The Deposit Filter Effect" (Avatar 4), "The Invisible Receptionist Effect" (Avatar 5).

### `unique-mechanism-evaluations.md`
**What it is:** Ranked evaluations of all 19 mechanisms per avatar, explaining why each is ranked where it is, which limiting beliefs it addresses, which awareness level it targets, and how it compares to the others.

**When to use it:** When choosing which mechanism to lead with for a specific avatar or campaign. When deciding the order of persuasion on a long-form page. When evaluating whether a mechanism is better as a lead hook or a supporting argument.

**Key insight:** The three strongest mechanisms for Phase 1 testing are Mechanism 5 (First-Responder Wins Rule), Mechanism 2 (6,000-Message Math Problem), and Mechanism 14 (Deposit Filter Effect) — each gives the prospect an exercise they can do with their own data right now.

---

## The Five Macro-Avatars (Quick Reference)

| # | Avatar | Core Desire | Lead Emotion | Awareness |
|---|--------|-------------|--------------|-----------|
| 1 | The Drowning Creative | Reclaim creative time from admin | Resentment (identity loss) | Problem Aware 40-45% |
| 2 | The Leaking Pipeline | Stop losing revenue to slow responses | Financial anxiety | Problem Aware 45% |
| 3 | The Always-On Artist | Business runs 24/7 without being on 24/7 | Always-on anxiety | Problem Aware 50-55% |
| 4 | The Empty Chair | Eliminate no-shows and protect revenue | Anger (disrespect) | Problem Aware 45-50% |
| 5 | The Exhausted Gatekeeper | Fill calendar with qualified clients only | Exhaustion (energy drain) | Problem Aware 45% |

All five avatars are fundamentally the same person at different moments. A single tattoo artist experiences all five desires. The question is always: which desire-frame are we leading with in this context?

---

## Language Rules

These rules apply to all user-facing copy across the entire project:

1. **Use their words, not ours.** The language banks in `macro-avatar-language.md` contain the exact vocabulary tattoo artists use. Mirror it. "Drowning in DMs" is their phrase — use it. "Streamline your workflow" is SaaS jargon — never use it.

2. **Respect the taboo words.** Each avatar has a list of words that trigger instant distrust: Scale, Optimize, Leverage, Seamless, Revolutionize, Game-changer, ROI, Streamline, Funnel, Pipeline, CRM, KPI, Onboarding, Growth hack. These words signal "this person doesn't understand my world." Never use them.

3. **Be specific and visceral.** Tattoo artists respond to concrete details — "answering DMs at the dinner table," "$900 piece that ghosted," "6pm cutoff so I can see my girls." They do not respond to abstractions like "improved efficiency" or "enhanced productivity."

4. **Match the awareness level.** Most of the audience is Problem Aware. They know it hurts. They don't know solutions exist. Lead with the problem they recognize, not the solution they haven't discovered yet.

5. **The product is freedom, not software.** Satori is not a "booking platform" or an "AI tool." It is the thing that lets them be an artist again. It is the thing that gives them their evenings back. It is the thing that fills their chair with people who actually show up. Frame it by what it gives them, not what it is.

---

## The Market Truth

One sentence, expressed in different words by dozens of artists across every platform:

> "I became an artist to create beautiful things, and this business is slowly killing that."

Everything we build serves that truth. The AI booking assistant is not a scheduling tool. It is the thing that gives them permission to be artists again.
