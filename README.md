# DecisionHub AI

AI Decision Intelligence Platform for Community Resilience.

DecisionHub AI converts fragmented weather, road, healthcare, shelter, and citizen-report signals into explainable recommendations for community resilience teams.

## Features

- Premium dark-mode React dashboard built with Vite and Tailwind CSS
- FastAPI backend with `POST /analyze`
- Gemini integration with strict JSON prompting
- Deterministic fallback analysis for reliable demos without an API key
- Scenario simulator for rainfall, hospital occupancy, and traffic
- Risk score, confidence, recommendations, public advisory, timeline, charts, and Leaflet map
- Decision Replay with evidence, alternatives, confidence, and trade-offs
- What-If simulator with rainfall, hospital occupancy, traffic congestion, and citizen reports
- AI Multi-Agent panel for weather, traffic, healthcare, emergency, citizen reports, and decision engine agents
- Decision Intelligence Score with radar chart and score improvement recommendations
- Community Impact estimates for lives protected, critical facilities, response improvement, resource utilization, and recovery readiness
- Responsible AI panel with limitations, data sources, reasoning transparency, and explainability
- Architecture page for judging and project presentation
- Dockerfile ready for Cloud Run

## Project Structure

```text
decisionhub-ai/
  frontend/
    src/
      components/
      pages/
      services/
      hooks/
      data/
      App.jsx
  backend/
    app.py
    routers/
    services/
    agents/
    prompts/
    data/
    requirements.txt
  README.md
  .env.example
  Dockerfile
```

## Local Development

Create environment files:

```bash
cp .env.example .env
```

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Analyze API

`POST /analyze`

```json
{
  "scenario": "Heavy rainfall expected tomorrow with hospital occupancy at 82%.",
  "rainfall_mm": 95,
  "hospital_occupancy": 82,
  "traffic_level": "HIGH"
}
```

Example response:

```json
{
  "risk_score": 91,
  "risk_level": "HIGH",
  "confidence": 94,
  "recommendations": [
    "Open Shelter A",
    "Deploy ambulances",
    "Issue SMS alerts",
    "Close vulnerable roads"
  ],
  "timeline": [
    { "time": "0-6 Hours", "action": "Open shelters" },
    { "time": "6-12 Hours", "action": "Deploy emergency teams" },
    { "time": "12-24 Hours", "action": "Road closures" }
  ],
  "explanation": "Recommendations are based on rainfall, hospital capacity, and road conditions.",
  "public_advisory": "Avoid travel. Follow official instructions."
}
```

## Gemini Setup

Set `GEMINI_API_KEY` in `.env`. If the key is absent, quota-limited, or the Gemini request is slow, the backend uses a transparent fallback model so the hackathon demo remains stable.

Never commit `.env`. Use `.env.example` for documentation and configure secrets in Cloud Run environment variables.

## Docker

```bash
docker build -t decisionhub-ai .
docker run -p 8080:8080 --env-file .env decisionhub-ai
```

Open `http://localhost:8080`.

## Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/decisionhub-ai
gcloud run deploy decisionhub-ai \
  --image gcr.io/PROJECT_ID/decisionhub-ai \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```
