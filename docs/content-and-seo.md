# AURELLE typography, content and search setup

## Editorial approach

Georgia provides a familiar, restrained serif for campaign and section headings. Locally hosted DM Sans provides readable body text, product names and controls. `src/app/typography.css` holds the shared scale and mobile adjustments. The photography, parallax and shopping interactions remain in place.

Copy describes the design, materials, dimensions, fit and styling options. Removed filler includes chapter numbering, duplicate campaign captions, repeated abstract slogans and unnecessary product taglines. Product names, IDs, prices, variants and specifications remain consistent with the demo catalogue. Portfolio disclosures remain in the footer, product information, FAQs and checkout. No testimonials or real-sales claims have been added.

## Search implementation

- The homepage, category pages and eight product pages have descriptive titles, descriptions and canonical URLs.
- Social previews use campaign or product imagery appropriate to the route.
- Category headings and descriptions are rendered on the server for direct category URLs.
- `/sitemap.xml` includes the homepage, collection and category URLs, and products. `/robots.txt` points to the sitemap.
- Storefront pages allow indexing. Checkout, the concept page and new-arrival filter variants use `noindex`. Product and campaign descriptions identify the portfolio concept; no merchant offer or review structured data has been fabricated.
- Set `NEXT_PUBLIC_SITE_URL=https://your-final-domain.example` before the production build. The same origin is used for metadata, sitemap and robots. Vercel's deployment URL is the fallback; local development uses localhost.

After deployment, verify canonical URLs on the final domain, submit the sitemap in Google Search Console, and replace illustrative product information with the brand's approved catalogue before accepting orders. This implementation improves discoverability; it does not guarantee indexing or rankings.

Primary reference: [Google's SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), particularly descriptive titles, useful content, clear links and duplicate-URL handling.
