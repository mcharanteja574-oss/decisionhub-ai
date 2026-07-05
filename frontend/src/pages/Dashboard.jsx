import { AlertTriangle, CloudSun, Cpu, MapPinned } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityImpactDashboard from "../components/CommunityImpactDashboard.jsx";
import DataSourcesPanel from "../components/DataSourcesPanel.jsx";
import DecisionContextPanel from "../components/DecisionContextPanel.jsx";
import DecisionIntelligenceScore from "../components/DecisionIntelligenceScore.jsx";
import DecisionPipeline from "../components/DecisionPipeline.jsx";
import DecisionReplay from "../components/DecisionReplay.jsx";
import DecisionTimeline from "../components/DecisionTimeline.jsx";
import ExplanationPanel from "../components/ExplanationPanel.jsx";
import ExecutiveSummaryCard from "../components/ExecutiveSummaryCard.jsx";
import MetricCard from "../components/MetricCard.jsx";
import MultiAgentPanel from "../components/MultiAgentPanel.jsx";
import PriorityActions from "../components/PriorityActions.jsx";
import ResponsibleAI from "../components/ResponsibleAI.jsx";
import ResilienceMap from "../components/ResilienceMap.jsx";
import RiskChart from "../components/RiskChart.jsx";
import RiskScoreCard from "../components/RiskScoreCard.jsx";
import ScenarioInput from "../components/ScenarioInput.jsx";
import ScenarioSimulator from "../components/ScenarioSimulator.jsx";
import WhyThisMatters from "../components/WhyThisMatters.jsx";
import { useDecisionAnalysis } from "../hooks/useDecisionAnalysis.js";

export default function Dashboard() {
  const {
    scenario,
    setScenario,
    simulator,
    setSimulator,
    result,
    loading,
    error,
    analysisMeta,
    analyze,
  } = useDecisionAnalysis();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Hero />
      <section className="mt-8 grid gap-6">
        <ExecutiveSummaryCard result={result} />
        <DecisionContextPanel scenario={scenario} result={result} />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Rainfall" value={simulator.rainfall_mm} detail="mm" accent="blue" />
        <MetricCard label="Hospital Occupancy" value={simulator.hospital_occupancy} detail="%" accent="red" />
        <MetricCard label="Traffic Congestion" value={simulator.traffic_congestion} detail="%" accent="yellow" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6">
          <DataSourcesPanel />
          <DecisionPipeline />
          <ScenarioInput
            scenario={scenario}
            setScenario={setScenario}
            onAnalyze={analyze}
            loading={loading}
            error={error}
            analysisMeta={analysisMeta}
          />
          <ExplanationPanel explanation={result.explanation} advisory={result.public_advisory} />
          <DecisionIntelligenceScore scores={result.decision_scores} />
          <CommunityImpactDashboard metrics={result.community_impact} />
          <MultiAgentPanel loading={loading} />
          <DecisionReplay result={result} simulator={simulator} />
          <ResponsibleAI result={result} />
          <RiskChart data={result.chart_data} />
          <ResilienceMap points={result.map_points} />
          <WhyThisMatters />
        </div>
        <aside className="grid content-start gap-6">
          <RiskScoreCard result={result} />
          <ScenarioSimulator simulator={simulator} setSimulator={setSimulator} result={result} />
          <PriorityActions actions={result.priority_actions} fallback={result.recommendations} />
          <DecisionTimeline timeline={result.timeline} />
        </aside>
      </section>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.12] via-white/[0.04] to-transparent p-6 shadow-glow sm:p-8 lg:p-10">
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-cloud/80">
            <Cpu className="h-4 w-4 text-googleBlue" aria-hidden="true" />
            Google Gen AI APAC Hackathon MVP
          </div>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-normal text-white sm:text-5xl lg:text-6xl">
            DecisionHub AI
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-cloud/78">
            AI Decision Intelligence Platform for Community Resilience.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <HeroSignal icon={CloudSun} label="Fragmented signals" />
            <HeroSignal icon={AlertTriangle} label="Explainable priorities" />
            <HeroSignal icon={MapPinned} label="Live operating view" />
          </div>
          <Link
            to="/architecture"
            className="mt-6 inline-flex items-center rounded-lg bg-white/10 px-4 py-3 text-sm font-bold text-cloud transition hover:bg-white/15"
          >
            View Architecture
          </Link>
        </div>
        <div className="soft-panel rounded-lg p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-googleGreen">Community Decision Center</p>
          <div className="mt-4 space-y-4">
            {["Decision Intelligence Analysis", "Executive Decision Brief", "Decision Intelligence Report"].map(
              (item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white/[0.05] p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-googleBlue/20 text-sm font-bold text-blue-100">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-cloud">{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSignal({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/[0.05] p-3">
      <Icon className="h-5 w-5 text-googleYellow" aria-hidden="true" />
      <span className="text-sm font-semibold text-cloud/85">{label}</span>
    </div>
  );
}
