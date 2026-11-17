# LUQFA Beauty

Custom editorial storefront built for GitHub Pages with a Shopify Storefront API integration option.

**Live:** https://shukritobi.github.io/luqfa-beauty/

## Features

- Animated, three-product hero with manual controls, automatic transitions, and reduced-motion support
- Responsive collection with original LUQFA product photography, category filters, sorting, search, and detail views
- Working bag with quantities, removal, and WhatsApp order enquiries to the business's published HQ contact
- Optional Shopify checkout through `shopify-config.js` after a store and product variants have been configured
- Skin ritual picker and streamlined founder / academy content
- Company footer containing publicly listed business contact information
- No links or merchandising redirects to the previous e-commerce storefront

## Run locally

```bash
npm test
npm run dev
```

Or serve the repository folder with any static HTTP server. Deploy from the `main` branch root to GitHub Pages.

## Product data and images

Products and prices are captured catalogue snapshots from November 17, 2026, **not synced inventory or live promotions**. Product photography currently loads from published LUQFA media URLs. With a network-connected machine, `npm run assets` downloads the real images to `assets/official/` and rewrites references to local copies; check each asset and owner permissions before release. The asset manifest is in `ASSET_SOURCES.md`.

## Order fulfilment

Without a Shopify account configured, the shopping bag builds a WhatsApp order enquiry to the published LUQFA HQ number. This does **not** collect payments or place an order: a LUQFA representative confirms variants, availability, delivery and final total. When Shopify credentials and a correct product mapping are configured, the button creates a Shopify cart and opens secure checkout. Never put Admin API secrets in frontend code.

## Production checklist

- Obtain owner approval for the images, copy, legal name, promotions, and business address.
- Connect Shopify, import products with all variant SKUs, manage stock and price synchronization, and test successful paid orders.
- Add owner-approved shipping, return, privacy and terms policies when their wording is supplied.
- Mirror the published image assets locally so the site does not rely on external image hosting.
- Test the live images and payment integration on real customer devices.

## Verification

`npm test` includes static and syntax checks. `QA.md` documents multi-device Chromium interaction testing and the outstanding limitations. The UI follows Hallmark v2's accessible motion, restrained typography and no-fake-proof conventions.