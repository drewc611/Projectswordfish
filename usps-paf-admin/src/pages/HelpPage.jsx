import { ExternalLink, Book, Mail, Phone, FileText, MapPin, Building2, Hash, Shield } from 'lucide-react';
import Header from '../components/Header';

export default function HelpPage() {
  const resources = [
    {
      title: 'NCOALink PAF Documentation',
      description: 'Processing Acknowledgment Form requirements, submission process, and compliance guidelines.',
      icon: FileText,
      category: 'PAF',
    },
    {
      title: 'Customer Registration ID (CRID)',
      description: 'How to create, manage, and link CRIDs with Mailer IDs and mailing permits.',
      icon: Building2,
      category: 'CRID',
    },
    {
      title: 'Mailer ID (MID) Guide',
      description: 'Requesting MIDs, configuring data distribution profiles, ACS billing, and eInduction setup.',
      icon: Hash,
      category: 'MID',
    },
    {
      title: 'AMS API Reference',
      description: 'Address Matching System API integration guide, ZIP+4 validation, DPV, LACSLink, SuiteLink, and eLOT.',
      icon: MapPin,
      category: 'AMS',
    },
    {
      title: 'AWS Bedrock Integration',
      description: 'Configure and use AWS Bedrock for AI-powered address intelligence and validation enrichment.',
      icon: Shield,
      category: 'Bedrock',
    },
    {
      title: 'Full-Service Intelligent Mail',
      description: 'Requirements for Full-Service IMb, electronic documentation (eDoc), and scan data access.',
      icon: Mail,
      category: 'IMb',
    },
  ];

  return (
    <>
      <Header title="Help & Documentation" />
      <div className="page-content">
        {/* Quick Start Guide */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3><Book size={18} style={{ marginRight: 8 }} />Quick Start Guide</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>What is this Portal?</h4>
                <p style={{ fontSize: 14, color: 'var(--usps-gray-500)', lineHeight: 1.7 }}>
                  The USPS PAF Admin Portal is a management system for NCOALink Processing Acknowledgment Forms.
                  It provides tools for managing service provider compliance, Customer Registration IDs (CRIDs),
                  Mailer Identifiers (MIDs), and AI-powered address validation using the AMS API and AWS Bedrock.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Key Features</h4>
                <ul style={{ fontSize: 14, color: 'var(--usps-gray-500)', lineHeight: 2, paddingLeft: 20 }}>
                  <li>PAF lifecycle management (submission, review, approval, expiration)</li>
                  <li>CRID registration and MID assignment tracking</li>
                  <li>AI-powered address validation with AWS Bedrock</li>
                  <li>AMS API integration (DPV, LACSLink, SuiteLink, eLOT)</li>
                  <li>Compliance monitoring and reporting</li>
                  <li>Full-Service Intelligent Mail support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          {resources.map((resource, i) => {
            const Icon = resource.icon;
            return (
              <div key={i} className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                <div className="card-body" style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--usps-blue)' }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600 }}>{resource.title}</h4>
                      <ExternalLink size={12} color="var(--usps-gray-400)" />
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--usps-gray-400)', lineHeight: 1.5 }}>
                      {resource.description}
                    </p>
                    <span className="tag" style={{ marginTop: 8 }}>{resource.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="card">
          <div className="card-header">
            <h3>Contact Support</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Mail size={32} color="var(--usps-blue)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Email Support</h4>
                <p style={{ fontSize: 13, color: 'var(--usps-gray-400)' }}>intelligentmailsupport@usps.gov</p>
              </div>
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Phone size={32} color="var(--usps-blue)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Phone Support</h4>
                <p style={{ fontSize: 13, color: 'var(--usps-gray-400)' }}>1-800-522-9085</p>
              </div>
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Book size={32} color="var(--usps-blue)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>AMS API Support</h4>
                <p style={{ fontSize: 13, color: 'var(--usps-gray-400)' }}>877-640-0724</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
