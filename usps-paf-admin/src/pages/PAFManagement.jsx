import { useState, useEffect } from 'react';
import { Plus, Eye, Download, X, Brain, AlertTriangle, Shield } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { pafs } from '../data/mockData';
import { calculateRiskScores } from '../services/anomalyService';

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

export default function PAFManagement() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPAF, setSelectedPAF] = useState(null);
  const [riskScores, setRiskScores] = useState(null);

  useEffect(() => {
    calculateRiskScores().then(setRiskScores);
  }, []);

  const getRisk = (pafId) => riskScores?.scores[pafId] || null;

  const filteredPAFs = pafs.filter((paf) => {
    const matchesStatus = statusFilter === 'All' || paf.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      paf.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paf.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paf.licenseeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <Header title="PAF Management" />
      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <h3>NCOALink Processing Acknowledgment Forms</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {riskScores && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4338ca', fontWeight: 600 }}>
                  <Brain size={14} /> AI Risk Scoring Active
                </span>
              )}
              <button className="btn btn-primary">
                <Plus size={16} /> New PAF
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="filters-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by PAF ID, company, or licensee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Expired">Expired</option>
              </select>
              <button className="btn btn-secondary btn-sm">
                <Download size={14} /> Export
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>PAF ID</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Compliance</th>
                  <th>AI Risk</th>
                  <th>NCOALink</th>
                  <th>Volume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPAFs.map((paf) => {
                  const risk = getRisk(paf.id);
                  return (
                    <tr key={paf.id} style={risk && risk.level === 'critical' ? { background: '#fef2f2' } : {}}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {risk && (risk.level === 'critical' || risk.level === 'high') && (
                            <AlertTriangle size={14} color={SEVERITY_COLORS[risk.level]} />
                          )}
                          {paf.id}
                        </div>
                      </td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                        <div>{paf.companyName}</div>
                        <div style={{ fontSize: 11, color: 'var(--usps-gray-400)' }}>{paf.licenseeId}</div>
                      </td>
                      <td><StatusBadge status={paf.status} /></td>
                      <td><StatusBadge status={paf.complianceStatus} /></td>
                      <td>
                        {risk ? (
                          <span className={`risk-score-inline ${risk.level}`}>
                            <Shield size={11} />
                            {risk.score}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--usps-gray-300)', fontSize: 12 }}>--</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>v{paf.ncoalinkVersion}</td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{paf.processingVolume.toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedPAF(paf)}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedPAF && (
          <div className="modal-overlay" onClick={() => setSelectedPAF(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
              <div className="modal-header">
                <h3>PAF Details: {selectedPAF.id}</h3>
                <button className="modal-close" onClick={() => setSelectedPAF(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-body">
                {/* AI Risk Assessment */}
                {getRisk(selectedPAF.id) && (
                  <div style={{
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 20,
                    background: SEVERITY_BG[getRisk(selectedPAF.id).level],
                    border: `1px solid ${SEVERITY_COLORS[getRisk(selectedPAF.id).level]}20`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <Brain size={16} color="#4338ca" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        AI Risk Assessment
                      </span>
                      <span className={`risk-score-inline ${getRisk(selectedPAF.id).level}`} style={{ marginLeft: 'auto' }}>
                        Score: {getRisk(selectedPAF.id).score}/100
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {getRisk(selectedPAF.id).factors.map((factor, i) => (
                        <span key={i} className="tag" style={{ background: 'rgba(255,255,255,0.7)' }}>{factor}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">PAF ID</span>
                    <span className="detail-value">{selectedPAF.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Licensee ID</span>
                    <span className="detail-value">{selectedPAF.licenseeId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{selectedPAF.companyName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Software Product</span>
                    <span className="detail-value">{selectedPAF.softwareProduct}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">NCOALink Version</span>
                    <span className="detail-value">v{selectedPAF.ncoalinkVersion}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <StatusBadge status={selectedPAF.status} />
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Compliance Status</span>
                    <StatusBadge status={selectedPAF.complianceStatus} />
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Submission Date</span>
                    <span className="detail-value">{selectedPAF.submissionDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expiration Date</span>
                    <span className="detail-value">{selectedPAF.expirationDate || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Processing Volume</span>
                    <span className="detail-value">{selectedPAF.processingVolume.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Associated CRID</span>
                    <span className="detail-value">{selectedPAF.crid}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Associated MID</span>
                    <span className="detail-value">{selectedPAF.mid}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact Name</span>
                    <span className="detail-value">{selectedPAF.contactName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact Email</span>
                    <span className="detail-value">{selectedPAF.contactEmail}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Audit Date</span>
                    <span className="detail-value">{selectedPAF.lastAuditDate || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedPAF(null)}>Close</button>
                <button className="btn btn-primary">Edit PAF</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
