import { useState, useEffect } from 'react';
import {
  Brain, AlertTriangle, Shield, TrendingUp, Activity, Eye, RefreshCw,
  ChevronRight, Zap, Target, Scan, ShieldAlert, BarChart2,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, ScatterChart, Scatter, ZAxis,
  Cell, PieChart, Pie,
} from 'recharts';
import Header from '../components/Header';
import {
  detectVolumeAnomalies,
  calculateRiskScores,
  generatePredictions,
  runFraudAnalysis,
  generateAISummary,
} from '../services/anomalyService';

const SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

const SEVERITY_BG = {
  critical: '#fef2f2',
  high: '#fef2f2',
  medium: '#fffbeb',
  low: '#f0fdf4',
};

function RiskGauge({ score, size = 120 }) {
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#dc2626' : score >= 60 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#22c55e';
  const label = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

  return (
    <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
      <path
        d={`M 8 ${size / 2 + 4} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2 + 4}`}
        fill="none"
        stroke="#eef1f4"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d={`M 8 ${size / 2 + 4} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2 + 4}`}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
      />
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fontSize="24" fontWeight="700" fill={color}>
        {score}
      </text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill="#78909c" letterSpacing="1">
        {label}
      </text>
    </svg>
  );
}

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState('overview');
  const [anomalies, setAnomalies] = useState(null);
  const [riskScores, setRiskScores] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [fraudAlerts, setFraudAlerts] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  async function loadAllData() {
    setIsLoading(true);
    const [anomalyData, riskData, predData, fraudData, summaryData] = await Promise.all([
      detectVolumeAnomalies(),
      calculateRiskScores(),
      generatePredictions(),
      runFraudAnalysis(),
      generateAISummary('dashboard'),
    ]);
    setAnomalies(anomalyData);
    setRiskScores(riskData);
    setPredictions(predData);
    setFraudAlerts(fraudData);
    setAiSummary(summaryData);
    setLastRefresh(new Date());
    setIsLoading(false);
  }

  useEffect(() => { loadAllData(); }, []);

  if (isLoading) {
    return (
      <>
        <Header title="AI Insights" />
        <div className="page-content">
          <div className="ai-loading-state">
            <div className="ai-loading-pulse" />
            <h3>Bedrock AI Engine Analyzing...</h3>
            <p>Running anomaly detection, risk scoring, predictions, and fraud analysis</p>
          </div>
        </div>
      </>
    );
  }

  const anomalyTimeline = [
    { time: '00:00', anomalies: 0 }, { time: '02:00', anomalies: 1 },
    { time: '04:00', anomalies: 0 }, { time: '06:00', anomalies: 1 },
    { time: '08:00', anomalies: 2 }, { time: '10:00', anomalies: 1 },
    { time: '12:00', anomalies: 0 }, { time: '14:00', anomalies: 3 },
    { time: '16:00', anomalies: 1 }, { time: '18:00', anomalies: 0 },
    { time: '20:00', anomalies: 0 }, { time: '22:00', anomalies: 1 },
  ];

  const riskDistribution = [
    { name: 'Low', value: 4, color: '#22c55e' },
    { name: 'Medium', value: 1, color: '#f59e0b' },
    { name: 'High', value: 1, color: '#ef4444' },
    { name: 'Critical', value: 1, color: '#dc2626' },
  ];

  return (
    <>
      <Header title="AI Insights" />
      <div className="page-content">
        {/* AI Engine Banner */}
        <div className="ai-banner">
          <div className="ai-banner-icon">
            <Brain size={28} />
          </div>
          <div className="ai-banner-content">
            <h3>Bedrock AI Intelligence Engine</h3>
            <p>
              Real-time anomaly detection, predictive analytics, risk scoring, and fraud detection across all PAF, CRID, and MID operations.
            </p>
          </div>
          <div className="ai-banner-stats">
            <div className="ai-stat">
              <span className="ai-stat-value">{anomalies?.summary.totalAnomalies}</span>
              <span className="ai-stat-label">Anomalies</span>
            </div>
            <div className="ai-stat">
              <span className="ai-stat-value">{fraudAlerts?.alerts.length}</span>
              <span className="ai-stat-label">Fraud Alerts</span>
            </div>
            <div className="ai-stat">
              <span className="ai-stat-value">{Math.round(anomalies?.summary.modelConfidence * 100)}%</span>
              <span className="ai-stat-label">Confidence</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadAllData} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* AI Summary Card */}
        {aiSummary && (
          <div className="ai-summary-card">
            <div className="ai-summary-header">
              <Zap size={16} />
              <span>AI Executive Summary</span>
              <span className="ai-summary-time">
                {lastRefresh?.toLocaleTimeString()}
              </span>
            </div>
            <p className="ai-summary-text">{aiSummary.summary}</p>
            <div className="ai-action-items">
              {aiSummary.actionItems.map((item, i) => (
                <div key={i} className="ai-action-item">
                  <ChevronRight size={14} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Activity size={14} style={{ marginRight: 6 }} /> Anomaly Detection
          </button>
          <button className={`tab ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveTab('risk')}>
            <Target size={14} style={{ marginRight: 6 }} /> Risk Scoring
          </button>
          <button className={`tab ${activeTab === 'predictions' ? 'active' : ''}`} onClick={() => setActiveTab('predictions')}>
            <TrendingUp size={14} style={{ marginRight: 6 }} /> Predictive Analytics
          </button>
          <button className={`tab ${activeTab === 'fraud' ? 'active' : ''}`} onClick={() => setActiveTab('fraud')}>
            <ShieldAlert size={14} style={{ marginRight: 6 }} /> Fraud Detection
          </button>
        </div>

        {/* ===== ANOMALY DETECTION TAB ===== */}
        {activeTab === 'overview' && anomalies && (
          <>
            {/* Severity Summary */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {['critical', 'high', 'medium', 'low'].map((level) => (
                <div key={level} className="metric-card">
                  <div className="metric-icon" style={{ background: SEVERITY_BG[level], color: SEVERITY_COLORS[level] }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div className="metric-info">
                    <h4>{level.charAt(0).toUpperCase() + level.slice(1)}</h4>
                    <div className="metric-value">{anomalies.summary[level]}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
              {/* Anomaly Timeline */}
              <div className="card">
                <div className="card-header">
                  <h3>Anomaly Timeline (24h)</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={anomalyTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Area type="stepAfter" dataKey="anomalies" stroke="#ef4444" fill="#fef2f2" strokeWidth={2} name="Anomalies" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detection Methods */}
              <div className="card">
                <div className="card-header">
                  <h3>Detection Methods</h3>
                </div>
                <div className="card-body">
                  {anomalies.metadata.algorithmsUsed.map((algo, i) => (
                    <div key={i} className="ai-method-item">
                      <Scan size={16} color="var(--usps-blue)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{algo}</div>
                        <div style={{ fontSize: 12, color: 'var(--usps-gray-400)' }}>
                          {algo === 'Z-Score Analysis' && 'Statistical deviation from historical baselines'}
                          {algo === 'Isolation Forest' && 'Unsupervised detection of outlier patterns'}
                          {algo === 'Time-Series Decomposition' && 'Seasonal trend and residual analysis'}
                        </div>
                      </div>
                      <span className="badge badge-active" style={{ marginLeft: 'auto' }}>Active</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, padding: 12, background: 'var(--usps-gray-50)', borderRadius: 6, fontSize: 12, color: 'var(--usps-gray-400)' }}>
                    Model: {anomalies.metadata.modelId} | Window: {anomalies.metadata.dataWindow}
                  </div>
                </div>
              </div>
            </div>

            {/* Anomaly Detail List */}
            <div className="card">
              <div className="card-header">
                <h3>Detected Anomalies</h3>
                <span className="badge badge-pending">{anomalies.anomalies.length} Active</span>
              </div>
              <div className="card-body">
                {anomalies.anomalies.map((anomaly) => (
                  <div key={anomaly.id} className="anomaly-card" style={{ borderLeftColor: SEVERITY_COLORS[anomaly.severity] }}>
                    <div className="anomaly-header">
                      <div className="anomaly-title">
                        <AlertTriangle size={16} color={SEVERITY_COLORS[anomaly.severity]} />
                        <span className="anomaly-id">{anomaly.id}</span>
                        <span className="badge" style={{ background: SEVERITY_BG[anomaly.severity], color: SEVERITY_COLORS[anomaly.severity] }}>
                          {anomaly.severity.toUpperCase()}
                        </span>
                        <span className="badge" style={{
                          background: anomaly.status === 'open' ? '#fef2f2' : anomaly.status === 'investigating' ? '#fffbeb' : '#f0fdf4',
                          color: anomaly.status === 'open' ? '#b91c1c' : anomaly.status === 'investigating' ? '#b45309' : '#15803d',
                        }}>
                          {anomaly.status}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--usps-gray-400)' }}>
                        {new Date(anomaly.detectedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="anomaly-entity">
                      {anomaly.entity} - {anomaly.entityName}
                    </div>
                    <p className="anomaly-desc">{anomaly.description}</p>
                    {anomaly.expectedValue !== null && (
                      <div className="anomaly-metrics">
                        <div className="anomaly-metric">
                          <span className="detail-label">Metric</span>
                          <span>{anomaly.metric}</span>
                        </div>
                        <div className="anomaly-metric">
                          <span className="detail-label">Expected</span>
                          <span>{typeof anomaly.expectedValue === 'number' ? anomaly.expectedValue.toLocaleString() : 'N/A'}</span>
                        </div>
                        <div className="anomaly-metric">
                          <span className="detail-label">Actual</span>
                          <span style={{ color: SEVERITY_COLORS[anomaly.severity], fontWeight: 700 }}>
                            {typeof anomaly.actualValue === 'number' ? anomaly.actualValue.toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        <div className="anomaly-metric">
                          <span className="detail-label">Z-Score</span>
                          <span style={{ fontWeight: 600 }}>{anomaly.zScore}</span>
                        </div>
                      </div>
                    )}
                    <div className="anomaly-recommendation">
                      <Shield size={14} />
                      <span>{anomaly.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== RISK SCORING TAB ===== */}
        {activeTab === 'risk' && riskScores && (
          <>
            <div className="grid-2" style={{ marginBottom: 24 }}>
              {/* Risk Distribution */}
              <div className="card">
                <div className="card-header">
                  <h3>Risk Distribution</h3>
                </div>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {riskDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Overall Risk Gauge */}
              <div className="card">
                <div className="card-header">
                  <h3>Overall System Risk</h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <RiskGauge score={fraudAlerts?.fraudScore || 0} size={180} />
                  <p style={{ fontSize: 13, color: 'var(--usps-gray-400)', marginTop: 12, textAlign: 'center' }}>
                    Elevated risk due to {anomalies?.summary.high} high-severity anomalies and {fraudAlerts?.alerts.length} active fraud alerts
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Score Table */}
            <div className="card">
              <div className="card-header">
                <h3>PAF Risk Scores</h3>
                <span style={{ fontSize: 12, color: 'var(--usps-gray-400)' }}>
                  Powered by {riskScores.metadata.factors} risk factors
                </span>
              </div>
              <div className="card-body">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PAF ID</th>
                      <th>Risk Score</th>
                      <th>Level</th>
                      <th>Risk Factors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(riskScores.scores)
                      .sort((a, b) => b[1].score - a[1].score)
                      .map(([pafId, data]) => (
                        <tr key={pafId}>
                          <td>{pafId}</td>
                          <td style={{ fontWeight: 400 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 80, height: 6, background: 'var(--usps-gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{
                                  width: `${data.score}%`,
                                  height: '100%',
                                  borderRadius: 3,
                                  background: SEVERITY_COLORS[data.level],
                                }} />
                              </div>
                              <span style={{ fontWeight: 700, color: SEVERITY_COLORS[data.level], fontSize: 14 }}>{data.score}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge" style={{
                              background: SEVERITY_BG[data.level],
                              color: SEVERITY_COLORS[data.level],
                            }}>
                              {data.level.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                            <div className="tag-list">
                              {data.factors.map((f, i) => (
                                <span key={i} className="tag">{f}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ===== PREDICTIVE ANALYTICS TAB ===== */}
        {activeTab === 'predictions' && predictions && (
          <>
            <div className="grid-2" style={{ marginBottom: 24 }}>
              {/* PAF Expiration Forecast */}
              <div className="card">
                <div className="card-header">
                  <h3>PAF Expiration Forecast</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={predictions.pafExpirationForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="expiring" fill="#004b87" radius={[4, 4, 0, 0]} name="Expiring" />
                      <Bar dataKey="atRisk" fill="#ef4444" radius={[4, 4, 0, 0]} name="At Risk of Non-Renewal" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Volume Prediction with Confidence Interval */}
              <div className="card">
                <div className="card-header">
                  <h3>Volume Trend Prediction</h3>
                  <span className="tag">95% Confidence Interval</span>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={predictions.volumeTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="upper" stroke="none" fill="#dbeafe" name="Upper Bound" />
                      <Area type="monotone" dataKey="lower" stroke="none" fill="#ffffff" name="Lower Bound" />
                      <Line type="monotone" dataKey="predicted" stroke="#004b87" strokeWidth={2} dot={{ r: 4 }} name="Predicted" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Compliance Risk Prediction */}
            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <h3>Compliance Risk Prediction</h3>
                </div>
                <div className="card-body">
                  <div className="detail-grid" style={{ marginBottom: 20 }}>
                    <div className="detail-item">
                      <span className="detail-label">Next 30 Days</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="detail-value" style={{ fontSize: 24 }}>
                          {predictions.complianceRiskPrediction.next30Days.predicted}%
                        </span>
                        <span className="badge badge-active">Stable</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Next 90 Days</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="detail-value" style={{ fontSize: 24 }}>
                          {predictions.complianceRiskPrediction.next90Days.predicted}%
                        </span>
                        <span className="badge badge-pending">Declining</span>
                      </div>
                    </div>
                  </div>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--usps-gray-500)', marginBottom: 8 }}>At-Risk Entities</h4>
                  {predictions.complianceRiskPrediction.riskEntities.map((entity, i) => (
                    <div key={i} className="ai-action-item" style={{ background: 'var(--color-warning-bg)', borderRadius: 6, padding: '8px 12px', marginBottom: 6 }}>
                      <AlertTriangle size={14} color="var(--color-warning)" />
                      <span style={{ fontSize: 13 }}>{entity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Address Quality Forecast</h3>
                </div>
                <div className="card-body">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Volume Trend</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TrendingUp size={16} color="var(--color-success)" />
                        <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                          {predictions.addressQualityForecast.validationVolumeTrend}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Est. Monthly Volume</span>
                      <span className="detail-value">{predictions.addressQualityForecast.estimatedMonthlyVolume.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">DPV Failure Rate (Forecast)</span>
                      <span className="detail-value">{predictions.addressQualityForecast.dpvFailureRateForecast}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">NCOALink Move Rate (Forecast)</span>
                      <span className="detail-value">{predictions.addressQualityForecast.ncoalinkMoveRateForecast}%</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 20, padding: 12, background: 'var(--usps-gray-50)', borderRadius: 6, fontSize: 12, color: 'var(--usps-gray-400)' }}>
                    Predictions based on {predictions.metadata.trainingWindow} training window with {predictions.metadata.confidenceInterval} confidence interval.
                    Model: {predictions.metadata.modelId}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== FRAUD DETECTION TAB ===== */}
        {activeTab === 'fraud' && fraudAlerts && (
          <>
            {/* Fraud Score Banner */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
              <div className="metric-card">
                <div className="metric-icon red">
                  <ShieldAlert size={24} />
                </div>
                <div className="metric-info">
                  <h4>Fraud Score</h4>
                  <div className="metric-value" style={{ color: SEVERITY_COLORS.high }}>{fraudAlerts.fraudScore}/100</div>
                  <div className="metric-change negative">Elevated Risk Level</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon amber">
                  <Activity size={24} />
                </div>
                <div className="metric-info">
                  <h4>Entities Monitored</h4>
                  <div className="metric-value">{fraudAlerts.entitiesMonitored.toLocaleString()}</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon blue">
                  <BarChart2 size={24} />
                </div>
                <div className="metric-info">
                  <h4>Patterns Analyzed</h4>
                  <div className="metric-value">{fraudAlerts.metadata.patternsAnalyzed}</div>
                </div>
              </div>
            </div>

            {/* Fraud Alert Cards */}
            <div className="card">
              <div className="card-header">
                <h3>Active Fraud Alerts</h3>
                <span className="badge badge-expired">{fraudAlerts.alerts.length} Alerts</span>
              </div>
              <div className="card-body">
                {fraudAlerts.alerts.map((alert) => (
                  <div key={alert.id} className="fraud-alert-card" style={{ borderLeftColor: SEVERITY_COLORS[alert.severity] }}>
                    <div className="fraud-alert-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ShieldAlert size={18} color={SEVERITY_COLORS[alert.severity]} />
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{alert.id}</span>
                        <span className="badge" style={{ background: SEVERITY_BG[alert.severity], color: SEVERITY_COLORS[alert.severity] }}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="tag">{alert.type.replace(/_/g, ' ')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--usps-gray-400)' }}>Confidence:</span>
                        <span style={{ fontWeight: 700, color: SEVERITY_COLORS[alert.severity] }}>
                          {(alert.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--usps-blue)', marginBottom: 6 }}>
                      {alert.entity}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--usps-gray-600)', lineHeight: 1.6, marginBottom: 12 }}>
                      {alert.description}
                    </p>
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--usps-gray-400)', marginBottom: 8 }}>
                        Indicators
                      </h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {alert.indicators.map((indicator, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--usps-gray-600)' }}>
                            <AlertTriangle size={12} color={SEVERITY_COLORS[alert.severity]} style={{ marginTop: 2, flexShrink: 0 }} />
                            {indicator}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="anomaly-recommendation">
                      <Shield size={14} />
                      <span>{alert.recommendedAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
