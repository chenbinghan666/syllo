"""Inspect public Moodle mobile configuration without credentials or tokens."""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen


def check_site(raw):
    site = urlsplit(raw.strip())
    if site.scheme != "https" or not site.hostname or site.username or site.password:
        raise ValueError("Use an HTTPS Moodle site URL without credentials.")
    if site.query or site.fragment:
        raise ValueError("Use the site root, not a token or calendar subscription URL.")
    base = urlunsplit((site.scheme, site.netloc, site.path.rstrip("/"), "", ""))
    payload = [{"index": 0, "methodname": "tool_mobile_get_public_config", "args": {}}]
    request = Request(
        base + "/lib/ajax/service.php?info=tool_mobile_get_public_config",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", "Origin": "http://localhost:8765"},
    )
    with urlopen(request, timeout=25) as response:
        rows = json.loads(response.read(2_000_000))
        cors = response.headers.get("Access-Control-Allow-Origin")
    if not isinstance(rows, list) or not rows or rows[0].get("error"):
        raise ValueError("The public mobile configuration was not available.")
    config = rows[0]["data"]
    # Deliberately retain only public capability evidence.
    fields = ["wwwroot", "sitename", "enablewebservices", "enablemobilewebservice",
              "typeoflogin", "launchurl", "tool_mobile_disabledfeatures"]
    return {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "site": base,
        "configuration": {k: config[k] for k in fields if k in config},
        "login_mode": {1: "app", 2: "external_browser", 3: "embedded_browser"}.get(config.get("typeoflogin"), "unknown"),
        "anonymous_probe_cors_allow_origin": cors,
        "account_authorization_tested": False,
        "account_modules_tested": False,
        "note": "Public configuration is not proof of account access or complete module coverage.",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = check_site(args.site)
    text = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=True, indent=2))
