import { useState } from 'react';
import { Plus, Eye, Download, X } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { pafs } from '../data/mockData';

export default function PAFManagement() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPAF, setSelectedPAF] = useState(null);

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
            <button className="btn btn-primary">
              <Plus size={16} /> New PAF
            </button>
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
                  <th>Licensee</th>
                  <th>Company</th>
                  <th>NCOALink Ver.</th>
                  <th>Status</th>
                  <th>Compliance</th>
                  <th>Submitted</th>
                  <th>Volume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPAFs.map((paf) => (
                  <tr key={paf.id}>
                    <td>{paf.id}</td>
                    <td>{paf.licenseeId}</td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{paf.companyName}</td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>v{paf.ncoalinkVersion}</td>
                    <td><StatusBadge status={paf.status} /></td>
                    <td><StatusBadge status={paf.complianceStatus} /></td>
                    <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{paf.submissionDate}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedPAF && (
          <div className="modal-overlay" onClick={() => setSelectedPAF(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>PAF Details: {selectedPAF.id}</h3>
                <button className="modal-close" onClick={() => setSelectedPAF(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-body">
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
