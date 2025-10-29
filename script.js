// API Base URL
const API_URL = window.location.origin;

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button and target tab
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Speed Test Functionality
let isTestingSpeed = false;

document.getElementById('start-test').addEventListener('click', async () => {
    if (isTestingSpeed) return;
    
    isTestingSpeed = true;
    const button = document.getElementById('start-test');
    const statusEl = document.getElementById('test-status');
    
    button.textContent = 'Testing...';
    button.disabled = true;
    statusEl.className = 'test-status testing';
    statusEl.textContent = '⏳ Running speed test...';
    
    // Simulate speed test (in production, use actual speed test API)
    await simulateSpeedTest();
    
    statusEl.className = 'test-status complete';
    statusEl.textContent = '✅ Test complete!';
    button.textContent = 'Start Speed Test';
    button.disabled = false;
    isTestingSpeed = false;
});

async function simulateSpeedTest() {
    // Get network info
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const networkType = connection ? connection.effectiveType : 'unknown';
    
    document.getElementById('network-type').textContent = networkType.toUpperCase();
    
    // Simulate download test
    await animateSpeed('download-speed', 5, 50, 2000);
    
    // Simulate upload test
    await animateSpeed('upload-speed', 3, 25, 1500);
    
    // Simulate ping
    await animateSpeed('ping', 20, 80, 1000, ' ms');
    
    // Update main speed display
    const downloadSpeed = parseFloat(document.getElementById('download-speed').textContent);
    document.getElementById('speed-value').textContent = downloadSpeed.toFixed(1);
    
    // Update signal bars
    updateSignalBars(downloadSpeed);
}

function animateSpeed(elementId, min, max, duration, suffix = ' Mbps') {
    return new Promise(resolve => {
        const element = document.getElementById(elementId);
        const startTime = Date.now();
        const targetValue = Math.random() * (max - min) + min;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuad = progress => 1 - (1 - progress) * (1 - progress);
            const currentValue = targetValue * easeOutQuad(progress);
            
            element.textContent = currentValue.toFixed(1) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        };
        
        animate();
    });
}

