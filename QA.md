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

## Live deployment verified

- Live URL returned HTTP 200 with the updated product-led homepage and minimalist footer.
- A remote, internet-connected browser confirmed all hero, product, laboratory and founder images load. The founder image is lazy-loaded, so it must be checked after its section enters the viewport.
- The hero Next control switched to the next product in the published site.
- No console JavaScript errors and no proposal/disclaimer wording or old-store hyperlinks were found in the published UI.
- Mobile navigation open/close and responsive CSS were checked; local Chromium tests confirmed no horizontal overflow at 360 and 390 px.

## Outstanding deployment dependencies

The local sandbox cannot download the original media into the repository; the storefront currently fetches LUQFA's published photography at runtime. Run the provided importer on a network-connected machine and verify local asset copies with owner consent before migrating to the official domain.

Shopify paid checkout, live inventory, promotions and customer account features cannot be tested until the business provides a Shopify store, all product/variant mappings and authorisation.