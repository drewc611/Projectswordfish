import { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import Header from '../components/Header';
import { reportData, monthlyProcessingData } from '../data/mockData';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('compliance');

  return (
    <>
      <Header title="Reports & Analytics" />
      <div className="page-content">
        <div className="tabs">
          <button className={`tab ${activeTab === 'compliance' ? 'active' : ''}`} onClick={() => setActiveTab('compliance')}>
            Compliance Reports
          </button>
          <button className={`tab ${activeTab === 'volume' ? 'active' : ''}`} onClick={() => setActiveTab('volume')}>
            Volume Analytics
          </button>
          <button className={`tab ${activeTab === 'licensee' ? 'active' : ''}`} onClick={() => setActiveTab('licensee')}>
            Licensee Performance
          </button>
        </div>

        {activeTab === 'compliance' && (
          <>
            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="card">
                <div className="card-header">
                  <h3>Monthly Compliance Trend</h3>
                  <button className="btn btn-secondary btn-sm">
                    <Download size={14} /> Export
                  </button>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.monthlyCompliance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="compliant" fill="#22c55e" name="Compliant" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="nonCompliant" fill="#ef4444" name="Non-Compliant" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>PAF Status Summary</h3>
                </div>
                <div className="card-body">
                  {reportData.pafsByStatus.map((item) => (
                    <div key={item.status} style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{item.status}</span>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{item.count.toLocaleString()}</span>
                      </div>
                      <div style={{ width: '100%', height: 8, background: 'var(--usps-gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            borderRadius: 4,
                            width: `${(item.count / 12847) * 100}%`,
                            background:
                              item.status === 'Active' ? 'var(--color-success)' :
                              item.status === 'Pending' ? 'var(--color-warning)' :
                              'var(--color-danger)',
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: 32, padding: 16, background: 'var(--usps-gray-50)', borderRadius: 6 }}>
                    <h4 style={{ fontSize: 14, marginBottom: 12, color: 'var(--usps-gray-500)' }}>Compliance Rate</h4>
                    <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--color-success)' }}>97.3%</div>
                    <div style={{ fontSize: 13, color: 'var(--usps-gray-400)', marginTop: 4 }}>
                      +0.3% from last month
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Compliance Report Downloads</h3>
              </div>
              <div className="card-body">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Report Name</th>
                      <th>Type</th>
                      <th>Period</th>
                      <th>Generated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'NCOALink PAF Compliance Summary', type: 'Compliance', period: 'January 2026', date: '2026-02-01' },
                      { name: 'Expired PAF Audit Report', type: 'Audit', period: 'Q4 2025', date: '2026-01-15' },
                      { name: 'Address Quality Metrics', type: 'Quality', period: 'January 2026', date: '2026-02-01' },
                      { name: 'CASS Certification Status', type: 'Certification', period: 'FY 2026', date: '2026-01-01' },
                      { name: 'Licensee Processing Volume', type: 'Volume', period: 'January 2026', date: '2026-02-01' },
                    ].map((report, i) => (
                      <tr key={i}>
                        <td>{report.name}</td>
                        <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                          <span className="tag">{report.type}</span>
                        </td>
                        <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                          <Calendar size={14} style={{ marginRight: 6 }} />
                          {report.period}
                        </td>
                        <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{report.date}</td>
                        <td>
                          <button className="btn btn-secondary btn-sm">
                            <Download size={14} /> Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'volume' && (
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h3>Monthly Processing Volume</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyProcessingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pafsProcessed" stroke="#004b87" strokeWidth={2} name="PAFs Processed" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Addresses Validated Per Month</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyProcessingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => (v / 1000).toFixed(0) + 'K'} />
                    <Tooltip formatter={(value) => value.toLocaleString()} />
                    <Bar dataKey="addressesValidated" fill="#0066b2" radius={[4, 4, 0, 0]} name="Addresses Validated" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'licensee' && (
          <div className="card">
            <div className="card-header">
              <h3>Top Licensees by Mail Volume</h3>
              <button className="btn btn-secondary btn-sm">
                <Download size={14} /> Export
              </button>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.topLicensees} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={180} />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="volume" fill="#004b87" radius={[0, 4, 4, 0]} name="Annual Volume" />
                </BarChart>
              </ResponsiveContainer>

              <table className="data-table" style={{ marginTop: 24 }}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Licensee</th>
                    <th>Annual Mail Volume</th>
                    <th>Market Share</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.topLicensees.map((licensee, i) => {
                    const totalVolume = reportData.topLicensees.reduce((sum, l) => sum + l.volume, 0);
                    const share = totalVolume > 0 ? ((licensee.volume / totalVolume) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={i}>
                        <td>#{i + 1}</td>
                        <td style={{ color: 'var(--usps-gray-600)', fontWeight: 500 }}>{licensee.name}</td>
                        <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{licensee.volume.toLocaleString()}</td>
                        <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{share}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
