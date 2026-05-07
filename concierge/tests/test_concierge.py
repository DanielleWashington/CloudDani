"""
Unit tests for concierge.py (CloudDani Concierge Lambda handler)

Run with:
    cd /Users/daniellewashington/CloudDani
    python3 -m pytest concierge/tests/ -v
"""

import json
import os
import sys
import unittest
from unittest.mock import MagicMock, patch

# ──────────────────────────────────────────────────────────────────────────────
# Bootstrap: set env var and mock the Anthropic client before import so the
# module loads cleanly without hitting the real API or needing a real key.
# We let pathlib.Path.read_text run normally — knowledge-base.md exists on disk.
# ──────────────────────────────────────────────────────────────────────────────
os.environ.setdefault("ANTHROPIC_API_KEY", "test-key-not-real")

with patch("anthropic.Anthropic"):
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    import concierge  # noqa: E402


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _make_event(method="POST", body=None):
    """Build a minimal API Gateway HTTP API event."""
    return {
        "requestContext": {"http": {"method": method}},
        "body": json.dumps(body) if body is not None else None,
    }


def _make_anthropic_response(text="Hello from Claude."):
    """Return a mock Anthropic Messages response object."""
    content_block = MagicMock()
    content_block.text = text

    usage = MagicMock()
    usage.input_tokens = 100
    usage.output_tokens = 50
    usage.cache_creation_input_tokens = 80
    usage.cache_read_input_tokens = 0

    resp = MagicMock()
    resp.content = [content_block]
    resp.usage = usage
    return resp


# ──────────────────────────────────────────────────────────────────────────────
# Test classes
# ──────────────────────────────────────────────────────────────────────────────

class TestCORSPreflight(unittest.TestCase):
    """OPTIONS requests must return 200 with no body processing."""

    def test_options_returns_200(self):
        event = _make_event(method="OPTIONS")
        result = concierge.lambda_handler(event, None)
        self.assertEqual(result["statusCode"], 200)

    def test_options_has_cors_headers(self):
        event = _make_event(method="OPTIONS")
        result = concierge.lambda_handler(event, None)
        headers = result["headers"]
        self.assertIn("Access-Control-Allow-Origin", headers)
        self.assertEqual(headers["Access-Control-Allow-Origin"], "https://clouddani.com")
        self.assertIn("POST", headers["Access-Control-Allow-Methods"])

    def test_options_does_not_call_anthropic(self):
        event = _make_event(method="OPTIONS")
        with patch.object(concierge._client, "messages") as mock_msgs:
            concierge.lambda_handler(event, None)
            mock_msgs.create.assert_not_called()


class TestInputValidation(unittest.TestCase):
    """Bad or missing input must return 400 without calling the AI."""

    def test_missing_body_returns_400(self):
        event = _make_event(method="POST")
        event["body"] = None
        result = concierge.lambda_handler(event, None)
        self.assertEqual(result["statusCode"], 400)

    def test_empty_message_returns_400(self):
        event = _make_event(method="POST", body={"message": ""})
        result = concierge.lambda_handler(event, None)
        self.assertEqual(result["statusCode"], 400)

    def test_whitespace_only_message_returns_400(self):
        event = _make_event(method="POST", body={"message": "   "})
        result = concierge.lambda_handler(event, None)
        self.assertEqual(result["statusCode"], 400)

    def test_400_body_contains_error_key(self):
        event = _make_event(method="POST", body={"message": ""})
        result = concierge.lambda_handler(event, None)
        body = json.loads(result["body"])
        self.assertIn("error", body)

    def test_400_does_not_call_anthropic(self):
        event = _make_event(method="POST", body={"message": ""})
        with patch.object(concierge._client.messages, "create") as mock_create:
            concierge.lambda_handler(event, None)
            mock_create.assert_not_called()


