#!/usr/bin/env python3
"""
India Lake AI Diagnosis - Sensor Telemetry & Automation Client
Connects to n8n workflow 'India Lake AI Diagnosis (Groq)' (ID: CL6bCFtadsf0kmLX)
"""

import json
import sys
import urllib.request
import urllib.error
from datetime import datetime

WEBHOOK_URL = "https://supermanxo777.app.n8n.cloud/webhook/india-lake-monitor-ai"

PRESET_LAKES = {
    "1": {
        "lake": "Bellandur Lake",
        "location": "Bengaluru, Karnataka",
        "ph": 8.9,
        "temperature": 29.5,
        "tds": 850,
        "turbidity": 48.0,
        "do_mgl": 1.8,
        "description": "High sewage inflow & low dissolved oxygen"
    },
    "2": {
        "lake": "Powai Lake",
        "location": "Mumbai, Maharashtra",
        "ph": 7.4,
        "temperature": 27.0,
        "tds": 320,
        "turbidity": 6.5,
        "do_mgl": 6.8,
        "description": "Clean, healthy baseline conditions"
    },
    "3": {
        "lake": "Hussain Sagar",
        "location": "Hyderabad, Telangana",
        "ph": 8.2,
        "temperature": 31.0,
        "tds": 690,
        "turbidity": 22.0,
        "do_mgl": 4.0,
        "description": "Moderate organic load and warm temperature"
    },
    "4": {
        "lake": "Dal Lake",
        "location": "Srinagar, Jammu & Kashmir",
        "ph": 7.1,
        "temperature": 18.0,
        "tds": 180,
        "turbidity": 7.5,
        "do_mgl": 7.5,
        "description": "Sub-alpine fresh water conditions"
    }
}

def send_lake_diagnosis(reading: dict) -> dict:
    """Send sensor reading to n8n webhook and return AI diagnosis."""
    data = json.dumps(reading).encode("utf-8")
    req = urllib.request.Request(
        WEBHOOK_URL,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"[Error] HTTP {e.code}: {e.read().decode('utf-8')}")
        sys.exit(1)
    except Exception as e:
        print(f"[Error] Failed to connect to n8n webhook: {e}")
        sys.exit(1)

def print_report(res: dict):
    status = res.get("status", "Unknown")
    score = res.get("score", 0)
    ai = res.get("ai_analysis", {})

    status_color = "\033[92m" if status == "Good" else ("\033[93m" if status == "Warning" else "\033[91m")
    reset = "\033[0m"
    bold = "\033[1m"

    print("\n" + "=" * 65)
    print(f"{bold}INDIAN LAKE WATER QUALITY AI DIAGNOSIS REPORT{reset}")
    print("=" * 65)
    print(f"Lake:      {bold}{res.get('lake')}{reset} ({res.get('location', 'N/A')})")
    print(f"Timestamp: {res.get('sample_date', datetime.utcnow().isoformat())}")
    print(f"Status:    {status_color}{bold}{status.upper()}{reset} (Score: {score}/100)")
    
    rd = res.get("readings", {})
    print("-" * 65)
    print(f"{bold}Water Parameters:{reset}")
    print(f"  • pH:               {rd.get('ph')} (CPCB standard: 6.5 - 8.5)")
    print(f"  • Dissolved Oxygen: {rd.get('do_mgl')} mg/L (Min safe: >= 5.0 mg/L)")
    print(f"  • TDS:              {rd.get('tds')} ppm (Safe: <= 500 ppm)")
    print(f"  • Turbidity:        {rd.get('turbidity')} NTU (Safe: <= 10 NTU)")
    print(f"  • Temperature:      {rd.get('temperature')} °C")

    flags = res.get("rule_flags", [])
    if flags:
        print(f"\n{bold}Rule Layer Violations:{reset}")
        for f in flags:
            lvl = f.get("level", "warning").upper()
            lvl_color = "\033[91m" if lvl == "CRITICAL" else "\033[93m"
            print(f"  [{lvl_color}{lvl}{reset}] {f.get('param')}: {f.get('value')}{f.get('unit')} -> {f.get('msg')}")

    if ai:
        print(f"\n{bold}AI Diagnostic Summary (Groq):{reset}")
        print(f"  {ai.get('summary', 'N/A')}")

        causes = ai.get("likely_causes", [])
        if causes:
            print(f"\n{bold}Likely Causes:{reset}")
            for c in causes:
                print(f"  • {c}")

        actions = ai.get("recovery_actions", {})
        if actions:
            print(f"\n{bold}Recommended Recovery Roadmap:{reset}")
            if actions.get("immediate"):
                print("  [Immediate Actions]:")
                for a in actions["immediate"]:
                    print(f"    - {a}")
            if actions.get("short_term"):
                print("  [Short-Term Actions]:")
                for a in actions["short_term"]:
                    print(f"    - {a}")
            if actions.get("long_term"):
                print("  [Long-Term Actions]:")
                for a in actions["long_term"]:
                    print(f"    - {a}")

        notify = ai.get("notify", [])
        if notify:
            print(f"\n{bold}Authorities to Notify:{reset}")
            for n in notify:
                print(f"  🚨 {n}")

    print("=" * 65 + "\n")

def main():
    print("India Lake AI Diagnosis Telemetry Client")
    print("Select a test scenario or enter custom readings:")
    for k, v in PRESET_LAKES.items():
        print(f"  [{k}] {v['lake']} ({v['location']}) - {v['description']}")
    print("  [5] Custom Sensor Input")

    choice = input("\nEnter choice (1-5, default 1): ").strip() or "1"
    if choice in PRESET_LAKES:
        data = PRESET_LAKES[choice].copy()
        del data["description"]
    else:
        print("\nEnter custom water readings:")
        data = {
            "lake": input("Lake Name: ").strip() or "Custom Lake",
            "location": input("Location: ").strip() or "India",
            "ph": float(input("pH (e.g. 7.5): ") or 7.5),
            "temperature": float(input("Temperature °C (e.g. 28.0): ") or 28.0),
            "tds": float(input("TDS ppm (e.g. 450): ") or 450),
            "turbidity": float(input("Turbidity NTU (e.g. 8.0): ") or 8.0),
            "do_mgl": float(input("Dissolved Oxygen mg/L (e.g. 6.0): ") or 6.0)
        }

    print(f"\nTransmitting telemetry for {data['lake']} to n8n webhook...")
    result = send_lake_diagnosis(data)
    print_report(result)

if __name__ == "__main__":
    main()
