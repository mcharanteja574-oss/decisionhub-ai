import json
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


@lru_cache
def load_demo_data() -> dict[str, Any]:
    datasets: dict[str, Any] = {}
    for path in DATA_DIR.glob("*.json"):
        with path.open("r", encoding="utf-8") as file:
            datasets[path.stem] = json.load(file)
    return datasets

