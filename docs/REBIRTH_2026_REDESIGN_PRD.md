# Rebirth World — 2026 Redesign PRD

> "I looked at a snapped deck one day and saw something most people would throw away. I saw a ring."
> — Daniel Malzl, Founder

---

## Executive Summary

This PRD defines the transformation of rebirth.world from a well-built e-commerce store into an **award-worthy editorial brand experience** that converts. The site must feel like Daniel — handmade, warm, personal, artistic, spiritual, and rebellious against corporate sameness.

**The north star:** A 23-year-old eco-conscious traveler lands on this site and thinks *"this brand gets me"* within 3 seconds, then spends 5 minutes reading Daniel's story before they even look at the price.

**Design philosophy:** The site should feel like a **surf magazine meets a travel journal meets an independent record label** — not like a Shopify template with nice fonts.

---

## Part 1: Brand Foundation

### 1.1 Who Is Daniel Malzl?

- Skateboarder, jeweler, traveler, founder
- 8 years in business (since November 2016)
- Based in Mapleton, Utah (workshop)
- Served a mission in Guatemala — changed his life
- Traveled Latin America with a personal skateboard (Guatemala → Costa Rica → Colombia → Peru → Chile)
- Son of Austrian master jeweler Christoph Malzl (trained at Koppenwallner's, Salzburg)
- Known as "The Rebirth Guy"
- Signs off: "With love — Daniel"
- Community: "Rebirth Fam"

### 1.2 Brand Philosophy

The name Rebirth represents powerful change we embrace through growth, challenges, and experiences.

**Core principles (from the Rebirth Frequency crewneck):**
- **A1: Embrace the Chaos** — Guatemala 2022, leaving business behind to serve, trusting uncertainty
- **A2: Everything You Need Is Already Here** — Lake Atitlán, gratitude, the puzzle pieces already connected
- **B1: Always Connected** — Peru, Machu Picchu, Carlos: "you can never be too connected or less connected — you ARE always connected"
- **B2: Inner Echoes** — Trust your intuition, the inner echoes that guide you

**Wrap text:** *"Bless the places in you that are breaking, embrace the rebirth of what is blooming within you."*

### 1.3 Target Customer Avatar

- **Age:** 18-30
- **Identity:** Eco-conscious, outdoorsy, creative, values-driven
- **Archetype:** "23-year-old traveler who is eco-conscious, outdoorsy, and has love for positive and meaningful growth/experiences"
- **Goal:** Become the better and more conscious version of themselves
- **Dream:** Solo travel around the world, embracing the beauty of art and other cultures
- **Buying trigger:** Connecting with the story behind a product, wanting to make a difference
- **Key insight:** Many are first-time jewelry buyers. "Some people's first ring is a Rebirth Ring because of the story and message."

### 1.4 Brand Voice

| Do | Don't |
|----|-------|
| First-person, Daniel's actual voice | Corporate "we believe" language |
| Specific details (seven layers, CA glue, Machu Picchu) | Generic "premium handcrafted artisanal" |
| Short, honest sentences | Marketing fluff |
| "With love — Daniel" warmth | "Subscribe to our newsletter" coldness |
| "Broken boards, reborn" directness | "Sustainable luxury fashion" buzzwords |
| Philosophical without pretension | Preachy sustainability lectures |
| "Embrace Change" as lived experience | "Embrace Change" as empty tagline |

---

## Part 2: Design Direction

### 2.1 Visual Identity — "Analog Soul, Digital Craft"

The site should feel like it was designed by someone who makes things with their hands, not someone who drags widgets in a page builder.

**Key aesthetic pillars:**

1. **Handwritten & Hand-drawn Elements**
   - Handwritten annotations alongside clean typography (like Daniel's thank-you cards)
   - Hand-drawn SVG underlines, circles, arrows — not CSS borders
   - Stamp/sticker-like badges scattered with slight rotation (±2-5°)
   - "Scratchy" texture overlays on select elements (like skateboard grip tape)

2. **Collage & Sticker Aesthetic**
   - Product badges that look like vinyl stickers ("Handmade in Utah", "100% Recycled", "Free Shipping")
   - Tape/washi-tape visual holding photos to the page
   - Scattered mini-elements: pressed flowers, small skateboard icons, lotus symbols
   - Think: physical moodboard pinned to a workshop wall

3. **Organic Shapes & Movement**
   - No hard rectangular section dividers — use organic blob/wave SVG dividers
   - Slight random rotation on product cards (±1-2°) so they feel "placed by hand"
   - Elements that feel imperfect on purpose — asymmetric layouts, hand-placed feeling

4. **Warm Film Photography Grain**
   - Keep and enhance the existing grain texture system
   - All photography should feel like 35mm film (warm tones, natural light, golden hour)
   - Subtle vignette on hero images

5. **Vinyl Record / Music Design Language**
   - Inspired by the Rebirth Frequency crewneck concept
   - Section headers could reference A-side/B-side track listing format
   - "Now playing" micro-element showing current page/section
   - Liner notes style for the About/Story page

### 2.2 Color System Updates

Keep the existing warm palette but add:

| Addition | Hex | Usage |
|----------|-----|-------|
| Sticker Yellow | `#f5e642` | Sticker/badge backgrounds, highlights |
| Kraft Paper | `#c4a882` | Tape elements, packaging section backgrounds |
| Pencil Gray | `#4a4a4a` | Handwritten annotation text |
| Pressed Flower Pink | `#d4a0a0` | Botanical elements, flower ring collection |

### 2.3 Typography Updates

Keep Clash Display (headlines), DM Sans (body), DM Mono (technical). Add:

| Font | Role | Vibe |
|------|------|------|
| **Caveat** or **Kalam** (Google Fonts) | Handwritten annotations, sticker text, personal notes | Daniel's handwriting feel |
| **Recoleta** (or similar warm serif) | Editorial pull quotes, story sections | Magazine/editorial warmth |

### 2.4 Inspiration Brands & Techniques to Emulate

| Brand | What to Take | Apply To |
|-------|-------------|----------|
| **Poppi** | Sticker badges, flavor-specific color worlds, joyful energy | Collection-specific product pages, badge overlays |
| **Couplet Coffee** | Hand-drawn doodles between sections, anti-pretentious messaging | Section dividers, Daniel's voice |
| **Recess** | Ambient atmospheric animations, product-matched color pages | Product detail pages, hero section |
| **Liquid Death** | Punk attitude in design, patch/sticker art embedded in experience | Accessories section, 404 page |
| **Ghia** | Vintage poster typography, recipe/usage integration | Story sections, editorial layouts |
| **Lusano** | Moodboard-style browsing, warm serif typography | Collection landing pages |

---

## Part 3: Page-by-Page Redesign

### 3.1 Homepage

**Current state:** Good narrative arc but feels like a well-designed template. Hero says "Embrace Change" — correct philosophy but too corporate.

**New homepage structure:**

```
1. HERO — "Broken Boards, Reborn"
   - Full-viewport, Daniel's actual words as hero copy
   - Background: workshop video loop or cinematic product reel (not particles)
   - Handwritten "With love — Daniel" annotation in corner
   - Sticker badge: "Handmade in Utah" with slight rotation
   - Scroll indicator: hand-drawn arrow SVG (not chevron)

2. FEATURED COLLECTION — "The 2026 Drop"
   - Editorial-style product showcase (not a grid)
   - Each product card slightly rotated, placed like photos on a table
   - Hover reveals Daniel's one-line story about each piece
   - "NEW" sticker badges on 2026 collection items

3. THE STORY — "From Board to Ring" (enhanced)
   - Keep the pinned 4-step sequence but add:
     - Hand-drawn step numbers (SVG, not system font)
     - Actual workshop photos (not illustrations)
     - Daniel's handwritten notes annotating each step
     - Pressed flower / wood grain texture overlays

4. DONATE A BOARD — "Your Board. Your Ring."
   - NEW SECTION — this is the viral hook
   - Photo of a broken board → arrow → photo of finished ring
   - CTA: "Send us your deck, we'll make your ring"
   - Simple form: photo upload + contact info
   - Social proof: "347 boards recycled and counting"

5. THE FREQUENCY — Brand Philosophy
   - Vinyl record visual with A1/A2/B1/B2 track listing
   - Each "track" is a scrollable philosophy section
   - Liner notes aesthetic — text alongside sleeve art
   - "Bless the places in you that are breaking..." as the close

6. UNBOXING — "What Arrives at Your Door"
   - NEW SECTION — show the full experience
   - Ring + stickers + handwritten thank-you card
   - Photos that look like someone just opened the package
   - Pull quote from Paul H. testimonial overlaid

7. COMMUNITY — "Rebirth Fam"
   - Instagram feed embed or curated UGC gallery
   - Real customers wearing Rebirth products
   - "Tag @rebirthrings to be featured"

8. TESTIMONIALS — (enhanced)
   - Keep editorial pull quote format
   - Add handwritten-style quotation marks
   - Customer photos alongside quotes

9. FAQ — (enhanced)
   - "Donate a board" question added
   - Hand-drawn question mark icons
   - Sticky header with Daniel's face

10. NEWSLETTER — "Stay Connected"
    - "With love — Daniel" sign-off
    - Not "Subscribe to our newsletter" — instead:
      "Get stories from the workshop, new drops, and the occasional life update."
```

### 3.2 Product Detail Page — Story-First

**Current state:** Specs-first, thin descriptions, truncated copy. "Sells specs, not soul."

**New product page structure:**

```
ABOVE THE FOLD:
├── Product image gallery (left 60%)
│   ├── Main image with film grain overlay
│   ├── Thumbnail strip
│   ├── 3D viewer toggle (ring products)
│   └── Sticker badge: collection tag, "Handmade", etc.
│
└── Product info (right 40%)
    ├── Handwritten collection label (e.g., "skateboard rings" in Caveat font)
    ├── Product name (Clash Display)
    ├── Daniel's one-liner: "Inspired by the volcanic shores of Lake Atitlán..."
    ├── Price
    ├── Size selector
    ├── Engraving option
    ├── "Add to Cart" button
    └── Trust badges as sticker-style elements

BELOW THE FOLD — THE STORY:
├── "The Story Behind This Ring" — editorial section
│   ├── Full-width lifestyle photo
│   ├── Daniel's narrative (2-3 paragraphs in his voice)
│   ├── Travel photos if relevant (Guatemala, Peru, etc.)
│   └── Handwritten annotation overlay
│
├── "How It's Made" — 3-step mini craft story
│   ├── The board → The layers → The ring
│   └── Workshop photos specific to this product
│
├── Details accordion
│   ├── Materials & dimensions
│   ├── Sizing guide
│   ├── Care instructions
│   └── Shipping & returns
│
├── "You Might Also Like" — related products
│   └── Collage-style layout (not a grid)
│
└── "From the Rebirth Fam" — UGC/reviews section
```

### 3.3 Collection Landing Pages

Each collection (Skateboard Rings, Wedding Bands, Apparel, Accessories) gets its own **editorial landing page** — not just a filtered grid.

**Structure:**
```
├── Collection hero (full-width, lifestyle photography)
│   ├── Collection name in Clash Display
│   ├── Collection philosophy (2 sentences)
│   └── Color scheme shifts to collection palette
│
├── Featured piece — large editorial spotlight
│   ├── Full-bleed image
│   ├── Daniel's story about this piece
│   └── CTA to product page
│
├── Product grid — with personality
│   ├── Cards with slight rotation (±1-2°)
│   ├── Sticker badges
│   └── Hover: mini story preview
│
└── Collection story — why this collection exists
    └── Daniel's narrative + photos
```

### 3.4 "Our Story" / About Page — The Travel Journal

**Current state:** Good but could be extraordinary.

**New structure:**
```
├── Hero: Daniel in workshop, full-width cinematic photo
│
├── Timeline / Journey (scroll-driven)
│   ├── 2016 — "I looked at a snapped deck and saw a ring"
│   ├── Guatemala — The mission, the weavers, Lake Atitlán
│   ├── Latin America — The skateboard that traveled 5 countries
│   ├── North Shore — The workshop, the community
│   ├── Utah — The next chapter
│   └── 2026 — "The Rebirth of Rebirth"
│   (Each section: photo + narrative + hand-drawn location marker)
│
├── The Craft — expanded "From Board to Ring"
│   └── Workshop video or photo sequence
│
├── The Family — Daniel's dad (master jeweler), brother Mattias
│   └── Real family photos, honest narrative
│
├── The Collaborators
│   ├── Guatemalan weavers
│   ├── Local skaters who donate boards
│   └── Community partners
│
└── CTA: "Come see the workshop" / "Donate a board"
```

### 3.5 2026 Collection Launch Page

**Special editorial page for the March 2026 drop.**

```
├── Cinematic hero — "The Rebirth of Rebirth"
│   └── Video or scroll-driven animation
│
├── Product 1: Gold-Coated Steel Wedding Band (6.5mm)
│   ├── Large product photography
│   ├── Interior wood core options visualized
│   ├── "Comfort fit, micro-mesh sanded" — feel it through the screen
│   └── Available sizes, CTA
│
├── Product 2: Classic Rebirth Ring
│   ├── "100% recycled. 100% Utah. 100% handmade."
│   ├── Close-up of the 7 maple layers
│   └── "The ring that started it all"
│
├── Product 3: Embedded Flower Wedding Band (8mm)
│   ├── THIS IS THE HERO PIECE — give it the most space
│   ├── Full travel story: Guatemala → Costa Rica → Colombia → Peru → Chile
│   ├── Map visualization of the journey
│   ├── Close-up of embedded coca leaves and flowers
│   ├── "Made from my own personal skateboard"
│   └── This page should read like a short documentary
│
├── Product 4: Rebirth Frequency Crewneck
│   ├── Vinyl record visual — interactive
│   ├── A1/A2/B1/B2 philosophy sections
│   ├── Available colors: Pale Yellow, Black
│   ├── Sizes: S-XXL
│   └── "This is not just a crewneck. This is the manifesto."
│
└── Drop CTA — "Free ring to the first 5 customers"
    └── Countdown or claim counter
```

### 3.6 404 Page

**Remove particles. Replace with branded experience:**

```
"This page got recycled."

[Hand-drawn broken skateboard illustration]

"Like a broken board, sometimes things need to become something new.
Let's get you back on track."

[Button: "Back to the workshop" → /]
[Button: "Browse the collection" → /shop]

— Daniel
```

---

## Part 4: Technical Implementation

### 4.1 New Design Components to Build

| Component | Description | Technique |
|-----------|-------------|-----------|
| `<Sticker>` | Rotated badge with slight shadow, like a physical sticker | CSS transform rotate (±2-5°), drop-shadow, border-radius |
| `<HandwrittenText>` | Text in Caveat/Kalam font for annotations | Font-face + reduced opacity, slight rotation |
| `<TapeStrip>` | Washi tape visual holding elements | SVG or CSS gradient strip with slight transparency |
| `<OrganicDivider>` | Wavy/blob SVG section dividers | SVG path with slight animation, replaces hard `border-b` |
| `<StickerBadge>` | Collection of reusable sticker badges | "Handmade in Utah", "100% Recycled", "Free Shipping", "NEW" |
| `<PressedFlower>` | Decorative botanical SVG elements | Positioned absolutely, subtle parallax, low opacity |
| `<HandDrawnArrow>` | SVG arrow with DrawSVG reveal on scroll | GSAP DrawSVGPlugin, scroll-triggered |
| `<VinylRecord>` | Interactive record visual for philosophy section | CSS animation (rotation), click to "play" |
| `<DonateBoard>` | Board donation form with photo upload | File upload + Supabase storage + form |
| `<JourneyMap>` | Scroll-driven travel map (Guatemala → Peru) | SVG path with DrawSVG, scroll-linked |
| `<UnboxingShowcase>` | Lifestyle photos of what arrives at your door | Scroll-triggered reveal, collage layout |
| `<UGCGallery>` | Instagram/customer photo grid | Instagram API or manual curated grid |
| `<ProductStory>` | Editorial story section for product pages | Rich text + images, scroll-triggered reveals |
| `<WorkshopVideo>` | Ambient workshop video with grain overlay | HTML5 video, mix-blend-mode for grain |

### 4.2 Animation Upgrades

| Animation | Current | Upgrade To |
|-----------|---------|-----------|
| Hero headline | GSAP SplitText char reveal | Keep, but add handwritten annotation that draws in after |
| Section reveals | GSAP ScrollTrigger opacity+y | Add organic SVG path draw for dividers |
| Product cards | Framer Motion whileInView | Add slight random rotation + "placed on table" feel |
| Page transitions | CSS View Transitions | Enhance with Flip-based product image morphing |
| Section dividers | Hard `border-b` CSS | Replace with organic SVG wave/blob dividers |
| Scroll indicator | Chevron icon | Hand-drawn arrow SVG with DrawSVG animation |
| Background | Grain texture (keep) | Add subtle pressed flower / botanical parallax elements |
| Hero background | Particles (remove) | Workshop video loop or cinematic product reel |

### 4.3 CSS Techniques to Implement

```css
/* Sticker rotation — slight random tilt */
.sticker {
  --rotation: 2deg;
  transform: rotate(var(--rotation));
  filter: drop-shadow(2px 3px 4px rgba(0,0,0,0.15));
}
.sticker:nth-child(odd) { --rotation: -3deg; }
.sticker:nth-child(3n) { --rotation: 4deg; }

/* Handwritten annotation */
.handwritten {
  font-family: var(--font-handwritten);
  color: var(--pencil-gray);
  opacity: 0.85;
  transform: rotate(-2deg);
  font-size: 0.875rem;
}

/* Tape strip */
.tape {
  background: linear-gradient(
    180deg,
    rgba(196, 168, 130, 0.6) 0%,
    rgba(196, 168, 130, 0.4) 100%
  );
  width: 80px;
  height: 24px;
  transform: rotate(-5deg);
  position: absolute;
  top: -12px;
}

/* Organic blob divider */
.organic-divider svg {
  width: 100%;
  height: auto;
  display: block;
  margin: -1px 0; /* prevent gap */
}

/* CSS scroll-driven animation (no JS) */
.product-card {
  animation: card-reveal linear both;
  animation-timeline: view();
  animation-range: entry 20% cover 40%;
}
@keyframes card-reveal {
  from { opacity: 0; transform: translateY(30px) rotate(2deg); }
  to { opacity: 1; transform: translateY(0) rotate(var(--card-rotation, 0deg)); }
}
```

### 4.4 Template Artifacts to Remove

**Delete immediately (unused boilerplate):**
- `src/components/ui/orbiting-circles.tsx`
- `src/components/ui/bento-grid.tsx`
- `src/components/ui/animated-beam.tsx`
- `src/components/ui/animated-list.tsx`
- `src/components/ui/animated-shiny-text.tsx`
- `src/components/ui/interactive-grid-pattern.tsx`
- `src/components/ui/number-ticker.tsx`
- `src/components/dashboard/nav-projects.tsx`

**Refactor:**
- `src/app/not-found.tsx` — Replace particles with branded "This page got recycled" design
- `src/components/dashboard/app-sidebar.tsx` — Remove `plan: "Pro"` SaaS language
- `src/components/dashboard/team-switcher.tsx` — Remove team switching concept
- Hero section — Remove particles, replace with workshop video or cinematic imagery

### 4.5 Product Data Enrichment

Every product in Stripe needs these metadata fields populated:

| Field | Purpose | Example |
|-------|---------|---------|
| `story` | Daniel's narrative about this product (2-3 sentences) | "Inspired by the volcanic shores of Lake Atitlán, where I watched the sunrise paint the water seven different colors..." |
| `subtitle` | Poetic material descriptor | "Seven layers of maple, sealed with intention" |
| `handmade_note` | Artisan callout | "Shaped by hand in the Utah workshop" |
| `lead_time` | Days to craft | "5-7" |
| `care_instructions` | Product-specific care | "Thin CA glue finish. Avoid prolonged water exposure." |
| `engraving_available` | Whether engraving is offered | "true" |
| `badge_text` | Custom sticker badge | "New Drop", "Best Seller", "Daniel's Pick" |

---

## Part 5: Content Strategy

### 5.1 Product Descriptions — Written as Daniel

Every product needs a story rewritten in Daniel's voice. Format:

```
[One-line hook — what makes this piece special]

[2-3 paragraphs of story — where the material came from, why Daniel made it,
what it represents. Include specific places, specific moments, specific feelings.]

[Technical details woven naturally into the narrative, not as a spec sheet]
```

**Example (Tolimán Ring):**

> Inspired by the vibrant culture of San Pedro La Laguna on Lake Atitlán, Guatemala — a place that changed everything for me.
>
> I was living there during my mission, collecting broken boards from the local skaters. The colors in this ring — those deep reds and sun-bleached golds — they're the exact layers I peeled from a deck that had been ridden through the cobblestone streets of Panajachel. Seven layers of maple, each one carrying the story of a different session, a different fall, a different decision to get back up.
>
> Sealed with thin CA glue for a smooth, natural finish. Sizes 5-12. Each ring is one of a kind — the color pattern you receive will be unique to your piece.

### 5.2 Micro-Copy & Easter Eggs

Scatter Daniel's voice throughout the site in unexpected places:

| Location | Current | Replace With |
|----------|---------|-------------|
| Cart empty state | "Your cart is empty" | "Nothing here yet — go find your ring" |
| Add to cart button | "Add to Cart" | "This one's mine" or "Add to Cart" (keep clean) |
| Footer tagline | Generic copyright | "Made with love in Mapleton, Utah. Nothing is wasted. Everything is reborn." |
| 404 page | Particles + generic | "This page got recycled. Let's get you back on track." |
| Order confirmation | Generic "thank you" | "Mahalo! Your ring is being shaped right now." |
| Newsletter success | "Thank you for subscribing" | "Welcome to the Rebirth Fam. Talk soon. — Daniel" |
| Loading states | Spinner | "Shaping things up..." |
| Search no results | "No results found" | "Nothing found — try searching for 'skateboard' or 'wedding'" |
| Size guide header | "Sizing Guide" | "Finding your fit" |

### 5.3 Photography Direction

| Type | Guidance |
|------|----------|
| Product shots | Natural lighting, wooden surfaces, workshop context. NOT white background studio. Show the grain, the layers, the imperfections. |
| Lifestyle shots | 23-year-old in nature — hiking, surfing, traveling. Ring on hand with mountains/ocean behind. Golden hour. |
| Workshop shots | Daniel's hands shaping a ring. Wood shavings. Tools. The mess. The process. |
| Unboxing shots | Package just opened on a table. Stickers, card, ring visible. Natural, not styled. |
| Travel shots | Daniel's actual travel photos from Guatemala, Peru, Chile. Film grain feel. |

---

## Part 6: Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Delete template artifacts (9 unused components)
- [ ] Add handwritten font (Caveat or Kalam) to font stack
- [ ] Create `<Sticker>`, `<HandwrittenText>`, `<OrganicDivider>` components
- [ ] Replace hero particles with workshop imagery
- [ ] Fix 404 page (branded "page got recycled")
- [ ] Write product stories for all 30 products (Stripe metadata)
- [ ] Replace micro-copy throughout site

### Phase 2: Homepage Transformation (Week 2-3)
- [ ] New hero section with Daniel's words + sticker badges
- [ ] "Donate a Board" section
- [ ] "What Arrives at Your Door" unboxing section
- [ ] Vinyl record / Rebirth Frequency philosophy section
- [ ] Community / UGC gallery section
- [ ] Organic SVG section dividers (replace hard borders)
- [ ] Enhanced testimonials with handwritten elements

### Phase 3: Product Experience (Week 3-4)
- [ ] Story-first product detail page layout
- [ ] Collection landing pages (editorial, not filtered grid)
- [ ] Sticker badges on product cards
- [ ] Product card slight rotation effect
- [ ] DrawSVG animations for hand-drawn elements
- [ ] Enhanced 3D ring viewer with wood preset stories

### Phase 4: 2026 Collection Launch (Week 4-5)
- [ ] Editorial collection launch page
- [ ] Embedded flower ring documentary-style page
- [ ] Rebirth Frequency crewneck interactive page
- [ ] "First 5 customers free ring" mechanism
- [ ] Journey map (SVG DrawSVG) for travel story

### Phase 5: Polish & Delight (Week 5-6)
- [ ] Easter egg micro-interactions
- [ ] Ambient pressed flower / botanical parallax elements
- [ ] CSS scroll-driven animations (replace JS where possible)
- [ ] Performance audit + Core Web Vitals optimization
- [ ] Mobile experience fine-tuning
- [ ] Lighthouse scores capture for showcase

---

## Part 7: Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Time on site | Unknown | 4+ minutes (story engagement) |
| Pages per session | Unknown | 3+ (browse collection → product → story) |
| Bounce rate | Unknown | < 40% |
| Conversion rate | Unknown | 2-3% (industry avg for DTC jewelry) |
| Lighthouse Performance | Unknown | 90+ |
| Lighthouse Accessibility | Unknown | 95+ |
| "How did you hear about us?" → "The website" | Unknown | Top 3 response |
| Social shares / screenshots | Unknown | Weekly UGC from site experience |
| Awwwards nomination | No | Submit after Phase 5 |

---

## Part 8: What This Is NOT

- This is NOT a template swap. The existing Next.js/Tailwind/GSAP foundation is excellent and stays.
- This is NOT adding more features. It's making existing features feel like Daniel.
- This is NOT a traditional e-commerce optimization. It's turning a store into a brand experience.
- This is NOT about more products. It's about each product having a soul on the page.
- This is NOT minimalism for minimalism's sake. It's warm, organic, artistic, fun — like Daniel.

---

## Appendix A: Reference Brands

| Brand | URL | What to Study |
|-------|-----|--------------|
| Poppi | drinkpoppi.com | Sticker badges, joyful energy, flavor color worlds |
| Couplet Coffee | coupletcoffee.com | Hand-drawn doodles, anti-pretentious copy, organic shapes |
| Recess | takearecess.com | Atmospheric animations, product-matched colors, calm energy |
| Liquid Death | liquiddeath.com | Punk attitude in design, patch art, entertainment-first |
| Ghia | drinkghia.com | Vintage typography, nostalgic warmth, recipe integration |
| Lusano | lusano.com | Moodboard navigation, warm serif type, editorial browsing |
| Patagonia | patagonia.com | Story-first product pages, environmental mission integration |

## Appendix B: Technical References

| Technique | Resource |
|-----------|----------|
| CSS Scroll-Driven Animations | developer.chrome.com/blog/css-ui-ecommerce-sda |
| GSAP DrawSVG Plugin | gsap.com/docs/v3/Plugins/DrawSVGPlugin |
| GSAP MorphSVG Plugin | gsap.com/docs/v3/Plugins/MorphSVGPlugin |
| View Transitions API | developer.chrome.com/docs/web-platform/view-transitions |
| Rive Interactive Animations | rive.app |
| SVG Handwriting Animation | css-tricks.com/svg-line-animation-works |
| Scroll-Driven Animations Demos | scroll-driven-animations.style |

---

*"The lotus grows from mud. A broken board becomes a ring. Change isn't something to resist — it's the force that creates something new."*

*— PRD authored for Seasons & Daniel, March 2026*
