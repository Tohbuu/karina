// Global state object
const state = {
    settings: {
        autoAdjust: true,
        learningMode: false,
        quietHours: {
            enabled: false,
            start: "22:00",
            end: "06:00"
        }
    },
    user: {
        name: "User",
        location: null,
        emergencyContacts: []
    },
    sensors: {
        temperature: 22.5,
        smokeLevel: 0.1
    },
    emergency: false,
    alerts: []
};

let tempChart, smokeChart;

// Tab Navigation
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active'); // <-- Fix here
}

// Chart Initialization
function initCharts() {
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(tempCtx, {
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

    const smokeCtx = document.getElementById('smokeChart').getContext('2d');
    smokeChart = new Chart(smokeCtx, {
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

// Update sensor data and charts
function updateSensorData() {
    // Simulate new sensor values
    state.sensors.temperature = 22 + Math.random() * 3;
    state.sensors.smokeLevel = Math.random() * 0.3;

    // Update temperature chart
    if (tempChart) {
        tempChart.data.datasets[0].data.push(state.sensors.temperature);
        tempChart.data.datasets[0].data.shift();
        tempChart.update();
    }
    // Update smoke chart
    if (smokeChart) {
        smokeChart.data.datasets[0].data.push(state.sensors.smokeLevel);
        smokeChart.data.datasets[0].data.shift();
        smokeChart.update();
    }

    // Update UI
    updateUI();

    // Simulate occasional emergency
    if (Math.random() > 0.97) {
        triggerEmergency('Kitchen', 'Smoke detected');
    }
}

// Emergency Functions
function silenceAlarm() {
    document.querySelector('.emergency-alert').classList.add('hidden');
    document.body.classList.remove('emergency-mode');
    state.emergency = false;
}

// Emergency trigger
function triggerEmergency(location, reason) {
    state.emergency = true;
    document.querySelector('.emergency-alert').classList.remove('hidden');
    document.body.classList.add('emergency-mode');
    // Optionally update alert text
    document.querySelector('.emergency-alert p').textContent = `${reason} in ${location}`;
}

// Vibration and geolocation setup
function setupEventListeners() {
    // Emergency vibration
    if ('vibrate' in navigator) {
        setInterval(() => {
            if (state.emergency) {
                navigator.vibrate([500, 200, 500]);
            }
        }, 1000);
    }
    // Geolocation
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            state.user.location = pos.coords;
        });
    }
}

// UI update
function updateUI() {
    // Update temperature value
    const tempValue = document.getElementById('temp-value');
    if (tempValue) {
        tempValue.textContent = `${state.sensors.temperature.toFixed(1)}°C`;
    }
    // Emergency alert visibility
    if (state.emergency) {
        document.querySelector('.emergency-alert').classList.remove('hidden');
        document.body.classList.add('emergency-mode');
    } else {
        document.querySelector('.emergency-alert').classList.add('hidden');
        document.body.classList.remove('emergency-mode');
    }
}

// Settings Management
function initSettings() {
    const settingsEl = document.getElementById('settings');
    if (!settingsEl) return;
    settingsEl.innerHTML = ''; // Clear previous
    const settingsForm = document.createElement('div');
    settingsForm.className = 'settings-container';
    settingsForm.innerHTML = `
        <h2>AI Fire Alarm Settings</h2>
        <div class="settings-section">
            <h3>AI Configuration</h3>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="auto-adjust" ${state.settings.autoAdjust ? 'checked' : ''}>
                    Auto-Adjust Sensor Sensitivity
                </label>
                <p class="setting-description">Let AI automatically optimize sensor thresholds</p>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="learning-mode" ${state.settings.learningMode ? 'checked' : ''}>
                    Enable Learning Mode
                </label>
                <p class="setting-description">Allow AI to learn from false alarms</p>
            </div>
        </div>
        <div class="settings-section">
            <h3>Quiet Hours</h3>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="quiet-hours" ${state.settings.quietHours.enabled ? 'checked' : ''}>
                    Enable Quiet Hours
                </label>
            </div>
            <div class="time-settings ${!state.settings.quietHours.enabled ? 'hidden' : ''}">
                <div class="time-input">
                    <label>Start Time</label>
                    <input type="time" id="quiet-start" value="${state.settings.quietHours.start}">
                </div>
                <div class="time-input">
                    <label>End Time</label>
                    <input type="time" id="quiet-end" value="${state.settings.quietHours.end}">
                </div>
            </div>
        </div>
        <div class="settings-actions">
            <button onclick="saveSettings()">Save Settings</button>
            <div id="save-status"></div>
        </div>
    `;
    settingsEl.appendChild(settingsForm);

    // Toggle quiet hours visibility
    document.getElementById('quiet-hours').addEventListener('change', function() {
        document.querySelector('.time-settings').classList.toggle('hidden', !this.checked);
    });
}

function saveSettings() {
    state.settings = {
        autoAdjust: document.getElementById('auto-adjust').checked,
        learningMode: document.getElementById('learning-mode').checked,
        quietHours: {
            enabled: document.getElementById('quiet-hours').checked,
            start: document.getElementById('quiet-start').value,
            end: document.getElementById('quiet-end').value
        }
    };
    const statusEl = document.getElementById('save-status');
    statusEl.textContent = 'Settings saved successfully!';
    statusEl.className = 'save-status success';
    setTimeout(() => statusEl.textContent = '', 3000);
}

// User Profile Management
function initProfile() {
    const profileEl = document.getElementById('profile');
    if (!profileEl) return;
    profileEl.innerHTML = ''; // Clear previous
    const profileSection = document.createElement('div');
    profileSection.className = 'user-profile';
    profileSection.innerHTML = `
        <h2>User Profile</h2>
        <div class="profile-section">
            <h3>Personal Information</h3>
            <div class="profile-info">
                <div class="info-item">
                    <label>Name</label>
                    <p>${state.user.name}</p>
                </div>
                <div class="info-item">
                    <label>Email</label>
                    <p>user@example.com</p>
                </div>
                <div class="info-item">
                    <label>Phone</label>
                    <p>+1 (555) 123-4567</p>
                </div>
            </div>
        </div>
        <div class="profile-section">
            <h3>Emergency Contacts</h3>
            <div class="emergency-contacts" id="contacts-list">
                ${state.user.emergencyContacts.map(contact => `
                    <div class="contact-card">
                        <div class="contact-info">
                            <h4>${contact.name}</h4>
                            <p>${contact.relationship}</p>
                            <p>${contact.phone}</p>
                        </div>
                        <button class="remove-contact" onclick="removeContact('${contact.phone}')">
                            Remove
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="add-contact-form">
                <h4>Add New Emergency Contact</h4>
                <div class="form-group">
                    <input type="text" id="contact-name" placeholder="Full Name">
                    <input type="tel" id="contact-phone" placeholder="Phone Number">
                    <input type="text" id="contact-relation" placeholder="Relationship">
                    <button onclick="addContact()">Add Contact</button>
                </div>
            </div>
        </div>
        <div class="profile-section">
            <h3>Emergency Protocols</h3>
            <div class="protocols">
                <div class="protocol-item">
                    <label>
                        <input type="checkbox" id="notify-contacts" checked>
                        Automatically notify emergency contacts
                    </label>
                </div>
                <div class="protocol-item">
                    <label>
                        <input type="checkbox" id="share-location" checked>
                        Share location with emergency services
                    </label>
                </div>
            </div>
        </div>
    `;
    profileEl.appendChild(profileSection);
}

function addContact() {
    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    const relation = document.getElementById('contact-relation').value;
    if (name && phone) {
        state.user.emergencyContacts.push({
            name,
            phone,
            relationship: relation || 'Emergency Contact'
        });
        saveState(); // <-- Add this
        initProfile(); // Refresh profile view
    }
}

function removeContact(phone) {
    state.user.emergencyContacts = state.user.emergencyContacts.filter(
        contact => contact.phone !== phone
    );
    saveState(); // <-- Add this
    initProfile(); // Refresh profile view
}

// Advanced Alarm Features (stubs)
function testAlarm() {
    triggerEmergency('Test Zone', 'Manual test alarm');
    state.alerts.unshift({
        id: Date.now(),
        timestamp: new Date(),
        message: 'Manual system test initiated',
        severity: 'info'
    });
    // loadAlerts(); // Implement if needed
}

function runDiagnostics() {
    const problems = Math.random() > 0.7 ? ['Kitchen sensor needs calibration'] : [];
    alert(problems.length > 0 
        ? `Potential issues detected:\n- ${problems.join('\n- ')}` 
        : 'All systems normal');
}

function shareStatus() {
    const status = `PyroGuard Status: ${
        state.emergency ? '🚨 EMERGENCY' : '✅ All clear'
    }\nTemp: ${state.sensors.temperature.toFixed(1)}°C | Smoke: ${
        state.sensors.smokeLevel.toFixed(1)}%`;
    if (navigator.share) {
        navigator.share({ title: 'PyroGuard Status', text: status });
    } else {
        prompt('Copy status:', status);
    }
}

// Sensor Simulation
function simulateSensorData() {
    setInterval(updateSensorData, 3000);
}

// Initialize all components
function init() {
    initCharts();
    initSettings();
    initProfile();
    setupEventListeners();
    simulateSensorData();
    updateUI();
}

document.addEventListener('DOMContentLoaded', init);

// Initialize localStorage
function loadState() {
    if (localStorage.getItem('pyroguard-state')) {
        state = JSON.parse(localStorage.getItem('pyroguard-state'));
    }
}

function saveState() {
    localStorage.setItem('pyroguard-state', JSON.stringify(state));
}

// Shared functions
function triggerEmergency(location, message) {
    state.emergency = true;
    state.alerts.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        location,
        message,
        severity: 'critical'
    });
    saveState();
    
    // If on dashboard, show alert
    if (document.getElementById('emergency-alert')) {
        document.getElementById('emergency-alert').classList.remove('hidden');
    }
}

// Run on every page
loadState();