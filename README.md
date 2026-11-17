# LUQFA Beauty — Editorial storefront concept

**Status: Unofficial redesign proposal, not a live or endorsed LUQFA store.**

A custom responsive storefront for LUQFA Beauty, built from their **published catalogue** and founder information. The visual direction draws on Hallmark v2's editorial-design rules: real material before design, original composition, strong typographic hierarchy, careful contrast and accessible interactions. No generic Shopify theme, fabricated testimonials or fake conversion counters.

## Start

Open via a static web server (JavaScript ES modules require HTTP):

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

Or deploy the repository root on GitHub Pages or Cloudflare Pages as a static site, with build command blank and output directory `/`.

## What works now

- Responsive desktop/tablet/phone layouts and editorial homepage
- Real LUQFA product names, original source photograph URLs, sampled public MYR prices and source product links
- Filter and sort, search, product detail dialog, skin routine suggestions
- Local-session shopping bag with add/remove/quantity updates
- Default checkout sends visitors to the official LUQFA website, **not a fake checkout**
- Optional headless Shopify integration once owner enables a Storefront API and confirms product handles
- Source manifest and opt-in asset copier to create local asset files

## Bring the photographs in locally

The sandbox in which the site was authored could access source descriptions and image URLs, but **could not download external binary image files**. For this reason the prototype initially loads the **real published photography from LUQFA's server** at runtime, not generated lookalikes.

On a network-connected computer, run:

```bash
npm run assets
```

The script downloads 10 product images, the brand logo, founder and laboratory photos into `assets/official/`, rewrites the external images in `index.html` where successful, and generates `assets/asset-config.js` for the product images. Failed downloads retain verified external URLs. Run it **before** packaging or deploying publicly and obtain the brand owner's permission to reuse the photos and logos.

## Shopify integration

**Shopify itself is proprietary.** This site uses an original frontend with Shopify Storefront API support. Shopify's official Hydrogen framework is open-source, but adopting Hydrogen specifically would add a separate deployment/runtime and is unnecessary for this independent static concept. The official API is the supported headless commerce interface.

To activate checkout once the owner has a Shopify storefront:

1. Create/identify the Shopify store, add products/variants, and grant Storefront API access.
2. Edit `shopify-config.js` to set the store domain and **public** Storefront API token, not an Admin token.
3. Ensure `products.js` `handle` values match Shopify's product handles. The current handles refer to the existing LUQFA shop, and may differ in Shopify.
4. Open the site and test an end-to-end test order. Shopify creates the cart and provides the secure checkout URL.

**Not implemented without owner credentials:** live inventory, customer accounts, discounts, order histories, refund processing, transaction processing and email marketing. Prices and availability are not live.

## Notes for a real client launch

- Ask the owner to approve product copy, photography, branded logo usage and published claims.
- Migrate or synchronize the full catalogue, **all product variants**, images, stock, tax, delivery and discounts.
- Review claims, SPF/PA accuracy, ingredient lists, NPRA/halal information, privacy policy, and standard commerce policies.
- Ensure Shopify headless configuration supports the specific Malaysian payment and shipping methods required by the client.
- Current site is a proposal. Do not swap the existing domain or connect payments without explicit approval.

## Research sources

- Official homepage: https://luqfabeautyofficial.com/
- Official founder story: https://luqfabeautyofficial.com/about-us
- Official link hub: https://linktr.ee/luqfabeautyhq
- Shopify Storefront API: https://shopify.dev/docs/api/storefront/latest
- Hallmark design skill: https://github.com/Nutlope/hallmark

All prices were observed on **17 November 2026** and must be verified again before release.