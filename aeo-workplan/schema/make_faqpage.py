"""Build FAQPage JSON-LD from a Q/A file copied verbatim from the live Framer page.

Input format (faq.txt): blocks separated by a blank line, first line "Q: ...", rest "A: ...".
Usage: python3 make_faqpage.py faq-home.txt https://quintiavantage.com/ > faqpage-home.jsonld
Google requires the JSON-LD text to match the visible Q/A text, so paste from the live page, not from memory.
"""
import json, sys

src, page_url = sys.argv[1], sys.argv[2]
items = []
for block in open(src, encoding="utf-8").read().strip().split("\n\n"):
    lines = [l.strip() for l in block.strip().splitlines() if l.strip()]
    q = lines[0].removeprefix("Q:").strip()
    a = " ".join(lines[1:]).removeprefix("A:").strip()
    items.append({"@type": "Question", "name": q,
                  "acceptedAnswer": {"@type": "Answer", "text": a}})
print(json.dumps({"@context": "https://schema.org", "@type": "FAQPage",
                  "@id": page_url.rstrip("/") + "/#faq", "mainEntity": items},
                 ensure_ascii=False, indent=2))
