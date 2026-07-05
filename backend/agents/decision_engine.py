import re
from typing import Any

from services.data_loader import load_demo_data
from services.gemini_client import GeminiDecisionClient
from services.schemas import AnalyzeResponse


class DecisionEngine:
    def __init__(self) -> None:
        self.gemini = GeminiDecisionClient()

    async def analyze(
        self,
        scenario: str,
        rainfall_mm: int | None = None,
        hospital_occupancy: int | None = None,
        traffic_congestion: int | None = None,
        citizen_reports: int | None = None,
        traffic_level: str | None = None,
    ) -> AnalyzeResponse:
        data = load_demo_data()
        signals = self._derive_signals(
            scenario,
            rainfall_mm,
            hospital_occupancy,
            traffic_congestion,
            citizen_reports,
            traffic_level,
        )
        context = {"signals": signals, "datasets": data}

        gemini_result = await self.gemini.analyze(scenario, context)
        response = self._fallback_analysis(signals, data)
        if gemini_result:
            response.update({key: value for key, value in gemini_result.items() if value})

        response["timeline"] = self._standard_timeline()
        response["map_points"] = self._map_points(data, response["risk_score"])
        response["chart_data"] = self._chart_data(signals, response["risk_score"])
        response["community_impact"] = self._community_impact(signals, response["risk_score"])
        response["decision_scores"] = self._decision_scores(signals, response["risk_score"], response["confidence"])
        response["responsible_ai"] = self._responsible_ai(response, data)
        return AnalyzeResponse(**response)

    def _derive_signals(
        self,
        scenario: str,
        rainfall_mm: int | None,
        hospital_occupancy: int | None,
        traffic_congestion: int | None,
        citizen_reports: int | None,
        traffic_level: str | None,
    ) -> dict[str, Any]:
        lower = scenario.lower()
        extracted_numbers = [int(value) for value in re.findall(r"\b(\d{1,3})\b", scenario)]

        if rainfall_mm is None:
            rainfall_mm = 95 if "heavy rainfall" in lower else 55 if "rain" in lower else 20
        if hospital_occupancy is None:
            hospital_occupancy = self._number_after_keywords(lower, ["occupancy", "hospital"], extracted_numbers, 68)
        if traffic_congestion is None:
            traffic_congestion = 82 if "gridlock" in lower else 72 if "traffic" in lower or "heavy rainfall" in lower else 48
        if citizen_reports is None:
            citizen_reports = 76 if "citizen" in lower or "reports" in lower else 58 if "flood" in lower or "rain" in lower else 35
        if traffic_level is None:
            traffic_level = self._traffic_level_from_congestion(traffic_congestion)

        return {
            "rainfall_mm": rainfall_mm,
            "hospital_occupancy": hospital_occupancy,
            "traffic_congestion": traffic_congestion,
            "citizen_reports": citizen_reports,
            "traffic_level": traffic_level,
        }

    def _number_after_keywords(
        self,
        text: str,
        keywords: list[str],
        numbers: list[int],
        default: int,
    ) -> int:
        for keyword in keywords:
            match = re.search(rf"{keyword}[^\d]{{0,20}}(\d{{1,3}})", text)
            if match:
                return int(match.group(1))
        return numbers[-1] if numbers else default

    def _traffic_level_from_congestion(self, traffic_congestion: int) -> str:
        if traffic_congestion >= 85:
            return "SEVERE"
        if traffic_congestion >= 60:
            return "HIGH"
        if traffic_congestion >= 30:
            return "MODERATE"
        return "LOW"

    def _fallback_analysis(self, signals: dict[str, Any], data: dict[str, Any]) -> dict[str, Any]:
        rainfall = signals["rainfall_mm"]
        occupancy = signals["hospital_occupancy"]
        traffic = signals["traffic_level"]
        traffic_congestion = signals["traffic_congestion"]
        citizen_reports = signals["citizen_reports"]

        risk_score = min(
            100,
            round(
                (rainfall * 0.24)
                + (occupancy * 0.32)
                + (traffic_congestion * 0.18)
                + (citizen_reports * 0.12)
                + 22
            ),
        )
        if risk_score >= 92:
            risk_level = "CRITICAL"
        elif risk_score >= 75:
            risk_level = "HIGH"
        elif risk_score >= 45:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"

        open_shelters = [s["name"] for s in data["shelters"]["shelters"] if s["status"] == "ready"]
        vulnerable_roads = [r["name"] for r in data["roads"]["roads"] if r["flood_risk"] == "high"]
        hospital = max(data["hospitals"]["hospitals"], key=lambda item: item["occupancy"])

        recommendations = [
            f"Open {open_shelters[0]} and prepare overflow capacity",
            f"Deploy ambulances near {hospital['name']}",
            "Issue SMS and app alerts for flood-prone wards",
            f"Close vulnerable roads: {', '.join(vulnerable_roads[:2])}",
        ]

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": 94 if risk_score >= 75 else 88,
            "recommendations": recommendations,
            "priority_actions": [
                {
                    "title": recommendations[0],
                    "priority": "Immediate",
                    "owner": "Emergency Operations Center",
                    "rationale": "Shelter readiness reduces exposure before rainfall peaks.",
                },
                {
                    "title": recommendations[1],
                    "priority": "High",
                    "owner": "Health Command",
                    "rationale": f"{hospital['name']} is already at {hospital['occupancy']}% occupancy.",
                },
                {
                    "title": recommendations[2],
                    "priority": "High",
                    "owner": "Public Communications",
                    "rationale": "Early guidance reduces avoidable road demand and emergency calls.",
                },
                {
                    "title": recommendations[3],
                    "priority": "Medium",
                    "owner": "Transport Department",
                    "rationale": "Pre-emptive diversions keep emergency corridors usable.",
                },
            ],
            "timeline": [
                {"time": "0-2 Hours", "action": "Issue public alert and activate the Emergency Operations Center"},
                {"time": "2-6 Hours", "action": "Open shelters and position staff near flood-prone wards"},
                {"time": "6-12 Hours", "action": "Deploy ambulances and emergency teams near high-risk zones"},
                {"time": "12-24 Hours", "action": "Close vulnerable roads and monitor hospital surge capacity"},
                {"time": "24-48 Hours", "action": "Begin recovery operations and reassess resident support needs"},
            ],
            "explanation": (
                f"The scenario indicates {rainfall} mm rainfall, {occupancy}% hospital occupancy, "
                f"{traffic.lower()} traffic, and citizen report pressure at {citizen_reports}%. "
                "Risk is elevated because flood-prone roads, healthcare "
                "pressure, and shelter demand can compound quickly during the first 24 hours."
            ),
            "public_advisory": "Avoid non-essential travel, keep phones charged, follow official alerts, and move early if advised.",
        }

    def _standard_timeline(self) -> list[dict[str, str]]:
        return [
            {"time": "0-2 Hours", "action": "Issue public alert and activate the Emergency Operations Center"},
            {"time": "2-6 Hours", "action": "Open shelters and position staff near flood-prone wards"},
            {"time": "6-12 Hours", "action": "Deploy ambulances and emergency teams near high-risk zones"},
            {"time": "12-24 Hours", "action": "Close vulnerable roads and monitor hospital surge capacity"},
            {"time": "24-48 Hours", "action": "Begin recovery operations and reassess resident support needs"},
        ]

    def _map_points(self, data: dict[str, Any], risk_score: int) -> list[dict[str, Any]]:
        points: list[dict[str, Any]] = []
        for hospital in data["hospitals"]["hospitals"]:
            points.append({
                "id": hospital["id"],
                "name": hospital["name"],
                "type": "Hospital",
                "lat": hospital["lat"],
                "lng": hospital["lng"],
                "status": f"{hospital['occupancy']}% occupied",
                "severity": "critical" if hospital["occupancy"] >= 85 else "high",
            })
        for shelter in data["shelters"]["shelters"]:
            points.append({
                "id": shelter["id"],
                "name": shelter["name"],
                "type": "Shelter",
                "lat": shelter["lat"],
                "lng": shelter["lng"],
                "status": f"{shelter['capacity']} beds, {shelter['status']}",
                "severity": "low" if shelter["status"] == "ready" else "medium",
            })
        for road in data["roads"]["roads"]:
            points.append({
                "id": road["id"],
                "name": road["name"],
                "type": "Road",
                "lat": road["lat"],
                "lng": road["lng"],
                "status": road["status"],
                "severity": "critical" if road["flood_risk"] == "high" and risk_score > 80 else "medium",
            })
        return points

    def _chart_data(self, signals: dict[str, Any], risk_score: int) -> list[dict[str, int | str]]:
        rainfall = signals["rainfall_mm"]
        occupancy = signals["hospital_occupancy"]
        traffic = signals["traffic_congestion"]
        reports = signals["citizen_reports"]
        return [
            {"label": "Now", "risk": max(10, risk_score - 18), "capacity": max(35, occupancy - 8)},
            {"label": "6h", "risk": min(100, risk_score - 8), "capacity": occupancy},
            {"label": "12h", "risk": risk_score, "capacity": min(100, occupancy + 6)},
            {
                "label": "24h",
                "risk": min(100, risk_score + round((rainfall + traffic + reports) / 60)),
                "capacity": min(100, occupancy + 10),
            },
        ]

    def _community_impact(self, signals: dict[str, Any], risk_score: int) -> list[dict[str, int | str]]:
        rainfall = signals["rainfall_mm"]
        occupancy = signals["hospital_occupancy"]
        traffic = signals["traffic_congestion"]
        reports = signals["citizen_reports"]
        return [
            {
                "label": "Lives Potentially Protected",
                "value": min(9800, 2400 + risk_score * 58),
                "unit": "residents",
                "summary": "AI-generated estimate for residents benefiting from early alerts, sheltering, and safer routes.",
            },
            {
                "label": "Critical Facilities Supported",
                "value": 6 + round(occupancy / 18),
                "unit": "facilities",
                "summary": "Hospitals, shelters, and transport corridors prioritized for operational continuity.",
            },
            {
                "label": "Emergency Response Improvement",
                "value": min(52, 18 + round((traffic + reports) / 7)),
                "unit": "%",
                "summary": "Estimated improvement from pre-positioning teams and reducing avoidable travel demand.",
            },
            {
                "label": "Resource Utilization",
                "value": min(94, 48 + round((rainfall + occupancy) / 5)),
                "unit": "%",
                "summary": "Projected use of shelters, ambulances, public communications, and road-control teams.",
            },
            {
                "label": "Recovery Readiness",
                "value": max(42, 100 - round(risk_score / 2)),
                "unit": "%",
                "summary": "Readiness to transition from response into recovery after the first 24 hours.",
            },
        ]

    def _decision_scores(
        self,
        signals: dict[str, Any],
        risk_score: int,
        confidence: int,
    ) -> list[dict[str, int | str]]:
        rainfall = signals["rainfall_mm"]
        occupancy = signals["hospital_occupancy"]
        traffic = signals["traffic_congestion"]
        reports = signals["citizen_reports"]
        resource_readiness = max(22, min(96, 112 - round((occupancy * 0.48) + (reports * 0.22))))
        resilience = max(25, min(94, 108 - round((rainfall * 0.16) + (traffic * 0.22) + (occupancy * 0.28))))
        response_confidence = max(58, min(97, confidence - round(max(0, occupancy - 65) / 3) + round(max(0, 70 - occupancy) / 5)))
        recovery = max(24, min(92, 104 - round((risk_score * 0.42) + (occupancy * 0.24))))
        decision_readiness = max(
            35,
            min(
                98,
                round(
                    (response_confidence * 0.34)
                    + (resource_readiness * 0.24)
                    + (resilience * 0.22)
                    + (recovery * 0.20)
                ),
            ),
        )

        return [
            {
                "label": "Decision Readiness Score",
                "value": decision_readiness,
                "explanation": "Confidence is high because rainfall, healthcare capacity, traffic, and citizen reports are aligned into a single operating picture.",
                "recommendation": "Confirm shelter staffing and publish the first public advisory before the rainfall peak.",
            },
            {
                "label": "Resource Readiness",
                "value": resource_readiness,
                "explanation": "Shelters are available, but hospital occupancy and citizen-report pressure reduce spare operational capacity.",
                "recommendation": "Pre-stage ambulances and assign overflow shelter teams now.",
            },
            {
                "label": "Community Resilience Score",
                "value": resilience,
                "explanation": "Community resilience is constrained by flood-prone roads and high congestion during heavy rainfall.",
                "recommendation": "Reduce travel demand with targeted alerts and protect emergency corridors.",
            },
            {
                "label": "Response Confidence",
                "value": response_confidence,
                "explanation": "The recommendation set is explainable because it is based on multiple independent public-service signals.",
                "recommendation": "Keep monitoring rainfall and citizen reports to update the plan every 2 hours.",
            },
            {
                "label": "Recovery Readiness",
                "value": recovery,
                "explanation": "Recovery readiness depends on how quickly road closures, shelters, and healthcare load can be normalized.",
                "recommendation": "Prepare post-event inspection teams and resident support workflows before the 24-hour mark.",
            },
        ]

    def _responsible_ai(self, response: dict[str, Any], data: dict[str, Any]) -> dict[str, Any]:
        return {
            "limitations": [
                "Prototype estimates are generated from demo datasets and should be reviewed by authorized officials.",
                "Gemini output is bounded by the quality and freshness of available operational data.",
                "Recommendations support decisions; they do not replace emergency command authority.",
            ],
            "data_sources_used": [
                "Weather Forecast",
                "Hospital Capacity",
                "Traffic Conditions",
                "Citizen Reports",
                "Shelter Availability",
                "Emergency Resources",
            ],
            "reasoning_summary": response["explanation"],
            "explainability": (
                f"DecisionHub AI combines {len(data)} demo datasets with scenario signals, "
                "then surfaces risk, confidence, evidence, alternatives, and trade-offs for review."
            ),
        }
