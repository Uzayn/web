# SEO Next Steps

## Immediate (before/right after deploy)

- [ ] Create `/public/og-image.png` (1200x630px) — referenced in all OpenGraph metadata
- [ ] Create `/public/logo.png` — referenced in Organization JSON-LD schema
- [ ] Verify site in [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap: `https://winpicks.online/sitemap.xml`
- [ ] Set up [Google Analytics](https://analytics.google.com/) on the site

## Post-Deploy Verification

- [ ] Visit `https://winpicks.online/robots.txt` — confirm it renders correctly
- [ ] Visit `https://winpicks.online/sitemap.xml` — confirm static + dynamic pick URLs appear
- [ ] Test VIP page with [Rich Results Test](https://search.google.com/test/rich-results) — should show FAQ rich result
- [ ] Test pick detail page with Rich Results Test — should show SportsEvent + Breadcrumb
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) — establish performance baseline

## Wire Up Real Data

- [ ] `/picks/[id]/page.tsx` — replace `mockPick` with actual Supabase fetch so `generateMetadata` produces real titles per match
- [ ] `/sitemap.ts` — already pulls from Supabase, verify pick URLs appear after deploy

## Content (ongoing, biggest ranking factor)

- [ ] Publish blog articles targeting long-tail keywords:
  - "Premier League predictions this weekend"
  - "How to read betting odds"
  - "Football accumulator tips"
  - "Best value bets today"
- [ ] Write actual match preview content for pick detail pages (not just odds/selection)
- [ ] Aim for 2-4 blog posts per week to signal freshness to Google

## Off-Page SEO

- [ ] Create social media profiles (Twitter/X, Instagram, Facebook) and add URLs to the `sameAs` array in `src/app/layout.tsx` Organization schema
- [ ] Build backlinks from football/betting forums, guest posts, directories
- [ ] Submit site to betting tip directories and aggregators

## Monitoring (weekly)

- [ ] Check Google Search Console for:
  - Indexing issues
  - New keywords appearing in search
  - Click-through rate trends
  - Crawl errors
- [ ] Track keyword positions for target terms (use Ahrefs, SEMrush, or Ubersuggest)
- [ ] Monitor organic traffic growth in Google Analytics

## Timeline Expectations

- **Week 1-2**: Pages get indexed
- **Month 1-2**: Start appearing for low-competition long-tail keywords
- **Month 3-6**: Meaningful organic traffic if content is published consistently
- **Month 6+**: Compete for higher-volume keywords with enough content + backlinks