class TestSuccessfulResponse(unittest.TestCase):
    """Happy path — valid message returns Claude's reply."""

    def setUp(self):
        self.event = _make_event(
            method="POST",
            body={"message": "What did Danielle do at Weaviate?", "history": []}
        )
        self.mock_resp = _make_anthropic_response("She drove documentation strategy.")

    def test_returns_200(self):
        with patch.object(concierge._client.messages, "create", return_value=self.mock_resp):
            result = concierge.lambda_handler(self.event, None)
        self.assertEqual(result["statusCode"], 200)

    def test_reply_in_body(self):
        with patch.object(concierge._client.messages, "create", return_value=self.mock_resp):
            result = concierge.lambda_handler(self.event, None)
        body = json.loads(result["body"])
        self.assertIn("reply", body)
        self.assertEqual(body["reply"], "She drove documentation strategy.")

    def test_response_has_cors_header(self):
        with patch.object(concierge._client.messages, "create", return_value=self.mock_resp):
            result = concierge.lambda_handler(self.event, None)
        self.assertEqual(
            result["headers"]["Access-Control-Allow-Origin"],
            "https://clouddani.com"
        )

    def test_calls_correct_model(self):
        with patch.object(concierge._client.messages, "create", return_value=self.mock_resp) as mock_create:
            concierge.lambda_handler(self.event, None)
        call_kwargs = mock_create.call_args.kwargs
        self.assertEqual(call_kwargs["model"], "claude-sonnet-4-6")

    def test_system_prompt_has_cache_control(self):
        with patch.object(concierge._client.messages, "create", return_value=self.mock_resp) as mock_create:
            concierge.lambda_handler(self.event, None)
        system = mock_create.call_args.kwargs["system"]
        self.assertEqual(len(system), 1)
        self.assertEqual(system[0]["cache_control"]["type"], "ephemeral")

    def test_knowledge_base_in_system_prompt(self):
        with patch.object(concierge._client.messages, "create", return_value=self.mock_resp) as mock_create:
            concierge.lambda_handler(self.event, None)
        system_text = mock_create.call_args.kwargs["system"][0]["text"]
        # The real KB content should be present in the system prompt
        self.assertIn("Danielle Washington", system_text)

    def test_user_message_appended_to_messages(self):
        with patch.object(concierge._client.messages, "create", return_value=self.mock_resp) as mock_create:
            concierge.lambda_handler(self.event, None)
        messages = mock_create.call_args.kwargs["messages"]
        self.assertEqual(messages[-1]["role"], "user")
        self.assertEqual(messages[-1]["content"], "What did Danielle do at Weaviate?")


class TestConversationHistory(unittest.TestCase):
    """History is trimmed and prepended correctly."""

    def _call_with_history(self, history):
        event = _make_event(
            method="POST",
            body={"message": "Follow-up question", "history": history}
        )
        mock_resp = _make_anthropic_response("Good follow-up.")
        with patch.object(concierge._client.messages, "create", return_value=mock_resp) as mock_create:
            concierge.lambda_handler(event, None)
        return mock_create.call_args.kwargs["messages"]

    def test_short_history_passed_through(self):
        history = [
            {"role": "user",      "content": "Hello"},
            {"role": "assistant", "content": "Hi there!"},
        ]
        messages = self._call_with_history(history)
        # 2 history + 1 current = 3
        self.assertEqual(len(messages), 3)
        self.assertEqual(messages[0]["role"], "user")
        self.assertEqual(messages[0]["content"], "Hello")

    def test_long_history_is_trimmed(self):
        # 20 messages (10 turns) — must be trimmed to MAX_HISTORY_TURNS
        history = []
        for i in range(10):
            history.append({"role": "user",      "content": f"Q{i}"})
            history.append({"role": "assistant",  "content": f"A{i}"})
        messages = self._call_with_history(history)
        # MAX_HISTORY_TURNS + 1 current message
        self.assertLessEqual(len(messages), concierge.MAX_HISTORY_TURNS + 1)

    def test_current_message_always_last(self):
        history = [
            {"role": "user",      "content": "Previous question"},
            {"role": "assistant", "content": "Previous answer"},
        ]
        messages = self._call_with_history(history)
        self.assertEqual(messages[-1]["role"], "user")
        self.assertEqual(messages[-1]["content"], "Follow-up question")

    def test_empty_history_works(self):
        messages = self._call_with_history([])
        self.assertEqual(len(messages), 1)
        self.assertEqual(messages[0]["role"], "user")

    def test_missing_history_key_works(self):
        """history is optional — should default to empty list."""
        event = _make_event(method="POST", body={"message": "No history key"})
        mock_resp = _make_anthropic_response("Fine.")
        with patch.object(concierge._client.messages, "create", return_value=mock_resp) as mock_create:
            result = concierge.lambda_handler(event, None)
        self.assertEqual(result["statusCode"], 200)


