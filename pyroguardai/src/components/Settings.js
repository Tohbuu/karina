import React, { useState, useEffect } from 'react';
import { updateSettings } from '../fireAlarmService';

const Settings = ({ data }) => {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (data) {
      setSettings(data.aiSettings);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTimeChange = (e, field) => {
    const { value } = e.target;
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const result = await updateSettings(settings);
      setSaveStatus({ success: true, message: 'Settings saved successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ success: false, message: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="loading">Loading settings...</div>;

  return (
    <div className="settings-container">
      <h2>AI Fire Alarm Settings</h2>
      
      <div className="settings-section">
        <h3>AI Configuration</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              name="autoAdjust"
              checked={settings.autoAdjust}
              onChange={handleChange}
            />
            Auto-Adjust Sensor Sensitivity
          </label>
          <p className="setting-description">Let AI automatically optimize sensor thresholds based on patterns</p>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              name="learningMode"
              checked={settings.learningMode}
              onChange={handleChange}
            />
            Enable Learning Mode
          </label>
          <p className="setting-description">Allow AI to learn from false alarms and environmental changes</p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Quiet Hours</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              name="enabled"
              checked={settings.quietHours.enabled}
              onChange={(e) => handleChange({
                target: {
                  name: 'quietHours',
                  type: 'checkbox',
                  checked: e.target.checked
                }
              })}
            />
            Enable Quiet Hours
          </label>
        </div>

        {settings.quietHours.enabled && (
          <div className="time-settings">
            <div className="time-input">
              <label>Start Time</label>
              <input
                type="time"
                value={settings.quietHours.start}
                onChange={(e) => handleTimeChange(e, 'start')}
              />
            </div>
            <div className="time-input">
              <label>End Time</label>
              <input
                type="time"
                value={settings.quietHours.end}
                onChange={(e) => handleTimeChange(e, 'end')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Sensor Sensitivity</h3>
        {data.sensors.map(sensor => (
          <div key={sensor.id} className="setting-item">
            <label>{sensor.name}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sensor.sensitivity}
              onChange={(e) => console.log(`Adjust ${sensor.name} sensitivity to ${e.target.value}`)}
            />
            <span>{sensor.sensitivity}%</span>
          </div>
        ))}
      </div>

      <div className="settings-actions">
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saveStatus && (
          <div className={`save-status ${saveStatus.success ? 'success' : 'error'}`}>
            {saveStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;