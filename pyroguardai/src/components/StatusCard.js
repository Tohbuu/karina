import React from 'react';

const StatusCard = ({ title, value, icon, status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'warning': return 'warning';
      case 'critical': return 'critical';
      default: return '';
    }
  };

  return (
    <div className={`status-card ${getStatusClass()}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatusCard;