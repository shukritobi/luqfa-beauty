# LUQFA storefront QA — 17 November 2026

## Automated tests completed

- `npm test`: PASS, 10 product entries, unique IDs, links/no disclaimer guards, JavaScript syntax and required files.
- Chromium JS and layout checks at **1440×900, 1024×768, 768×1024, 390×844, 360×740**: PASS. No horizontal overflow or runtime JavaScript exceptions in the tested interactions.
- Product carousel: previous/next and direct pagination: PASS.
- Product category filters, sorting and live search: PASS.
- Product quick view and close: PASS.
- Add to bag, increment, remove, count/subtotal: PASS.
- WhatsApp enquiry: correct business HQ link, selected product and quantity in the encoded message: PASS.
- Routine finder and mobile navigation: PASS.
- Unnecessary internal banner/disclaimer wording and links to the old webshop removed: PASS.
- Reduced-motion CSS and no-script content fallback: REVIEWED.

## External dependency not testable here

The sandbox cannot download images from LUQFA's media host, and Chromium only has local document access. Therefore local screenshots show blank image placeholders and cannot validate the live product photos. The published site must be visually checked with real network access and the image importer should be run on a connected machine before production launch.

Shopify paid checkout, live inventory, promotions and customer account features cannot be tested until the business provides a Shopify store, all product/variant mappings and authorisation.