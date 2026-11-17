# QA summary, 17 November 2026

- `npm test` passed: entry points, syntax, 10 product catalogue entries, prices and official source URLs, unique HTML IDs, and Shopify connector files.
- Browser interaction checks passed at **1440 x 900** and **390 x 844** with Chromium and injected static document: render 10 entries, switch to cleansing category (2 entries), add item to bag, update count, close drawer, recommend sunscreen for sun-care focus, expand and close mobile menu.
- No browser JavaScript exceptions in the tested paths.
- HTML document width matched both viewport widths, so no horizontal overflow was observed at those sizes.
- Full visual test of remote images was **not possible** due to external network restrictions. The screenshots made during testing used blank remote-image frames and are deliberately not included in the website archive. Check the real product photos after assets are downloaded or during hosted review.
- No production Shopify checkout or payments tested because store credentials and owner authorisation were not provided.