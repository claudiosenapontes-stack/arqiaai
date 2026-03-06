#!/usr/bin/env python3
"""Gamma API helper.

- Creates a Gamma generation from input text.
- Polls until completed.

Docs: https://developers.gamma.app/docs/getting-started
"""

import argparse
import json
import os
import sys
import time
import urllib.request

BASE = "https://public-api.gamma.app/v1.0"


def _read_key() -> str:
    key = (os.environ.get("GAMMA_API_KEY") or "").strip()
    if key:
        return key
    # Fallback to server credential file
    path = "/root/.clawdbot/credentials/gamma.token"
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""


def _request(method: str, path: str, key: str, payload: dict | None = None) -> dict:
    url = f"{BASE}{path}"
    data = None
    headers = {
        "X-API-KEY": key,
        "accept": "application/json",
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, method=method, headers=headers, data=data)
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = resp.read().decode("utf-8", errors="replace")
        return json.loads(body)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="Input text/prompt")
    ap.add_argument("--format", default="document", choices=["presentation", "document", "social", "webpage"]) 
    ap.add_argument("--text-mode", default="generate", choices=["generate", "condense", "preserve"]) 
    ap.add_argument("--theme-id", default="", help="Optional Gamma themeId")
    ap.add_argument("--folder-id", action="append", default=[], help="Optional folderId(s)")
    ap.add_argument("--poll-seconds", type=int, default=3)
    ap.add_argument("--timeout-seconds", type=int, default=180)
    args = ap.parse_args()

    key = _read_key()
    if not key:
        print("Missing GAMMA_API_KEY (or /root/.clawdbot/credentials/gamma.token)", file=sys.stderr)
        return 2

    payload: dict = {
        "inputText": args.input,
        "textMode": args.text_mode,
        "format": args.format,
    }
    if args.theme_id:
        payload["themeId"] = args.theme_id
    if args.folder_id:
        payload["folderIds"] = args.folder_id

    res = _request("POST", "/generations", key, payload)
    gen_id = res.get("generationId")
    if not gen_id:
        print(json.dumps(res, indent=2)[:2000], file=sys.stderr)
        raise SystemExit("No generationId returned")

    deadline = time.time() + args.timeout_seconds
    while time.time() < deadline:
        status = _request("GET", f"/generations/{gen_id}", key)
        st = status.get("status")
        if st == "completed":
            print(json.dumps(status, indent=2))
            return 0
        if st in ("failed", "canceled"):
            print(json.dumps(status, indent=2), file=sys.stderr)
            return 1
        time.sleep(args.poll_seconds)

    print(f"Timed out waiting for generation {gen_id}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
