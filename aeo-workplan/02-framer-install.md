# Pasting into Framer

A CLI can't edit a Framer site. Everything here is prepared for copy-paste.

| File | Where in Framer | Notes |
|---|---|---|
| `schema/organization.jsonld` | Site Settings → General → Custom Code → **End of `<head>`** (all pages) | Fill in the `REPLACE` URLs; delete any profile that doesn't exist. Add the logo URL |
| `schema/services-offers.jsonld` | Pricing page → Page settings → Custom Code → End of `<head>` | Also fine on `/services` |
| `schema/faqpage-home.jsonld` | Home page → Page settings → Custom Code | Must match the visible FAQ text word for word |
| FAQPage for `/faq` | `/faq` page settings → Custom Code | Copy the live Q/As into `schema/faq-faq.txt`, then run `python3 schema/make_faqpage.py schema/faq-faq.txt https://quintiavantage.com/faq` |
| `llms.txt` | See below | |

Wrap each JSON file in `<script type="application/ld+json"> … </script>` when pasting. Remove the existing Organization/Service blocks first so you don't ship two conflicting Organization nodes. Validate each published URL at validator.schema.org and search.google.com/test/rich-results.

## How llms.txt is served on Framer
Framer can't upload arbitrary root files the way GitHub Pages can. Check which of these the current `/llms.txt` uses:
1. **Framer's built-in llms.txt** (newer Framer sites auto-generate one; check Site Settings → SEO/AI for an editable field), or
2. **A Framer redirect** from `/llms.txt` to a file hosted elsewhere (Site Settings → Redirects), or
3. **The blueprint app** (`quint-ia-blueprint-funnel` on Vercel) serving it via a rewrite.

Open `https://quintiavantage.com/llms.txt` in a browser, check the response's `content-type` (it should be `text/plain` or `text/markdown`) and whether it redirects. That tells you where to edit it. Paste in `llms.txt` from this folder.
