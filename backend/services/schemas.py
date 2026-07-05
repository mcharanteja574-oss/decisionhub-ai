from typing import Literal

from pydantic import BaseModel, Field


TrafficLevel = Literal["LOW", "MODERATE", "HIGH", "SEVERE"]
RiskLevel = Literal["LOW", "MODERATE", "HIGH", "CRITICAL"]


class AnalyzeRequest(BaseModel):
    scenario: str = Field(..., min_length=1, max_length=1200)
    rainfall_mm: int | None = Field(default=None, ge=0, le=500)
    hospital_occupancy: int | None = Field(default=None, ge=0, le=100)
    traffic_congestion: int | None = Field(default=None, ge=0, le=100)
    citizen_reports: int | None = Field(default=None, ge=0, le=100)
    traffic_level: TrafficLevel | None = None


class TimelineItem(BaseModel):
    time: str
    action: str


class Recommendation(BaseModel):
    title: str
    priority: Literal["Immediate", "High", "Medium"]
    owner: str
    rationale: str


class MapPoint(BaseModel):
    id: str
    name: str
    type: str
    lat: float
    lng: float
    status: str
    severity: Literal["low", "medium", "high", "critical"]


class ChartPoint(BaseModel):
    label: str
    risk: int
    capacity: int


class CommunityImpactMetric(BaseModel):
    label: str
    value: int
    unit: str
    summary: str


class DecisionScore(BaseModel):
    label: str
    value: int = Field(..., ge=0, le=100)
    explanation: str
    recommendation: str


class ResponsibleAI(BaseModel):
    limitations: list[str]
    data_sources_used: list[str]
    reasoning_summary: str
    explainability: str


class AnalyzeResponse(BaseModel):
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: RiskLevel
    confidence: int = Field(..., ge=0, le=100)
    recommendations: list[str]
    priority_actions: list[Recommendation]
    timeline: list[TimelineItem]
    explanation: str
    public_advisory: str
    map_points: list[MapPoint]
    chart_data: list[ChartPoint]
    community_impact: list[CommunityImpactMetric]
    decision_scores: list[DecisionScore]
    responsible_ai: ResponsibleAI
