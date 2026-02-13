import { FileText, Building2, Hash, MapPin, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import Header from '../components/Header';
import { dashboardMetrics, monthlyProcessingData, pafStatusDistribution, recentActivity, complianceAlerts } from '../data/mockData';

export default function Dashboard() {
  return (
    <>
      <Header title="Dashboard" />
      <div className="page-content">
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

        {/* Bottom row */}
        <div className="grid-2">
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button className="btn btn-secondary btn-sm">View All</button>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {recentActivity.map((item) => (
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
