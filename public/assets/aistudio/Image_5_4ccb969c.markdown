---
name: Sunny Spark Voice
colors:
  surface: '#fff8f3'
  surface-dim: '#e9d7c0'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff2e2'
  surface-container: '#feebd3'
  surface-container-high: '#f8e6cd'
  surface-container-highest: '#f2e0c8'
  on-surface: '#231a0c'
  on-surface-variant: '#554434'
  inverse-surface: '#392f1f'
  inverse-on-surface: '#ffeed9'
  outline: '#887361'
  outline-variant: '#dbc2ad'
  surface-tint: '#8b5000'
  primary: '#8b5000'
  on-primary: '#ffffff'
  primary-container: '#ff9800'
  on-primary-container: '#653900'
  inverse-primary: '#ffb870'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#b0284b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff90a1'
  on-tertiary-container: '#8a0332'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbe'
  primary-fixed-dim: '#ffb870'
  on-primary-fixed: '#2c1600'
  on-primary-fixed-variant: '#693c00'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#ffd9dd'
  tertiary-fixed-dim: '#ffb2bc'
  on-tertiary-fixed: '#400012'
  on-tertiary-fixed-variant: '#8f0935'
  background: '#fff8f3'
  on-background: '#231a0c'
  surface-variant: '#f2e0c8'
typography:
  headline-xl:
    fontFamily: Quicksand
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
  headline-xl-mobile:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  label-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  label-md:
    fontFamily: Quicksand
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
  phonetic-display:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system delivers an intuitive, empowering, and delightful voice-first companion experience for children learning new languages. The visual direction balances safety, high readability, and physical playfulness, creating an environment that feels like an enchanted, interactive picture book rather than a standard utility app.

### Design Direction
- **Tactile Soft-Pop & Toybox UI:** Volumetric, squishy UI elements with subtle dual-tier bevels and organic pill shapes that invite exploration.
- **Child-Safe Ergonomics:** Minimum interactive touch target scale of 56px, oversized hit-areas, high color contrast, and immediate multi-modal confirmation (visual bounce, audio wave pulsations, and color aura shifts).
- **Expressive Character States:** Centered around the animated companion core—transitioning seamlessly between gentle idle breathing, attentive listening ripples, rhythmic speech waveforms, and joyful celebration bursts.

## Colors

The color palette centers on warm, high-energy tones calibrated against deeply legible base contrasts on soothing warm backgrounds. 

### Palette Architecture
- **Primary (Electric Amber / Gold - `#FF9800`, core `#FFB800`):** Drives primary action anchors, reward tokens, voice triggers, and dynamic energy glows.
- **Secondary (Sky Cyan - `#0284C7`, accent `#38BDF8`):** Applied to listening states, educational hint pathways, and linguistic flashcards.
- **Tertiary (Bubblegum Coral - `#FF6584`):** Designates interactive recording toggles, game progression marks, and warm feedback badges.
- **Success Accent (Lush Lime - `#22C55E`):** Reserved exclusively for positive reinforcement, correct phonics completion, and praise milestones.
- **Neutrals & Surfaces:** Canvas foundation defaults to `#FFFDF7` with secondary elevated cards at `#F8F4EA`. Text elements utilize deep, friendly chocolate espresso (`#3A2E1E` and `#5A4E3C`), completely eschewing harsh `#000000` to preserve a soft, book-like tone while surpassing WCAG AAA contrast ratios for early readers.

## Typography

The typography leverages **Quicksand** across all tiers to deliver distinct, open letterforms with rounded terminals. The geometry reinforces phonetic recognition and visual ease for emergent readers and multilingual children.

### Structural Rules
- **Proportional Spacing:** Generous line heights are strictly maintained to eliminate reading fatigue and line tracking collisions.
- **Enhanced Phonetics:** The specialized `phonetic-display` role provides elevated kerning (`+0.04em`) and increased weight to ensure clear syllabic chunking during pronunciation drills.
- **Hierarchy Guidance:** Body copy should rarely drop below 18px on handheld tablets and mobile screens to accommodate early visual development stages.

## Layout & Spacing