class TestErrorHandling(unittest.TestCase):
    """API errors must return safe, user-friendly responses — no stack traces."""

    def test_anthropic_api_status_error_returns_502(self):
        import anthropic as anthropic_lib
        event = _make_event(method="POST", body={"message": "Hello"})
        exc = anthropic_lib.APIStatusError(
            message="Rate limit exceeded",
            response=MagicMock(status_code=429, headers={}),
            body={}
        )
        with patch.object(concierge._client.messages, "create", side_effect=exc):
            result = concierge.lambda_handler(event, None)
        self.assertEqual(result["statusCode"], 502)

    def test_anthropic_api_status_error_body_has_error_key(self):
        import anthropic as anthropic_lib
        event = _make_event(method="POST", body={"message": "Hello"})
        exc = anthropic_lib.APIStatusError(
            message="Overloaded",
            response=MagicMock(status_code=529, headers={}),
            body={}
        )
        with patch.object(concierge._client.messages, "create", side_effect=exc):
            result = concierge.lambda_handler(event, None)
        body = json.loads(result["body"])
        self.assertIn("error", body)

    def test_anthropic_connection_error_returns_503(self):
        import anthropic as anthropic_lib
        event = _make_event(method="POST", body={"message": "Hello"})
        exc = anthropic_lib.APIConnectionError(request=MagicMock())
        with patch.object(concierge._client.messages, "create", side_effect=exc):
            result = concierge.lambda_handler(event, None)
        self.assertEqual(result["statusCode"], 503)

    def test_unexpected_exception_returns_500(self):
        event = _make_event(method="POST", body={"message": "Hello"})
        with patch.object(concierge._client.messages, "create", side_effect=RuntimeError("boom")):
            result = concierge.lambda_handler(event, None)
        self.assertEqual(result["statusCode"], 500)

    def test_error_response_never_exposes_stack_trace(self):
        event = _make_event(method="POST", body={"message": "Hello"})
        with patch.object(concierge._client.messages, "create", side_effect=RuntimeError("secret internal error")):
            result = concierge.lambda_handler(event, None)
        body = json.loads(result["body"])
        self.assertNotIn("secret internal error", body.get("error", ""))
        self.assertNotIn("Traceback", body.get("error", ""))

    def test_all_error_responses_have_cors_headers(self):
        event = _make_event(method="POST", body={"message": "Hello"})
        with patch.object(concierge._client.messages, "create", side_effect=RuntimeError("boom")):
            result = concierge.lambda_handler(event, None)
        self.assertIn("Access-Control-Allow-Origin", result["headers"])


class TestCORSHeadersOnAllResponses(unittest.TestCase):
    """CORS headers must appear on every response — 200, 400, 500, OPTIONS."""

    REQUIRED = {
        "Access-Control-Allow-Origin": "https://clouddani.com",
        "Content-Type": "application/json",
    }

    def _assert_cors(self, result):
        for key, expected in self.REQUIRED.items():
            self.assertIn(key, result["headers"], f"Missing header: {key}")
            self.assertEqual(result["headers"][key], expected)

    def test_200_has_cors(self):
        event = _make_event(method="POST", body={"message": "Hi"})
        with patch.object(concierge._client.messages, "create",
                          return_value=_make_anthropic_response("Hello!")):
            result = concierge.lambda_handler(event, None)
        self._assert_cors(result)

    def test_400_has_cors(self):
        result = concierge.lambda_handler(_make_event(method="POST", body={"message": ""}), None)
        self._assert_cors(result)

    def test_500_has_cors(self):
        event = _make_event(method="POST", body={"message": "Hi"})
        with patch.object(concierge._client.messages, "create", side_effect=RuntimeError("boom")):
            result = concierge.lambda_handler(event, None)
        self._assert_cors(result)

    def test_options_has_cors(self):
        result = concierge.lambda_handler(_make_event(method="OPTIONS"), None)
        self._assert_cors(result)


class TestSystemPromptQuality(unittest.TestCase):
    """System prompt must contain the persona and knowledge base."""

    def _get_system_text(self):
        event = _make_event(method="POST", body={"message": "Who are you?"})
        mock_resp = _make_anthropic_response("I am the Concierge.")
        with patch.object(concierge._client.messages, "create", return_value=mock_resp) as mock_create:
            concierge.lambda_handler(event, None)
        return mock_create.call_args.kwargs["system"][0]["text"]

    def test_persona_in_system_prompt(self):
        self.assertIn("CloudDani Concierge", self._get_system_text())

    def test_knowledge_base_in_system_prompt(self):
        # Real KB was loaded — spot-check key content
        self.assertIn("Danielle Washington", self._get_system_text())

    def test_system_prompt_has_knowledge_base_tags(self):
        self.assertIn("<knowledge_base>", self._get_system_text())

    def test_cache_control_is_ephemeral(self):
        event = _make_event(method="POST", body={"message": "test"})
        mock_resp = _make_anthropic_response("ok")
        with patch.object(concierge._client.messages, "create", return_value=mock_resp) as mock_create:
            concierge.lambda_handler(event, None)
        cache = mock_create.call_args.kwargs["system"][0]["cache_control"]
        self.assertEqual(cache["type"], "ephemeral")


if __name__ == "__main__":
    unittest.main()
