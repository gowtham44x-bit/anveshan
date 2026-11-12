#!/usr/bin/env python3
"""
Firecrawl Web Collector for All India Lake Monitoring System
Uses Firecrawl v2 API to scrape, extract, and convert lake water research/news to clean Markdown.
"""

import json
import sys
import urllib.request
import urllib.error

FIRECRAWL_API_KEY = "fc-6f95daba5cd547548b265cc9e3672532"
FIRECRAWL_API_URL = "https://api.firecrawl.dev/v2/scrape"

DEFAULT_SOURCES = {
    "1": {
        "title": "Bellandur Lake Environmental Profile",
        "url": "https://en.wikipedia.org/wiki/Bellandur_Lake"
    },
    "2": {
        "title": "People's Water Data - Citizen Water Quality Map",
        "url": "https://peopleswaterdata.org/"
    },
    "3": {
        "title": "Central Pollution Control Board (CPCB) Water Portal",
        "url": "https://cpcb.nic.in/water-pollution/"
    },
    "4": {
        "title": "Dal Lake (Srinagar) Profile & Weed Management",
        "url": "https://en.wikipedia.org/wiki/Dal_Lake"
    }
}

def scrape_url(target_url: str) -> dict:
    """Scrape a web page using Firecrawl v2 API."""
    payload = json.dumps({
        "url": target_url,
        "formats": ["markdown"]
    }).encode("utf-8")

    req = urllib.request.Request(
        FIRECRAWL_API_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
            "Content-Type": "application/json"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"[Error] Firecrawl API HTTP {e.code}: {e.read().decode('utf-8')}")
        sys.exit(1)
    except Exception as e:
        print(f"[Error] Failed to connect to Firecrawl: {e}")
        sys.exit(1)

def main():
    print("=======================================================")
    print("All India Lake Monitoring - Firecrawl Web Scraper")
    print("=======================================================")
    print("Select a pre-configured water source or enter a custom URL:")
    for k, v in DEFAULT_SOURCES.items():
        print(f"  [{k}] {v['title']} ({v['url']})")
    print("  [5] Custom URL (Government circular, news, or blog)")

    choice = input("\nEnter choice (1-5, default 1): ").strip() or "1"
    if choice in DEFAULT_SOURCES:
        url = DEFAULT_SOURCES[choice]["url"]
    else:
        url = input("Enter full URL (https://...): ").strip()

    if not url:
        print("Invalid URL.")
        return

    print(f"\n[Firecrawl] Scraping {url} into clean LLM Markdown...")
    res = scrape_url(url)

    if res.get("success"):
        data = res.get("data", {})
        md = data.get("markdown", "")
        meta = data.get("metadata", {})
        
        print("\n" + "=" * 60)
        print(f"TITLE:   {meta.get('title', 'N/A')}")
        print(f"SOURCE:  {meta.get('sourceURL', url)}")
        print(f"STATUS:  HTTP {meta.get('statusCode', 200)} (Credits used: {meta.get('creditsUsed', 1)})")
        print("=" * 60)
        
        preview = md[:1200] + ("\n... [Truncated for preview]" if len(md) > 1200 else "")
        print(preview)
        print("\n" + "=" * 60)

        # Save to file
        filename = "scraped_lake_data.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(md)
        print(f"\nFull Markdown saved to {filename}")
    else:
        print(f"[Failed] Firecrawl response: {res}")

if __name__ == "__main__":
    main()
