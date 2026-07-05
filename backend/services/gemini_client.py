import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

from dotenv import load_dotenv

from prompts.decision_prompt import build_decision_prompt

load_dotenv()


class GeminiDecisionClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.timeout = int(os.getenv("GEMINI_TIMEOUT_SECONDS", "20"))

    @property
    def enabled(self) -> bool:
        return bool(self.api_key)

    async def analyze(self, scenario: str, context: dict[str, Any]) -> dict[str, Any] | None:
        if not self.enabled:
            return None

        try:
            return self._generate(scenario, context)
        except (OSError, TimeoutError, urllib.error.URLError, json.JSONDecodeError, KeyError, IndexError):
            return None

    def _generate(self, scenario: str, context: dict[str, Any]) -> dict[str, Any]:
        model = urllib.parse.quote(self.model_name, safe="")
        api_key = urllib.parse.quote(self.api_key, safe="")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": build_decision_prompt(scenario, context)}],
                }
            ],
            "generationConfig": {
                "temperature": 0.25,
                "responseMimeType": "application/json",
            },
        }
        request = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            data = json.loads(response.read().decode("utf-8"))
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return self._extract_json(text)

    def _extract_json(self, text: str) -> dict[str, Any]:
        cleaned = text.strip()
        fenced = re.search(r"```(?:json)?\s*(.*?)```", cleaned, re.DOTALL)
        if fenced:
            cleaned = fenced.group(1).strip()
        return json.loads(cleaned)
