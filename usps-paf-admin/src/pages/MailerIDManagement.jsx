import { useState } from 'react';
import { Plus, Eye, X, Settings } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { mailerIds } from '../data/mockData';

export default function MailerIDManagement() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMID, setSelectedMID] = useState(null);

  const filteredMIDs = mailerIds.filter((mid) => {
    const matchesStatus = statusFilter === 'All' || mid.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      mid.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mid.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mid.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <Header title="Mailer ID Management" />
      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <h3>Mailer Identifiers (MID)</h3>
            <button className="btn btn-primary">
              <Plus size={16} /> Request New MID
            </button>
          </div>
          <div className="card-body">
            <div className="filters-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by MID, owner, or nickname..."
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
                  <th>Mailer ID</th>
                  <th>Digits</th>
                  <th>Owner (CRID)</th>
                  <th>Nickname</th>
                  <th>Status</th>
                  <th>Mail Classes</th>
                  <th>Annual Volume</th>
                  <th>Data Profile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMIDs.map((mid) => (
                  <tr key={mid.id}>
                    <td>{mid.id}</td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                      <span className="badge badge-active">{mid.digits}-digit</span>
                    </td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                      <div>{mid.ownerName}</div>
                      <div style={{ fontSize: 11, color: 'var(--usps-gray-400)' }}>{mid.ownerCRID}</div>
                    </td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{mid.nickname}</td>
                    <td><StatusBadge status={mid.status} /></td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                      <div className="tag-list">
                        {mid.mailClass.map((mc) => (
                          <span key={mc} className="tag">{mc}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                      {mid.annualVolume > 0
                        ? (mid.annualVolume / 1000000).toFixed(1) + 'M'
                        : '--'}
                    </td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                      <span className="tag">{mid.dataDistributionProfile}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedMID(mid)}
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedMID && (
          <div className="modal-overlay" onClick={() => setSelectedMID(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Mailer ID Details: {selectedMID.id}</h3>
                <button className="modal-close" onClick={() => setSelectedMID(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Mailer ID</span>
                    <span className="detail-value">{selectedMID.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Digit Type</span>
                    <span className="detail-value">{selectedMID.digits}-digit MID</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Owner CRID</span>
                    <span className="detail-value">{selectedMID.ownerCRID}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Owner Name</span>
                    <span className="detail-value">{selectedMID.ownerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <StatusBadge status={selectedMID.status} />
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Assigned Date</span>
                    <span className="detail-value">{selectedMID.assignedDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nickname</span>
                    <span className="detail-value">{selectedMID.nickname}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Barcode Type</span>
                    <span className="detail-value">{selectedMID.barcodeType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Annual Volume</span>
                    <span className="detail-value">{selectedMID.annualVolume.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Data Distribution Profile</span>
                    <span className="detail-value">{selectedMID.dataDistributionProfile}</span>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 12, color: 'var(--usps-gray-500)' }}>
                    <Settings size={14} style={{ marginRight: 6 }} />
                    Service Configuration
                  </h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">ACS Billing</span>
                      <span className="detail-value">
                        {selectedMID.acsBilling ? (
                          <span className="badge badge-active">Enabled</span>
                        ) : (
                          <span className="badge badge-expired">Disabled</span>
                        )}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">eInduction</span>
                      <span className="detail-value">
                        {selectedMID.eInduction ? (
                          <span className="badge badge-active">Enabled</span>
                        ) : (
                          <span className="badge badge-expired">Disabled</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--usps-gray-500)' }}>
                    Mail Classes
                  </h4>
                  <div className="tag-list">
                    {selectedMID.mailClass.map((mc) => (
                      <span key={mc} className="tag">{mc}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedMID(null)}>Close</button>
                <button className="btn btn-primary">Edit MID</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
