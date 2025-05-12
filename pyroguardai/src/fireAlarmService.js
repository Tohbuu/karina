// Mock service for the fire alarm data
export const getFireAlarmData = async () => {
  // In a real app, this would fetch from your API
  return {
    status: 'normal',
    temperature: 22.5,
    smokeLevel: 0.2,
    airQuality: 45,
    co2Level: 420,
    sensors: [
      { id: 1, name: 'Kitchen', status: 'normal', sensitivity: 75 },
      { id: 2, name: 'Living Room', status: 'normal', sensitivity: 65 },
      { id: 3, name: 'Bedroom', status: 'normal', sensitivity: 70 }
    ],
    aiSettings: {
      autoAdjust: true,
      learningMode: true,
      quietHours: { enabled: false, start: '22:00', end: '06:00' }
    }
  };
};

export const subscribeToAlerts = (callback) => {
  // In a real app, this would connect to WebSocket or similar
  const mockAlerts = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      message: 'AI adjusted kitchen sensor sensitivity',
      severity: 'info'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      message: 'Smoke detected in kitchen (false positive)',
      severity: 'warning'
    }
  ];

  mockAlerts.forEach(alert => callback(alert));

  const interval = setInterval(() => {
    // Simulate occasional alerts
    if (Math.random() > 0.9) {
      const alertTypes = [
        { message: 'Temperature rising in living room', severity: 'warning' },
        { message: 'Smoke detected in kitchen!', severity: 'critical' },
        { message: 'AI learned new pattern', severity: 'info' }
      ];
      const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      callback({
        id: Date.now(),
        timestamp: new Date(),
        ...alert
      });
    }
  }, 10000);

  return () => clearInterval(interval);
};

export const updateSettings = async (settings) => {
  console.log('Updating settings:', settings);
  // In a real app, this would POST to your API
  return { success: true };
};