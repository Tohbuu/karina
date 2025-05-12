import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import Settings from './components/Settings';
import UserProfile from './components/UserProfile';
import { getFireAlarmData, subscribeToAlerts } from './fireAlarmService';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alarmData, setAlarmData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  useEffect(() => {
    // Initial data load
    getFireAlarmData().then(data => setAlarmData(data));
    
    // Subscribe to real-time alerts
    const unsubscribe = subscribeToAlerts(newAlert => {
      setAlerts(prev => [newAlert, ...prev]);
      if (newAlert.severity === 'critical') {
        setEmergencyMode(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSilenceAlarm = () => {
    setEmergencyMode(false);
    // In a real app, this would call your backend
    console.log('Alarm silenced');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={alarmData} emergencyMode={emergencyMode} onSilence={handleSilenceAlarm} />;
      case 'alerts': return <Alerts alerts={alerts} />;
      case 'settings': return <Settings data={alarmData} />;
      case 'profile': return <UserProfile />;
      default: return <Dashboard data={alarmData} />;
    }
  };

  return (
    <div className={`app ${emergencyMode ? 'emergency-mode' : ''}`}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} emergencyMode={emergencyMode} />
      <main className="main-content">
        {renderTab()}
      </main>
    </div>
  );
}

export default App;