"""
CloudDani Concierge — Lambda handler
Powered by Claude Sonnet 4.6 (Anthropic SDK) with prompt caching.

Architecture:
  Browser → API Gateway HTTP API (POST /chat) → this Lambda → Anthropic API
  Knowledge base is read once at cold start and cached in module scope.
  System prompt uses cache_control: ephemeral — ~90% cost reduction on warm calls.
"""

import json
import os
import pathlib

import anthropic

# ──────────────────────────────────────────────────────────────────────────────
# Cold-start: read knowledge base once; survives between warm Lambda invocations
# ──────────────────────────────────────────────────────────────────────────────
_KB_PATH = pathlib.Path(__file__).parent / "knowledge-base.md"
_KB = _KB_PATH.read_text(encoding="utf-8")

_SYSTEM_TEXT = f"""You are the CloudDani Concierge — an AI assistant on Danielle Washington's \
portfolio at clouddani.com. Help visitors learn about Danielle's career, projects, skills, \
and philosophy. Everything you need is in the knowledge base below.

Do not invent information not found there. If a visitor asks something outside the knowledge base, \
invite them to email Danielle directly at shakara.washington02@gmail.com.

Be warm, direct, and specific — match the energy of the portfolio.

<knowledge_base>
{_KB}
</knowledge_base>"""

_client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

MAX_HISTORY_TURNS = 6  # keep last 6 messages (3 exchanges) to bound context cost

# ──────────────────────────────────────────────────────────────────────────────
# CORS headers — restrict to clouddani.com in production
# ──────────────────────────────────────────────────────────────────────────────
CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://clouddani.com",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}


def _ok(body: dict) -> dict:
    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(body)}


def _err(status: int, message: str) -> dict:
    return {"statusCode": status, "headers": CORS_HEADERS, "body": json.dumps({"error": message})}


# ──────────────────────────────────────────────────────────────────────────────
# Lambda entry point
# ──────────────────────────────────────────────────────────────────────────────
def lambda_handler(event, context):  # noqa: ARG001
    # Handle CORS preflight
    method = event.get("requestContext", {}).get("http", {}).get("method", "")
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        user_msg = body.get("message", "").strip()
        history = body.get("history", [])

        if not user_msg:
            return _err(400, "message is required")

        # Trim history to last MAX_HISTORY_TURNS messages, then append current user message
        messages = history[-(MAX_HISTORY_TURNS):] + [{"role": "user", "content": user_msg}]

        resp = _client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=[
                {
                    "type": "text",
                    "text": _SYSTEM_TEXT,
                    "cache_control": {"type": "ephemeral"},  # prompt caching
                }
            ],
            messages=messages,
        )

        # Log token usage to CloudWatch for cost monitoring
        usage = resp.usage
        print(
            json.dumps(
                {
                    "event": "concierge_call",
                    "input_tokens": usage.input_tokens,
                    "output_tokens": usage.output_tokens,
                    "cache_creation_input_tokens": getattr(usage, "cache_creation_input_tokens", 0),
                    "cache_read_input_tokens": getattr(usage, "cache_read_input_tokens", 0),
                }
            )
        )

        reply = resp.content[0].text
        return _ok({"reply": reply})

    except anthropic.APIStatusError as exc:
        print(f"Anthropic API error: {exc.status_code} — {exc.message}")
        return _err(502, "AI service temporarily unavailable. Please try again in a moment.")

    except anthropic.APIConnectionError as exc:
        print(f"Anthropic connection error: {exc}")
        return _err(503, "Could not reach AI service. Please try again.")

    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected error: {exc}")
        return _err(500, "Internal server error")
