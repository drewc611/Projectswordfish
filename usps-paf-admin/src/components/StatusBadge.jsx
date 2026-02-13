export default function StatusBadge({ status }) {
  const statusMap = {
    'Active': 'badge-active',
    'Pending': 'badge-pending',
    'Pending Review': 'badge-pending',
    'Expired': 'badge-expired',
    'Inactive': 'badge-inactive',
    'Compliant': 'badge-compliant',
    'Non-Compliant': 'badge-non-compliant',
    'Under Review': 'badge-review',
  };

  const className = statusMap[status] || 'badge-pending';

  return <span className={`badge ${className}`}>{status}</span>;
}
