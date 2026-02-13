import { useState } from 'react';
import { MapPin, Cpu, CheckCircle, AlertTriangle, Zap, Upload } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Header from '../components/Header';
import { validateAddressWithAI } from '../services/bedrockService';
import { addressValidationHistory } from '../data/mockData';

export default function AddressValidation() {
  const [activeTab, setActiveTab] = useState('single');
  const [addressInput, setAddressInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState(null);

  const handleValidate = async () => {
    if (!addressInput.trim()) return;
    setIsLoading(true);
    setValidationResult(null);
    try {
      const result = await validateAddressWithAI(addressInput);
      setValidationResult(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchValidate = async () => {
    if (!batchInput.trim()) return;
    setIsLoading(true);
    setBatchResults(null);
    const addresses = batchInput.split('\n').filter((a) => a.trim());
    const results = [];
    for (const addr of addresses) {
      const result = await validateAddressWithAI(addr.trim());
      results.push(result);
    }
    setBatchResults(results);
    setIsLoading(false);
  };

  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.8) return 'confidence-high';
    if (confidence >= 0.5) return 'confidence-medium';
    return 'confidence-low';
  };

  return (
    <>
      <Header title="Address Validation" />
      <div className="page-content">
        {/* AWS Bedrock Banner */}
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #004b87 0%, #0066b2 100%)', color: 'white', border: 'none' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>AI-Powered Address Intelligence</h3>
              <p style={{ fontSize: 13, opacity: 0.85 }}>
                Powered by AWS Bedrock + USPS AMS API. Validates addresses using DPV, LACSLink, SuiteLink, and eLOT with AI-driven insights.
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={14} />
              <span style={{ fontSize: 13 }}>Model: Claude Sonnet 4.5</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'single' ? 'active' : ''}`} onClick={() => setActiveTab('single')}>
            Single Address
          </button>
          <button className={`tab ${activeTab === 'batch' ? 'active' : ''}`} onClick={() => setActiveTab('batch')}>
            Batch Validation
          </button>
          <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            Validation History
          </button>
        </div>

        {/* Single Address Validation */}
        {activeTab === 'single' && (
          <div className="grid-2">
            <div>
              <div className="card">
                <div className="card-header">
                  <h3>Validate Address</h3>
                </div>
                <div className="card-body">
                  <div className="address-input-section">
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--usps-gray-600)', marginBottom: 8 }}>
                      Enter full address (street, city, state ZIP)
                    </label>
                    <textarea
                      className="address-textarea"
                      placeholder="e.g., 1600 Pennsylvania Ave NW, Washington, DC 20500"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleValidate}
                    disabled={isLoading || !addressInput.trim()}
                    style={{ opacity: isLoading || !addressInput.trim() ? 0.6 : 1 }}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                        Validating...
                      </>
                    ) : (
                      <>
                        <MapPin size={16} /> Validate with AMS + Bedrock
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              {validationResult && (
                <div className="card">
                  <div className="card-header">
                    <h3>Validation Results</h3>
                    {validationResult.validation.isValid ? (
                      <span className="badge badge-active"><CheckCircle size={12} /> Valid</span>
                    ) : (
                      <span className="badge badge-expired"><AlertTriangle size={12} /> Invalid</span>
                    )}
                  </div>
                  <div className="card-body">
                    {/* Standardized Address */}
                    <div className="result-section">
                      <h5>Standardized Address</h5>
                      <div style={{ padding: 16, background: 'var(--usps-gray-50)', borderRadius: 6, fontFamily: 'monospace', fontSize: 14, lineHeight: 1.8 }}>
                        <div>{validationResult.standardized.addressLine1}</div>
                        {validationResult.standardized.addressLine2 && (
                          <div>{validationResult.standardized.addressLine2}</div>
                        )}
                        <div>
                          {validationResult.standardized.city}, {validationResult.standardized.state} {validationResult.standardized.zipPlus4}
                        </div>
                      </div>
                    </div>

                    {/* DPV & Validation */}
                    <div className="result-section">
                      <h5>DPV Validation</h5>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">DPV Confirmed</span>
                          <span className="detail-value">{validationResult.validation.dpvConfirmed}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Carrier Route</span>
                          <span className="detail-value">{validationResult.validation.carrierRoute || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Delivery Point</span>
                          <span className="detail-value">{validationResult.validation.deliveryPoint || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Congressional District</span>
                          <span className="detail-value">{validationResult.validation.congressionalDistrict || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enrichment */}
                    <div className="result-section">
                      <h5>Address Enrichment</h5>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Address Type</span>
                          <span className="detail-value">{validationResult.enrichment.addressType}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Residential/Business</span>
                          <span className="detail-value">{validationResult.enrichment.residentialIndicator}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">County</span>
                          <span className="detail-value">{validationResult.enrichment.countyName || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">eLOT Sequence</span>
                          <span className="detail-value">{validationResult.enrichment.elotSequence || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="result-section">
                      <h5>AI Insights (AWS Bedrock)</h5>
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 13, color: 'var(--usps-gray-500)' }}>Confidence Score</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="confidence-bar" style={{ flex: 1 }}>
                            <div
                              className={`confidence-fill ${getConfidenceClass(validationResult.aiInsights.confidence)}`}
                              style={{ width: `${validationResult.aiInsights.confidence * 100}%` }}
                            />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>
                            {(validationResult.aiInsights.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {validationResult.aiInsights.suggestions.map((suggestion, i) => (
                          <li key={i} style={{ padding: '6px 0', fontSize: 13, color: 'var(--usps-gray-600)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <CheckCircle size={14} style={{ marginTop: 2, flexShrink: 0, color: validationResult.validation.isValid ? 'var(--color-success)' : 'var(--color-warning)' }} />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Metadata */}
                    <div className="result-section">
                      <h5>Processing Metadata</h5>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Engine</span>
                          <span className="detail-value">{validationResult.metadata.engine}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Processing Time</span>
                          <span className="detail-value">{validationResult.metadata.processingTimeMs}ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!validationResult && !isLoading && (
                <div className="card">
                  <div className="card-body">
                    <div className="empty-state">
                      <MapPin size={48} />
                      <h4>Enter an address to validate</h4>
                      <p>Results will appear here with DPV validation, enrichment data, and AI-powered insights.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Batch Validation */}
        {activeTab === 'batch' && (
          <div className="card">
            <div className="card-header">
              <h3>Batch Address Validation</h3>
              <button className="btn btn-secondary btn-sm">
                <Upload size={14} /> Import CSV
              </button>
            </div>
            <div className="card-body">
              <div className="address-input-section">
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--usps-gray-600)', marginBottom: 8 }}>
                  Enter addresses (one per line)
                </label>
                <textarea
                  className="address-textarea"
                  placeholder={"1600 Pennsylvania Ave NW, Washington, DC 20500\n350 Fifth Avenue, New York, NY 10118\n233 S Wacker Dr, Chicago, IL 60606"}
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  rows={6}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleBatchValidate}
                disabled={isLoading || !batchInput.trim()}
                style={{ opacity: isLoading || !batchInput.trim() ? 0.6 : 1 }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Processing Batch...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Validate All Addresses
                  </>
                )}
              </button>

              {batchResults && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: 16, marginBottom: 16 }}>
                    Batch Results ({batchResults.length} addresses)
                  </h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Input Address</th>
                        <th>Standardized</th>
                        <th>Status</th>
                        <th>DPV</th>
                        <th>Confidence</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchResults.map((result, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {result.input}
                          </td>
                          <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                            {result.standardized.addressLine1}, {result.standardized.city}, {result.standardized.state} {result.standardized.zip5}
                          </td>
                          <td>
                            {result.validation.isValid ? (
                              <span className="badge badge-active">Valid</span>
                            ) : (
                              <span className="badge badge-expired">Invalid</span>
                            )}
                          </td>
                          <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{result.validation.dpvConfirmed}</td>
                          <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                            {(result.aiInsights.confidence * 100).toFixed(0)}%
                          </td>
                          <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{result.enrichment.residentialIndicator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Validation History */}
        {activeTab === 'history' && (
          <div className="card">
            <div className="card-header">
              <h3>Validation History (Last 7 Days)</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={addressValidationHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valid" stackId="a" fill="#22c55e" name="Valid" />
                  <Bar dataKey="corrected" stackId="a" fill="#f59e0b" name="Corrected" />
                  <Bar dataKey="invalid" stackId="a" fill="#ef4444" name="Invalid" />
                </BarChart>
              </ResponsiveContainer>

              <table className="data-table" style={{ marginTop: 24 }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Processed</th>
                    <th>Valid</th>
                    <th>Corrected</th>
                    <th>Invalid</th>
                    <th>Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {addressValidationHistory.map((day) => (
                    <tr key={day.date}>
                      <td>{day.date}</td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>{day.total.toLocaleString()}</td>
                      <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{day.valid.toLocaleString()}</td>
                      <td style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{day.corrected}</td>
                      <td style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{day.invalid}</td>
                      <td style={{ color: 'var(--usps-gray-600)', fontWeight: 400 }}>
                        {((day.valid / day.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
