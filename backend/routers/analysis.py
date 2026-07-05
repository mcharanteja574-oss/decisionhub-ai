from fastapi import APIRouter, HTTPException

from agents.decision_engine import DecisionEngine
from services.schemas import AnalyzeRequest, AnalyzeResponse

router = APIRouter(tags=["analysis"])
engine = DecisionEngine()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_scenario(payload: AnalyzeRequest):
    scenario = payload.scenario.strip()
    if not scenario:
        raise HTTPException(status_code=400, detail="Scenario is required.")

    return await engine.analyze(
        scenario=scenario,
        rainfall_mm=payload.rainfall_mm,
        hospital_occupancy=payload.hospital_occupancy,
        traffic_congestion=payload.traffic_congestion,
        citizen_reports=payload.citizen_reports,
        traffic_level=payload.traffic_level,
    )
