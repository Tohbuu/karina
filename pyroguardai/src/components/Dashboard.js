import React from 'react';
import StatusCard from './StatusCard';
import SensorGraph from './SensorGraph';
import { FiVolumeX, FiPhone } from 'react-icons/fi';

const Dashboard = ({ data, emergencyMode, onSilence }) => {
  if (!data) return <div className="loading">Loading...</div>;

  const getStatusColor = () => {
    if (emergencyMode) return 'var(--alert-red)';
    return data.status === 'normal' ? 'var(--success-green)' : 'var(--warning-orange)';
  };

  return (
    <div className="dashboard">
      {emergencyMode && (
        <div className="emergency-alert">
          <h2>FIRE ALERT!</h2>
          <p>Smoke detected in Kitchen</p>
          <div className="emergency-actions">
            <button onClick={onSilence} className="silence-btn">
              <FiVolumeX /> Silence Alarm
            </button>
            <button className="call-emergency">
              <FiPhone /> Call Emergency
            </button>
          </div>
        </div>
      )}

      <div className="status-overview">
        <div className="status-header">
          <h2>System Status</h2>
          <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}></div>
        </div>
        
        <div className="status-cards">
          <StatusCard 
            title="Temperature" 
            value={`${data.temperature}°C`} 
            icon="🌡️"
            status={data.temperature > 30 ? 'warning' : 'normal'}
          />
          <StatusCard 
            title="Smoke Level" 
            value={`${data.smokeLevel}%`} 
            icon="💨"
            status={data.smokeLevel > 1 ? 'warning' : 'normal'}
          />
          <StatusCard 
            title="Air Quality" 
            value={data.airQuality} 
            icon="🍃"
            status={data.airQuality > 100 ? 'warning' : 'normal'}
          />
          <StatusCard 
            title="CO2 Level" 
            value={`${data.co2Level}ppm`} 
            icon="☁️"
            status={data.co2Level > 1000 ? 'warning' : 'normal'}
          />
        </div>
      </div>

      <div className="sensor-graphs">
        <SensorGraph 
          title="Temperature Trend" 
          data={Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            value: 20 + Math.sin(i / 3) * 5 + Math.random() * 2
          }))}
          color="var(--temperature-color)"
        />
        <SensorGraph 
          title="Smoke Level Trend" 
          data={Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            value: Math.max(0, Math.random() * 0.5 + (i === 12 ? 3 : 0))
          }))}
          color="var(--smoke-color)"
        />
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button>Test Alarm</button>
          <button>AI Diagnostics</button>
          <button>Share Status</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;