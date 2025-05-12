import React from 'react';
import { FiHome, FiAlertCircle, FiSettings, FiUser } from 'react-icons/fi';
import { MdLocalFireDepartment } from 'react-icons/md';

const Navbar = ({ activeTab, setActiveTab, emergencyMode }) => {
  return (
    <nav className={`navbar ${emergencyMode ? 'emergency' : ''}`}>
      <div className="navbar-brand">
        <MdLocalFireDepartment className="logo-icon" />
        <span>PyroGuard AI</span>
        {emergencyMode && <div className="emergency-badge">EMERGENCY</div>}
      </div>
      <div className="nav-links">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <FiHome /> Dashboard
        </button>
        <button 
          className={activeTab === 'alerts' ? 'active' : ''}
          onClick={() => setActiveTab('alerts')}
        >
          <FiAlertCircle /> Alerts
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings /> Settings
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser /> Profile
        </button>
      </div>
    </nav>
  );
};

export default Navbar;