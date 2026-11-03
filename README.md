# SIN’S COFFEE — Ultra-Premium Shopify Online Store 2.0 Theme

> **Brand Positioning:** PREMIUM INDIAN COFFEE. BRITISH EXPERIENCE.  
> **Brand Statement:** INDIAN COFFEE HERITAGE. BRITISH EXCELLENCE.  
> **Domain:** `sinscoffee.co.uk`  
> **Platform:** Shopify Online Store 2.0 (Liquid, JSON Templates, Sections, AJAX Cart API)

---

## 1. Project Overview & Luxury Art Direction

This theme transforms Shopify into an extraordinary, internationally competitive luxury coffee maison. Combining the refinement of Savile Row bespoke craftsmanship with the profound 400-year heritage of Karnataka's Western Ghats shade-grown coffee, the design rejects standard generic templates in favour of:

- **Cinematic Full-Viewport Hero** with roasted coffee beans, espresso pouring in slow motion, atmospheric crema, and gold lighting.
- **Editorial Typography & Hierarchy**: Serif titles in Cormorant Garamond, Bodoni Moda, and Playfair Display paired with clean geometric body text in Manrope and DM Sans.
- **Controlled Luxury Palette**:
  - Matte Black: `#101010`
  - Champagne Gold: `#C6A36B`
  - Warm Ivory: `#F3EBDD`
  - Deep Coffee Brown: `#5A3929`
  - Muted Sand: `#B5A58C`
  - Charcoal: `#292723`
- **Dynamic Shopify Online Store 2.0 Architecture**: 100% manageable via Shopify Theme Customizer with rich schema settings, blocks, and Shopify Ajax Cart API.

---

## 2. Directory Structure

```
cafe.sin/
├── assets/
│   ├── sins-coffee-logo.jpg                # Master uploaded brand identity
│   ├── sins-coffee-logo-clean.png          # Cropped transparent champagne-gold logo
│   ├── sins-coffee-emblem.png              # Monogram cup & bean seal
│   ├── favicon.png                         # 64x64 luxury favicon
│   ├── cinematic-hero-espresso.mp4         # High-definition looping hero video
│   ├── cinematic-coffee-beans.mp4          # Secondary slow-motion beans video
│   ├── plantation-western-ghats.jpg        # Terroir & shade canopy photography
│   ├── coffee-cherries-harvest.jpg         # Ruby harvest picking
│   ├── roasted-coffee-beans.jpg            # Cast-iron drum roasting
│   ├── espresso-crema-pour.jpg             # Crema extraction
│   ├── luxury-cup-editorial.jpg            # British refinement editorial
│   ├── coffee-tin-*.jpg                    # Bespoke packaging compositions
│   ├── process-01 to 05-*.jpg              # 5-stage craftsmanship imagery
│   ├── insta-01 to 05.jpg                  # Editorial chronicle gallery
│   ├── theme.css                           # Core luxury styles & CSS variables
│   ├── responsive.css                      # Dedicated tablet & mobile art direction
│   ├── animations.js                       # GSAP, ScrollTrigger & preloader motion
│   └── theme.js                            # Shopify Ajax Cart, slider & UI logic
├── config/
│   ├── settings_schema.json                # Global theme customizer settings
│   └── settings_data.json                  # Default active configuration
├── layout/
│   └── theme.liquid                        # Master HTML5 layout with preloader
├── locales/
│   └── en.default.json                     # Storefront translations & labels
├── sections/
│   ├── announcement-bar.liquid             # Complimentary delivery ticker
│   ├── luxury-header.liquid                # Floating transparent to matte-black header
│   ├── cinematic-hero.liquid               # Section 01: Full-Screen Cinematic Hero
│   ├── brand-introduction.liquid           # Section 02: Split-screen editorial
│   ├── origin-story.liquid                 # Section 03: Western Ghats mosaic
│   ├── signature-collection.liquid         # Section 04: Dynamic collection showcase
│   ├── coffee-process.liquid               # Section 05: The 5-stage art of coffee
│   ├── tasting-experience.liquid           # Section 06: Warm Ivory sensory matrix
│   ├── brand-philosophy.liquid             # Section 07: Minimalist philosophy
│   ├── brand-statement.liquid              # Section 08: Full-screen matte-black statement
│   ├── instagram-gallery.liquid            # Section 09: Curated chronicle
│   ├── luxury-footer.liquid                # Section 10: Atelier newsletter & footer
│   ├── main-collection.liquid              # Collection catalog with filter & sort
│   ├── main-product.liquid                 # Product detail with variant pills & zoom
│   ├── main-cart.liquid                    # Full cart page
│   ├── main-contact.liquid                 # London concierge inquiry desk
│   ├── story-heritage.liquid               # Editorial Baba Budan 1670 story
│   ├── main-search.liquid                  # Search archive
│   └── main-404.liquid                     # Minimalist 404
├── snippets/
│   ├── product-card.liquid                 # Luxury editorial card with quick-add
│   ├── cart-drawer.liquid                  # Slide-out AJAX cart with free shipping bar
│   ├── search-modal.liquid                 # Predictive instant search overlay
│   └── icon.liquid                         # Custom inline SVG icons
├── templates/
│   ├── index.json                          # Homepage section configuration
│   ├── collection.json                     # Collection template
│   ├── product.json                        # Product template
│   ├── cart.json                           # Cart template
│   ├── page.story.json                     # Our Story template
│   ├── page.contact.json                   # Contact Concierge template
│   ├── search.json                         # Search template
│   └── 404.json                            # 404 template
├── preview/
│   └── index.html                          # Complete standalone interactive preview
└── sins-coffee-luxury-shopify-theme.zip    # Ready-to-upload Shopify Theme Archive
```

---

## 3. How to Install on Shopify

1. Log in to your Shopify Admin (`admin.shopify.com`).
2. Navigate to **Sales Channels** → **Online Store** → **Themes**.
3. Under the **Theme library** section, click **Add theme** → **Upload zip file**.
4. Select the generated archive:  
   `sins-coffee-luxury-shopify-theme.zip` (located in the project folder).
5. Once uploaded, click **Actions** → **Publish** or **Customize** to open the Shopify Theme Editor.

---

## 4. Theme Editor Customisation

All sections feature native `{% schema %}` settings, enabling complete visual control:
- **Hero Video & Headers**: Change the hero MP4, poster images, headlines, and CTAs.
- **Dynamic Collections**: Link any Shopify collection (`collections['signature-reserves']`) to Section 04; products, variants, images, and prices populate dynamically.
- **Palette & Typography**: Customise the headline font, body font, and champagne-gold accent levels from the Theme Settings sidebar.
- **Free UK Delivery Threshold**: Adjust the minimum threshold (default: £45) to dynamically update the slide-out cart progress bar.

---

## 5. Instant Local Preview

To test all pages, video playback, animations, and the interactive cart drawer locally before uploading:
- Open [`preview/index.html`](file:///Users/amanyoonus/Desktop/cafe.sin/preview/index.html) in your browser.
- Or run a local HTTP server:
  ```bash
  python3 -m http.server 8080
  ```
  and visit `http://localhost:8080/preview/index.html`.

