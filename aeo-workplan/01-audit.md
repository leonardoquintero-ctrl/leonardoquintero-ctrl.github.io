# Audit: schema, llms.txt and copy consistency (2026-09-29)

## What could not be run
`quintiavantage.com` is blocked by this cloud environment's network policy. The live homepage, `/pricing`, `/faq`, `/services` and `/llms.txt` could not be fetched, and neither could `validator.schema.org`. **Everything below comes from the six prototype pages in this repo (`quintia-*.html`) and the Sales Guide facts in `README.md`, not from the live Framer site.** To run the live audit: allow `quintiavantage.com` and `validator.schema.org` in the environment's network settings, or paste each page's HTML source into `validator.schema.org` → *Code snippet*.

## Schema types found (prototype pages)
| Page | Types | Parses? |
|---|---|---|
| Home | Organization (+Offer), WebSite (+SearchAction), FAQPage | Yes |
| Services | Service (3 Offers, UnitPriceSpecification), BreadcrumbList, FAQPage | Yes |
| Pricing | Service (4 Offers), BreadcrumbList, FAQPage | Yes |
| Blueprint | Service + Offer, BreadcrumbList, FAQPage | Yes |
| Why AEO / How AEO | Article, BreadcrumbList, FAQPage (+HowTo) | Yes |
| `/faq` | Not in the prototype. Check the live page | n/a |

## Schema issues to fix on the live site
1. **No `sameAs`** on Organization. The site's own copy tells clients `sameAs` is essential.
2. **`areaServed: "US"` plus a "startups and small businesses" description** contradicts the chosen ICP (LatAm companies selling to US buyers).
3. **WebSite `SearchAction` points to `/?s=`**. Framer has no such search endpoint by default. Remove it unless search exists.
4. **Organization is only linked by `@id`** on inner pages. That's fine, but it only works if the homepage actually ships the full Organization node.
5. **FAQPage is present, but Google only shows FAQ rich results for gov/health sites.** Keep it for answer engines and don't expect a SERP feature.

## Name and price mismatches
| Item | Where | Conflict | Fix |
|---|---|---|---|
| Brand name | Canonical: **Quint-IA Vantage** (confirmed by Leonardo 2026-09-29) | Repo prototypes (49 uses), `README.md`, and the `quintia-aeo-writer` skill all say "Quint·IA Vantage" | Use the hyphen everywhere. Keep "Quint·IA Vantage" only as `alternateName`. Update the writer skill's `brand-context.md` |
| Blueprint scope | Site: "20-prompt visibility baseline across ChatGPT and Perplexity" | Decided 2026-10-05: **10 prompts × 4 engines = 40 live tests**, 3–5 written by the client | Change site copy to "40 live tests: 10 buyer prompts across ChatGPT, Claude, Perplexity and Gemini". Code on `quint-ia-blueprint-funnel` branch `claude/blueprint-required-questions` |
| One-off work | Pricing FAQ: "Blueprint is the only one-off offer"; "No custom scope. No quote required" | Sales Guide sells **Project Work**, custom quote, $1,000 minimum | Rewrite that FAQ answer, or decide Project Work stays off the site |
| Retainer prices | $950 / $1,750 / $2,750 on the site and in the Sales Guide | `index.html` says Citation Engine is $2,500 | Already tracked in README; stale internal doc only |
| Credit offer | Blueprint/Services: "Foundation becomes $450 in month one" | Consistent with the $500 credit. OK | none |

## Copy claims that break the Sales Guide rules ("no claiming clients/results that don't exist")
- Blueprint FAQ: "Roughly 40% of Blueprint buyers do not move directly to a retainer." There is no data behind it. **Remove.**
- Services FAQ: "Most clients start at Foundation or Momentum and move up after 90 days." This implies a client base that doesn't exist. **Rewrite as a policy** ("You can move up a tier after 90 days").
- Services FAQ: "We white-label for a small number of agency partners." Confirm this is true.
- Homepage FAQ: "83 percent zero-click rate" and "357 percent" have no source. They're rows S10 and S11 in `content/source-sheet.csv`. `schema/faq-home.txt` swaps them for the Pew and G2 figures. If you use it, update the visible FAQ to match.
- Homepage FAQ: "First citations typically appear in 30 to 60 days" is borderline under the no-guarantees rule. Consider "We track citations monthly from month one."
