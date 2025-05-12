import React from 'react';
import { FiAlertTriangle, FiInfo, FiClock } from 'react-icons/fi';

const Alerts = ({ alerts }) => {
  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return <FiAlertTriangle className="critical" />;
      case 'warning': return <FiAlertTriangle className="warning" />;
      default: return <FiInfo className="info" />;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="alerts-container">
      <h2>Recent Alerts</h2>
      {alerts.length === 0 ? (
        <div className="no-alerts">No alerts in the past 24 hours</div>
      ) : (
        <ul className="alerts-list">
          {alerts.map(alert => (
            <li key={alert.id} className={`alert-item ${alert.severity}`}>
              <div className="alert-icon">{getAlertIcon(alert.severity)}</div>
              <div className="alert-content">
                <p>{alert.message}</p>
                <div className="alert-time">
                  <FiClock /> {formatTime(alert.timestamp)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Alerts;