The layout is built upon an 8pt rhythmic grid within a flexible fluid container, enforcing generous defensive boundaries to protect accidental edge touches during two-handed device grips.

### Adaptive Behavior
- **Mobile (portrait phone):** 4-column fluid system. Touch targets remain centered along the lower two-thirds of the viewport to encourage comfortable thumb reach while the interactive voice avatar holds the central third.
- **Tablet (768px - 1024px, landscape & portrait):** 8-column layout. The interaction plane bifurcates: companion visualizer occupies the left/top flank, while interactive language choices, flashcards, and sound bubbles cluster on the actionable dominant zone.
- **Desktop / Smart Display (1024px+):** 12-column layout pinned to a max-width of 1200px, centering gameplay and vocal interactions without isolating peripherals.

## Elevation & Depth

Visual hierarchy uses warm, physical, and soft-dimensional physics instead of sterile gray drop shadows or flat outlines.

### Depth Mechanisms
- **Clay Underlays & Bottom Borders:** Buttons and interactive cards feature a matching saturated bottom bevel (`box-shadow: 0 6px 0 [darkened_tint]`), creating an irresistible "press me" toy tactile feel that collapses on active touch.
- **Warm Ambient Radiance:** Modals and focal elements float above the `#FFFDF7` base using wide, low-opacity amber-tinted shadows (`0 16px 36px -8px rgba(184, 134, 11, 0.14)`).
- **Audio Orb Auras:** Active companion voice states project rhythmic, translucent multi-layered colored light rings (e.g., `#38BDF8` cyan rings pulsing at 1.4-second intervals during input capture).

## Shapes

The design system embraces extreme hyper-roundedness to evoke friendliness, safety, and play. Sharp corners (`< 16px`) are entirely avoided in child-facing viewports.

### Geometry Specifications
- **Interactive Surfaces:** Standard cards and content frames utilize continuous curvature squircles with radii between `24px` and `32px`.
- **Buttons & Tags:** Fully pill-shaped (`9999px`) to reinforce tactile pebble or squishy toy motifs.
- **Speech Bubbles & Flash Badges:** Rounded bubbles incorporate organic offset tail radii to match conversational storybook aesthetics.

## Components

### 1. Voice Interaction Core (The Living Orb)
- **Idle State:** A breathing squircle/orb rendered in smooth sunny amber gradient (`#FFB800` to `#FF9800`) with two animated blinking eyes or glowing core dot.
- **Listening State:** Transforms into calm cyan (`#38BDF8`), expanding outward concentric soft shockwaves reacting in real-time to microphone audio levels.
- **Speaking State:** Gently oscillates in sync with audio output, surrounded by floating phonetic sound-wave particles.
- **Cheering State:** Radiates lime green (`#22C55E`) and bubblegum pink (`#FF6584`) starburst micro-particles upon successful user pronunciation.

### 2. Chunky Push Buttons
- Built with a 64px default height.
- Styled with a 4px-to-6px solid color lip at the bottom. On touch down/active state, the lip compresses via `transform: translateY(4px)` with an immediate tactile spring animation.
- Accompanied by large icon glyphs (32px) and bold, high-contrast typography.

### 3. Sound Effect Bubble Tags
- Pill-shaped chips rendered in tinted backgrounds (e.g., `#E0F2FE` with `#0284C7` text).
- Include an integrated mini speaker icon that replays phonetic pronunciation or contextual animal/object sounds when tapped.

### 4. Squircle Flash Cards
- Padded with `space-lg`, built on warm cream background `#F8F4EA`, framed with a subtle 3px solid border tinted slightly darker than the base (`#EADFC7`).
- Includes prominent picture imagery, oversized native text, and contrasting phonetic subtext using the dedicated `phonetic-display` token.

### 5. Input & Selection Controls
- **Radio & Checkboxes:** Replaced with chunky selectable picture-tile cards with 24px rounded corners and checkmark stamp badges that pop in with an elastic overshoot curve.
- **Text Inputs (Parent Gate / Search):** Fully rounded pill containers with a soft 3px border in `#EADFC7` that transitions to sky cyan (`#38BDF8`) on focus with an ambient halo.