import { Search, Bell } from 'lucide-react';

export default function Header({ title }) {
  return (
    <header className="header">
      <div className="header-left">
        <h2>{title}</h2>
      </div>
      <div className="header-right">
        <div className="header-search">
          <Search size={16} color="#78909c" />
          <input type="text" placeholder="Search PAFs, CRIDs, MIDs..." />
        </div>
        <button
          className="btn-secondary btn-sm"
          style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Bell size={18} />
        </button>
        <div className="header-user">
          <div className="header-user-avatar">AD</div>
          <div className="header-user-info">
            <span>Admin User</span>
            <span>USPS NOAC</span>
          </div>
        </div>
      </div>
    </header>
  );
}
