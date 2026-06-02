# Trio Storefront — Google Stitch Design Specification
# File: nextjs-app/DESIGN.md

This document serves as the machine-readable design token registry and component system specification (aligned with Google Stitch standards). It defines the typography, color scales, animation tokens, and visual rules for the three-tiered storefront experience.

---

## 1. Design System Tokens

### 1.1 Brand Tiering Matrix

| Brand | Persona | Display Typeface | Primary Tone | Spacing/Geometry | Separator |
|---|---|---|---|---|---|
| **Happy Buy** | Vibrant, Value-led | `Instrument Serif` (Italic) | `#D94B26` (Terracotta) | Rounded (10px radius) | Middle Dot (`·`) |
| **Cleopatra** | Muted Luxury, Heritage | `Cormorant` (Serif) | `#6B3A2E` (Espresso Warm) | Sharp (3px radius) | Diamond Star (`✦`) |
| **Modabella** | High-Margin Editorial | `Fraunces` (Light Serif) | `#3A332C` (Warm Espresso) | Soft Minimal (4px radius) | Em Dash (`—`) |

---

## 2. Global Token Definitions (JSON Schema)

```json
{
  "spacing": {
    "base": 4,
    "scale": [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
  },
  "typography": {
    "families": {
      "display": {
        "happybuy": "Instrument Serif, Georgia, serif",
        "cleopatra": "Cormorant, Georgia, serif",
        "modabella": "Fraunces, Georgia, serif"
      },
      "body": {
        "happybuy": "Geist, system-ui, sans-serif",
        "cleopatra": "DM Sans, system-ui, sans-serif",
        "modabella": "Inter Tight, system-ui, sans-serif"
      }
    }
  },
  "effects": {
    "motion": {
      "easing": "cubic-bezier(0.2, 0, 0, 1)",
      "durations": {
        "fast": "120ms",
        "base": "200ms",
        "slow": "320ms"
      }
    },
    "glassmorphism": {
      "blur": "12px",
      "saturate": "180%",
      "background_alpha": "0.85"
    }
  }
}
```

---

## 3. High-Fidelity UI/UX Refinement Goals

To elevate this layout from a baseline MVP to a world-class premium storefront, we will implement the following micro-interaction & styling enhancements:

### 3.1 Glassmorphic Header Integration
* **Rule**: Sticky navigation must not feel like an opaque block. It should blend smoothly with the content passing underneath.
* **Implementation**: Apply `backdrop-filter: blur(12px) saturate(180%)` with a brand-surface background having `0.85` opacity.
* **Transition**: Apply subtle elevation shadows that fade in only when the page is scrolled.

### 3.2 Immersive Image Placeholders & Skeletons
* **Rule**: Gradient boxes must feel deliberate, premium, and alive.
* **Implementation**: Add a custom CSS overlay with a subtle noise/grain texture (`mix-blend-mode: soft-light`, `opacity: 0.15`) and a soft pulsing shimmer animation for initial load sequences.

### 3.3 Micro-Animations for E-Commerce Actions
* **Product Card Hover Zoom**: Hovering a product card must slightly scale the image (`transform: scale(1.03)`) and reveal alternative color swatches or detail tags with a smooth transition.
* **Additive Cart Micro-Feedback**: When an item is added to the cart, the cart pill icon in the header should trigger a scale pop (`transform: scale(1.25)`) and bounce slightly to create physical confirmation.
* **Interactive Size Pill Selectors**: Selection states on size pills must expand outwards with an organic scale spring effect rather than a static background color swap.

### 3.4 Premium Scrollbars & Visual Anchors
* **Rule**: Native browser scrollbars degrade the premium look.
* **Implementation**: Add brand-skinned custom scrollbars that match the active theme's primary color and surface-2 background.
* **Letter-Spacing Anchors**: 
  * Cleopatra text headers will receive slightly expanded letter-spacing (`0.06em`) for a composed, high-end feel.
  * Modabella headers will receive ultra-tight display tracking (`-0.015em`) with light weights to evoke an editorial magazine layout.
