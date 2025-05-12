// Tab Navigation
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Chart Initialization
function initCharts() {
    // Temperature Chart
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Temperature',
                data: Array.from({length: 24}, () => 20 + Math.random() * 5),
                borderColor: '#ff9a3a',
                tension: 0.4
            }]
        }
    });

    // Smoke Chart
    const smokeCtx = document.getElementById('smokeChart').getContext('2d');
    new Chart(smokeCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Smoke Level',
                data: Array.from({length: 24}, () => Math.random() * 0.5),
                borderColor: '#666',
                tension: 0.4
            }]
        }
    });
}

// Simulate Sensor Data Updates
function updateSensorData() {
    document.getElementById('temp-value').textContent = 
        `${(22.5 + Math.random() * 2).toFixed(1)}°C`;
    
    // Simulate occasional emergency
    if (Math.random() > 0.95) {
        document.querySelector('.emergency-alert').classList.remove('hidden');
        document.body.classList.add('emergency-mode');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    setInterval(updateSensorData, 3000);
});

// Emergency Functions
function silenceAlarm() {
    document.querySelector('.emergency-alert').classList.add('hidden');
    document.body.classList.remove('emergency-mode');
}