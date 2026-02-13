import { useState } from 'react';
import { Save, Key, Globe, Database, Shield } from 'lucide-react';
import Header from '../components/Header';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <>
      <Header title="Settings" />
      <div className="page-content">
        <div className="tabs">
          <button className={`tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
            General
          </button>
          <button className={`tab ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>
            API Configuration
          </button>
          <button className={`tab ${activeTab === 'bedrock' ? 'active' : ''}`} onClick={() => setActiveTab('bedrock')}>
            AWS Bedrock
          </button>
          <button className={`tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            Security
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="card">
            <div className="card-header">
              <h3><Globe size={18} style={{ marginRight: 8 }} />General Settings</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Portal Name</label>
                <input type="text" defaultValue="USPS PAF Admin Portal" />
              </div>
              <div className="form-group">
                <label>Organization</label>
                <input type="text" defaultValue="USPS National Operations Administration Center" />
              </div>
              <div className="form-group">
                <label>Default NCOALink Version</label>
                <select defaultValue="21.0">
                  <option value="21.0">v21.0 (Current)</option>
                  <option value="20.0">v20.0</option>
                  <option value="19.0">v19.0 (Legacy)</option>
                </select>
              </div>
              <div className="form-group">
                <label>PAF Expiration Period</label>
                <select defaultValue="12">
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>
              <div className="form-group">
                <label>Compliance Alert Threshold</label>
                <input type="number" defaultValue={30} />
                <span style={{ fontSize: 12, color: 'var(--usps-gray-400)', marginTop: 4, display: 'block' }}>
                  Days before expiration to trigger alerts
                </span>
              </div>
              <button className="btn btn-primary">
                <Save size={16} /> Save Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="card">
            <div className="card-header">
              <h3><Database size={18} style={{ marginRight: 8 }} />AMS API Configuration</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>AMS API Endpoint</label>
                <input type="text" defaultValue="https://ams-api.usps.com/v1" />
              </div>
              <div className="form-group">
                <label>API Key</label>
                <input type="password" defaultValue="••••••••••••••••••••" />
              </div>
              <div className="form-group">
                <label>DPV Product Key</label>
                <input type="password" defaultValue="••••••••••••" />
              </div>
              <div className="form-group">
                <label>Data Update Frequency</label>
                <select defaultValue="monthly">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div className="form-group">
                <label>Products Enabled</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  {['DPV (Delivery Point Validation)', 'LACSLink (Locatable Address Conversion)', 'SuiteLink (Secondary Info)', 'eLOT (Enhanced Line-of-Travel)'].map((product) => (
                    <label key={product} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked />
                      {product}
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary">
                <Save size={16} /> Save API Configuration
              </button>
            </div>
          </div>
        )}

        {activeTab === 'bedrock' && (
          <div className="card">
            <div className="card-header">
              <h3><Key size={18} style={{ marginRight: 8 }} />AWS Bedrock Configuration</h3>
            </div>
            <div className="card-body">
              <div style={{ padding: 16, background: 'var(--color-info-bg)', borderRadius: 6, marginBottom: 24, fontSize: 13, color: '#1d4ed8' }}>
                AWS Bedrock powers AI-driven address validation, enrichment suggestions, and quality analysis for the PAF admin portal.
              </div>
              <div className="form-group">
                <label>AWS Region</label>
                <select defaultValue="us-east-1">
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">EU West (Ireland)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bedrock Model ID</label>
                <select defaultValue="anthropic.claude-sonnet-4-5-20250929">
                  <option value="anthropic.claude-sonnet-4-5-20250929">Claude Sonnet 4.5 (Recommended)</option>
                  <option value="anthropic.claude-haiku-4-5-20251001">Claude Haiku 4.5 (Faster)</option>
                  <option value="anthropic.claude-opus-4-6">Claude Opus 4.6 (Most Capable)</option>
                </select>
              </div>
              <div className="form-group">
                <label>AWS Access Key ID</label>
                <input type="password" defaultValue="••••••••••••••••" />
              </div>
              <div className="form-group">
                <label>AWS Secret Access Key</label>
                <input type="password" defaultValue="••••••••••••••••••••••••" />
              </div>
              <div className="form-group">
                <label>Max Tokens per Request</label>
                <input type="number" defaultValue={4096} />
              </div>
              <div className="form-group">
                <label>Bedrock Features</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  {[
                    'AI Address Standardization',
                    'Intelligent Address Suggestions',
                    'Batch Quality Analysis',
                    'NCOALink Move Detection Enhancement',
                  ].map((feature) => (
                    <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked />
                      {feature}
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary">
                <Save size={16} /> Save Bedrock Configuration
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card">
            <div className="card-header">
              <h3><Shield size={18} style={{ marginRight: 8 }} />Security Settings</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Session Timeout (minutes)</label>
                <input type="number" defaultValue={30} />
              </div>
              <div className="form-group">
                <label>Two-Factor Authentication</label>
                <select defaultValue="required">
                  <option value="required">Required for All Users</option>
                  <option value="optional">Optional</option>
                  <option value="admin_only">Required for Admins Only</option>
                </select>
              </div>
              <div className="form-group">
                <label>IP Allowlist</label>
                <textarea rows={3} defaultValue={"10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16"} />
                <span style={{ fontSize: 12, color: 'var(--usps-gray-400)', marginTop: 4, display: 'block' }}>
                  One CIDR block per line
                </span>
              </div>
              <div className="form-group">
                <label>Audit Log Retention</label>
                <select defaultValue="365">
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">1 Year</option>
                  <option value="730">2 Years</option>
                </select>
              </div>
              <button className="btn btn-primary">
                <Save size={16} /> Save Security Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