function updateSignalBars(speed) {
    const bars = document.querySelectorAll('.signal-bars .bar');
    let activeCount = 0;
    let quality = '';
    
    if (speed < 10) {
        activeCount = 1;
        quality = '🔴 Poor Signal';
    } else if (speed < 20) {
        activeCount = 2;
        quality = '🟠 Fair Signal';
    } else if (speed < 30) {
        activeCount = 3;
        quality = '🟡 Good Signal';
    } else if (speed < 45) {
        activeCount = 4;
        quality = '🟢 Very Good Signal';
    } else {
        activeCount = 5;
        quality = '🟢 Excellent Signal';
    }
    
    bars.forEach((bar, index) => {
        if (index < activeCount) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
    
    document.getElementById('signal-quality').textContent = quality;
}

// Load Carriers
async function loadCarriers() {
    try {
        const response = await fetch(`${API_URL}/api/carriers`);
        const carriers = await response.json();
        
        const container = document.getElementById('carrier-cards');
        container.innerHTML = '';
        
        Object.keys(carriers).forEach(key => {
            const carrier = carriers[key];
            const card = document.createElement('div');
            card.className = 'carrier-card';
            
            const badge5G = carrier.has5G 
                ? '<span class="badge has-5g">✅ 5G Available</span>'
                : '<span class="badge no-5g">❌ No 5G</span>';
            
            const speeds = Object.entries(carrier.speeds)
                .map(([type, speed]) => `<li><strong>${type}:</strong> ${speed}</li>`)
                .join('');
            
            card.innerHTML = `
                <h3>${carrier.name}</h3>
                ${badge5G}
                <p><strong>Coverage:</strong> ${carrier.coverage}</p>
                <h4>Speeds:</h4>
                <ul>${speeds}</ul>
            `;
            
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading carriers:', error);
        document.getElementById('carrier-cards').innerHTML = 
            '<p>Error loading carrier data. Please refresh the page.</p>';
    }
}

// Load Devices
async function loadDevices() {
    try {
        const response = await fetch(`${API_URL}/api/devices`);
        const devices = await response.json();
        
        const container = document.getElementById('device-list');
        container.innerHTML = '';
        
        devices.forEach(device => {
            const item = document.createElement('div');
            item.className = 'device-item';
            
            const icon = device.supports5G ? '✅' : '❌';
            const support = device.supports5G ? '5G Supported' : '4G Only';
            
            item.innerHTML = `
                <span><strong>${device.model}</strong></span>
                <span>$${icon}$$ {support}</span>
            `;
            
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading devices:', error);
    }
}

// Device Check
document.getElementById('check-device-btn').addEventListener('click', async () => {
    const deviceInput = document.getElementById('device-input').value.trim();
    const resultDiv = document.getElementById('device-result');
    
    if (!deviceInput) {
        resultDiv.innerHTML = '<p>Please enter a device model</p>';
        resultDiv.className = 'device-result';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/check-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ deviceModel: deviceInput })
        });
        
        const result = await response.json();
        
        if (result.supports5G) {
            resultDiv.className = 'device-result compatible';
            resultDiv.innerHTML = `
                <h3>🎉 ${result.model}</h3>
                <p><strong>5G Compatible!</strong></p>
                <p>This device supports 5G networks. Make sure you have:</p>
                <ul style="text-align: left; margin-top: 10px;">
                    <li>A 5G-enabled SIM card</li>
                    <li>5G coverage in your area</li>
                    <li>5G enabled in device settings</li>
                </ul>
            `;
        } else {
            resultDiv.className = 'device-result not-compatible';
            resultDiv.innerHTML = `
                <h3>📱 ${result.model}</h3>
                <p><strong>4G Only Device</strong></p>
                <p>${result.message || 'This device does not support 5G networks.'}</p>
                <p style="margin-top: 10px;">Consider upgrading to a 5G-capable device to access faster speeds.</p>
            `;
        }
    } catch (error) {
        console.error('Error checking device:', error);
        resultDiv.innerHTML = '<p>Error checking device. Please try again.</p>';
    }
});

// APN Settings
document.getElementById('carrier-select').addEventListener('change', async (e) => {
    const carrier = e.target.value;
    const detailsDiv = document.getElementById('apn-details');
    
    if (!carrier) {
        detailsDiv.innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`$${API_URL}/api/carrier/$$ {carrier}`);
        const data = await response.json();
        
        detailsDiv.innerHTML = `
            <h3>${data.name} APN Settings</h3>
            <div class="apn-field">
                <strong>Name:</strong>
                <span>${data.apn.name}</span>
            </div>
            <div class="apn-field">
                <strong>APN:</strong>
                <span>${data.apn.name}</span>
            </div>
            <div class="apn-field">
                <strong>Username:</strong>
                <span>${data.apn.username || '(Leave blank)'}</span>
            </div>
            <div class="apn-field">
                <strong>Password:</strong>
                <span>${data.apn.password || '(Leave blank)'}</span>
            </div>
            <div class="apn-field">
                <strong>APN Type:</strong>
                <span>${data.apn.type}</span>
            </div>
            <div class="apn-field">
                <strong>MCC:</strong>
                <span>648 (Zimbabwe)</span>
            </div>
            <div class="apn-field">
                <strong>MNC:</strong>
                <span>01 (${data.name})</span>
            </div>
        `;
    } catch (error) {
        console.error('Error loading APN settings:', error);
        detailsDiv.innerHTML = '<p>Error loading APN settings. Please try again.</p>';
    }
});

// Load Network Tips
async function loadNetworkTips() {
    try {
        const response = await fetch(`${API_URL}/api/network-tips`);
        const data = await response.json();
        
        const container = document.getElementById('tips-container');
        container.innerHTML = '';
        
        data.tips.forEach(tip => {
            const card = document.createElement('div');
            card.className = 'tip-card';
            
            const steps = tip.steps.map(step => `<li>${step}</li>`).join('');
            
            card.innerHTML = `
                <h4>${tip.title}</h4>
                <p>${tip.description}</p>
                <ol>${steps}</ol>
            `;
            
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading tips:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCarriers();
    loadDevices();
    loadNetworkTips();
    
    // Simulate initial signal check
    setTimeout(() => {
        const randomSpeed = Math.random() * 40 + 10;
        updateSignalBars(randomSpeed);
    }, 500);
});

// Additional Feature: Connection Status Monitor
if (navigator.onLine !== undefined) {
    window.addEventListener('online', () => {
        console.log('Connection restored');
        // You can add a notification here
    });
    
    window.addEventListener('offline', () => {
        console.log('Connection lost');
        // You can add a notification here
    });
}

// Network Information API (if supported)
if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
        connection.addEventListener('change', () => {
            console.log('Network changed:', connection.effectiveType);
        });
    }
}
