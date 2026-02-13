import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PAFManagement from './pages/PAFManagement';
import CRIDManagement from './pages/CRIDManagement';
import MailerIDManagement from './pages/MailerIDManagement';
import AddressValidation from './pages/AddressValidation';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/paf" element={<PAFManagement />} />
            <Route path="/crid" element={<CRIDManagement />} />
            <Route path="/mid" element={<MailerIDManagement />} />
            <Route path="/address" element={<AddressValidation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
