import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Building2,
  Hash,
  MapPin,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">USPS</div>
        <div className="sidebar-title">
          <h1>PAF Admin</h1>
          <span>NCOALink Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">Overview</div>
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard />
          Dashboard
        </NavLink>

        <div className="nav-section">Management</div>
        <NavLink to="/paf" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FileText />
          PAF Management
        </NavLink>
        <NavLink to="/crid" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Building2 />
          CRID Management
        </NavLink>
        <NavLink to="/mid" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Hash />
          Mailer ID
        </NavLink>

        <div className="nav-section">Services</div>
        <NavLink to="/address" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <MapPin />
          Address Validation
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BarChart3 />
          Reports & Analytics
        </NavLink>

        <div className="nav-section">System</div>
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Settings />
          Settings
        </NavLink>
        <NavLink to="/help" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <HelpCircle />
          Help & Docs
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        USPS PAF Admin Portal v1.0.0
      </div>
    </aside>
  );
}
