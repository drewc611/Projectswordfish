import { useState, useEffect } from 'react';
import { Plus, Eye, X, Link, Brain, ShieldAlert } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { crids } from '../data/mockData';
import { detectVolumeAnomalies } from '../services/anomalyService';

export default function CRIDManagement() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCRID, setSelectedCRID] = useState(null);
  const [anomalies, setAnomalies] = useState(null);

  useEffect(() => {
    detectVolumeAnomalies().then(setAnomalies);
  }, []);

  const getCRIDFlags = (cridId) => {
    if (!anomalies) return [];
    return anomalies.anomalies.filter(a => a.entity === cridId);
  };

  const filteredCRIDs = crids.filter((crid) => {
    const matchesStatus = statusFilter === 'All' || crid.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      crid.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crid.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <Header title="CRID Management" />
      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <h3>Customer Registration IDs</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {anomalies && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4338ca', fontWeight: 600 }}>
                  <Brain size={14} /> Anomaly Monitoring Active
                </span>
              )}
              <button className="btn btn-primary">
                <Plus size={16} /> Register New CRID
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="filters-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by CRID or business name..."
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
                <option value="Pending">Pending</option>
              </select>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>CRID</th>
                  <th>Business Name</th>
                  <th>Status</th>
                  <th>AI Flags</th>
                  <th>Mail Classes</th>
                  <th>Associated MIDs</th>
                  <th>Annual Volume</th>
                  <th>Full Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCRIDs.map((crid) => {
                  const flags = getCRIDFlags(crid.id);
                  return (
                    <tr key={crid.id} style={flags.length > 0 ? { background: '#fffbeb' } : {}}>
                      <td>{crid.id}</td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{crid.businessName}</td>
                      <td><StatusBadge status={crid.status} /></td>
                      <td>
                        {flags.length > 0 ? (
                          <span className={`risk-score-inline ${flags[0].severity}`}>
                            <ShieldAlert size={11} />
                            {flags.length} alert{flags.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="risk-score-inline low">Clear</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                        <div className="tag-list">
                          {crid.mailClass.map((mc) => (
                            <span key={mc} className="tag">{mc}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                        <span className="badge badge-active">{crid.associatedMIDs.length}</span>
                      </td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                        {crid.annualMailVolume > 0
                          ? (crid.annualMailVolume / 1000000).toFixed(1) + 'M'
                          : '--'}
                      </td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                        {crid.fullServiceEnabled ? (
                          <span className="badge badge-active">Enabled</span>
                        ) : (
                          <span className="badge badge-expired">Disabled</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedCRID(crid)}
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
        {selectedCRID && (
          <div className="modal-overlay" onClick={() => setSelectedCRID(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>CRID Details: {selectedCRID.id}</h3>
                <button className="modal-close" onClick={() => setSelectedCRID(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-body">
                {/* AI Anomaly Flags */}
                {getCRIDFlags(selectedCRID.id).length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    {getCRIDFlags(selectedCRID.id).map((flag) => (
                      <div key={flag.id} className="anomaly-recommendation" style={{ marginBottom: 8, background: '#fffbeb', color: '#b45309' }}>
                        <ShieldAlert size={14} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>AI Anomaly: {flag.type.replace(/_/g, ' ')}</div>
                          <div style={{ fontSize: 12 }}>{flag.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">CRID</span>
                    <span className="detail-value">{selectedCRID.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <StatusBadge status={selectedCRID.status} />
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Business Name</span>
                    <span className="detail-value">{selectedCRID.businessName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created Date</span>
                    <span className="detail-value">{selectedCRID.createdDate}</span>
                  </div>
                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <span className="detail-label">Business Address</span>
                    <span className="detail-value">{selectedCRID.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact Name</span>
                    <span className="detail-value">{selectedCRID.contactName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact Email</span>
                    <span className="detail-value">{selectedCRID.contactEmail}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact Phone</span>
                    <span className="detail-value">{selectedCRID.contactPhone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Annual Mail Volume</span>
                    <span className="detail-value">{selectedCRID.annualMailVolume.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Full-Service Enabled</span>
                    <span className="detail-value">{selectedCRID.fullServiceEnabled ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Activity</span>
                    <span className="detail-value">{selectedCRID.lastActivity}</span>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--usps-gray-500)' }}>
                    <Link size={14} style={{ marginRight: 6 }} />
                    Associated Mailer IDs
                  </h4>
                  <div className="tag-list">
                    {selectedCRID.associatedMIDs.map((mid) => (
                      <span key={mid} className="tag">{mid}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--usps-gray-500)' }}>Mail Classes</h4>
                  <div className="tag-list">
                    {selectedCRID.mailClass.map((mc) => (
                      <span key={mc} className="tag">{mc}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--usps-gray-500)' }}>Permit Numbers</h4>
                  <div className="tag-list">
                    {selectedCRID.permitNumbers.length > 0 ? (
                      selectedCRID.permitNumbers.map((pmt) => (
                        <span key={pmt} className="tag">{pmt}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--usps-gray-400)' }}>No permits assigned</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedCRID(null)}>Close</button>
                <button className="btn btn-primary">Edit CRID</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
