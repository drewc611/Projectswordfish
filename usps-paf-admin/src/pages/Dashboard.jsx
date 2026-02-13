import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Building2, Hash, MapPin, TrendingUp, AlertTriangle, CheckCircle, Clock, Brain, ShieldAlert, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import Header from '../components/Header';
import { dashboardMetrics, monthlyProcessingData, pafStatusDistribution, recentActivity, complianceAlerts } from '../data/mockData';
import { detectVolumeAnomalies, generateAISummary } from '../services/anomalyService';

const SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

export default function Dashboard() {
  const [anomalies, setAnomalies] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);

  useEffect(() => {
    Promise.all([
      detectVolumeAnomalies(),
      generateAISummary('dashboard'),
    ]).then(([anomalyData, summaryData]) => {
      setAnomalies(anomalyData);
      setAiSummary(summaryData);
    });
  }, []);

  return (
    <>
      <Header title="Dashboard" />
      <div className="page-content">
        {/* AI Summary Banner */}
        {aiSummary && (
          <div className="ai-summary-card" style={{ marginBottom: 24 }}>
            <div className="ai-summary-header">
              <Brain size={16} />
              <span>AI Executive Summary</span>
              <Link to="/ai-insights" style={{ marginLeft: 'auto', fontSize: 12, color: '#4338ca', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                View AI Insights <ChevronRight size={14} />
              </Link>
            </div>
            <p className="ai-summary-text">{aiSummary.summary}</p>
            <div className="ai-action-items">
              {aiSummary.actionItems.slice(0, 3).map((item, i) => (
                <div key={i} className="ai-action-item">
                  <ChevronRight size={14} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon blue">
              <FileText size={24} />
            </div>
            <div className="metric-info">
              <h4>Total PAFs</h4>
              <div className="metric-value">{dashboardMetrics.totalPAFs.toLocaleString()}</div>
              <div className="metric-change positive">
                <TrendingUp size={14} /> +124 this month
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon green">
              <CheckCircle size={24} />
            </div>
            <div className="metric-info">
              <h4>Active PAFs</h4>
              <div className="metric-value">{dashboardMetrics.activePAFs.toLocaleString()}</div>
              <div className="metric-change positive">
                <TrendingUp size={14} /> 71.8% of total
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon amber">
              <Clock size={24} />
            </div>
            <div className="metric-info">
              <h4>Pending Review</h4>
              <div className="metric-value">{dashboardMetrics.pendingPAFs.toLocaleString()}</div>
              <div className="metric-change negative">
                <AlertTriangle size={14} /> 6 need attention
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon blue">
              <Building2 size={24} />
            </div>
            <div className="metric-info">
              <h4>Active CRIDs</h4>
              <div className="metric-value">{dashboardMetrics.totalCRIDs.toLocaleString()}</div>
              <div className="metric-change positive">
                <TrendingUp size={14} /> +89 this month
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon green">
              <Hash size={24} />
            </div>
            <div className="metric-info">
              <h4>Mailer IDs</h4>
              <div className="metric-value">{dashboardMetrics.totalMIDs.toLocaleString()}</div>
              <div className="metric-change positive">
                <TrendingUp size={14} /> +156 this month
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon amber">
              <MapPin size={24} />
            </div>
            <div className="metric-info">
              <h4>Addresses Validated</h4>
              <div className="metric-value">{(dashboardMetrics.addressesValidated / 1000000).toFixed(1)}M</div>
              <div className="metric-change positive">
                <TrendingUp size={14} /> {dashboardMetrics.complianceRate}% accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="card-header">
              <h3>Monthly PAF Processing</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyProcessingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="pafsProcessed" fill="#004b87" radius={[4, 4, 0, 0]} name="PAFs Processed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>PAF Status Distribution</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pafStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pafStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Address Validation Trend */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3>Address Validation Compliance Trend</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyProcessingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[95, 98]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complianceRate" stroke="#22c55e" strokeWidth={2} name="Compliance Rate %" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row - 3 columns */}
        <div className="grid-3">
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {recentActivity.slice(0, 6).map((item) => (
                  <div key={item.id} className="activity-item">
                    <div className={`activity-dot ${item.type}`} />
                    <div className="activity-content">
                      <div className="activity-action">
                        {item.action} <span className="activity-entity">{item.entity}</span>
                      </div>
                      <div className="activity-meta">
                        <span>{item.user}</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Anomaly Detection Widget */}
          <div className="ai-widget">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Brain size={14} /> AI Anomaly Detection
              </h4>
              <Link to="/ai-insights" style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                View All
              </Link>
            </div>
            {anomalies ? (
              <>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  {['high', 'medium', 'low'].map((level) => (
                    <div key={level} style={{
                      flex: 1,
                      padding: '8px 10px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 6,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{anomalies.summary[level]}</div>
                      <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>{level}</div>
                    </div>
                  ))}
                </div>
                {anomalies.anomalies.filter(a => a.severity === 'high').map((anomaly) => (
                  <div key={anomaly.id} className="ai-widget-anomaly">
                    <ShieldAlert size={14} color={SEVERITY_COLORS[anomaly.severity]} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{anomaly.entityName}</div>
                      <div style={{ fontSize: 11, opacity: 0.75 }}>{anomaly.description.substring(0, 80)}...</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 10, fontSize: 11, opacity: 0.5, textAlign: 'center' }}>
                  Model confidence: {Math.round(anomalies.summary.modelConfidence * 100)}%
                </div>
              </>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', opacity: 0.5 }}>
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: '0 auto 8px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                Analyzing...
              </div>
            )}
          </div>

          {/* Compliance Alerts */}
          <div className="card">
            <div className="card-header">
              <h3>Compliance Alerts</h3>
              <span className="badge badge-pending">{complianceAlerts.length} Active</span>
            </div>
            <div className="card-body">
              {complianceAlerts.map((alert) => (
                <div key={alert.id} className={`alert-card ${alert.severity}`}>
                  <AlertTriangle size={16} />
                  <span className="alert-message">{alert.message}</span>
                  <span className="alert-date">{alert.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
