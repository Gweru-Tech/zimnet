// API Base URL
const API_URL = window.location.origin;

// Utility function to copy text to clipboard
// ============================================
// COPY TO CLIPBOARD FUNCTION
// ============================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Copied to clipboard: ' + text);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('❌ Failed to copy. Please copy manually.');
    });
}

// ============================================
// ADMIN PANEL FUNCTIONALITY
// ============================================

const ADMIN_CREDENTIALS = {
    username: 'ntando',
    password: 'ntando'
};

let isAdminLoggedIn = false;

// LocalStorage keys
const STORAGE_KEYS = {
    SNI_BUGS: 'zimnet_sni_bugs',
    DONATION_INFO: 'zimnet_donation_info',
    TIPS: 'zimnet_tips',
    APN_SETTINGS: 'zimnet_apn_settings'
};

// Initialize data structure
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.SNI_BUGS)) {
        const defaultSNI = {
            econet: [
                { host: 'www.google.com', proxyIp: '104.16.132.229', port: '443', status: 'working' },
                { host: 'www.youtube.com', proxyIp: '104.16.132.229', port: '443', status: 'working' }
            ],
            netone: [
                { host: 'www.whatsapp.com', proxyIp: '104.16.132.229', port: '443', status: 'working' },
                { host: 'web.whatsapp.com', proxyIp: '104.16.132.229', port: '443', status: 'working' }
            ],
            telecel: [
                { host: 'www.facebook.com', proxyIp: '104.16.132.229', port: '443', status: 'working' },
                { host: 'm.facebook.com', proxyIp: '104.16.132.229', port: '443', status: 'unstable' }
            ]
        };
        localStorage.setItem(STORAGE_KEYS.SNI_BUGS, JSON.stringify(defaultSNI));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.DONATION_INFO)) {
        const defaultDonation = {
            ecocash: '+263 XX XXX XXXX',
            onemoney: '+263 XX XXX XXXX',
            paypal: 'zimnet@gmail.com'
        };
        localStorage.setItem(STORAGE_KEYS.DONATION_INFO, JSON.stringify(defaultDonation));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.TIPS)) {
        const defaultTips = [
            { 
                id: 1,
                title: 'Enable 4G/LTE Only', 
                content: 'Go to Settings > Mobile Network > Preferred Network Type > Select LTE/4G only for faster speeds.', 
                icon: '📶' 
            },
            { 
                id: 2,
                title: 'Clear Network Cache', 
                content: 'Restart your phone daily to clear network cache and refresh connections.', 
                icon: '🔄' 
            },
            { 
                id: 3,
                title: 'Use DNS Servers', 
                content: 'Set custom DNS: 1.1.1.1 (Primary) and 8.8.8.8 (Secondary) for faster browsing.', 
                icon: '🌐' 
            },
            { 
                id: 4,
                title: 'Airplane Mode Reset', 
                content: 'Toggle airplane mode ON for 10 seconds, then OFF to refresh network connection.', 
                icon: '✈️' 
            },
            { 
                id: 5,
                title: 'Update Carrier Settings', 
                content: 'Check for carrier updates in Settings > About Phone > System Updates.', 
                icon: '📲' 
            }
        ];
        localStorage.setItem(STORAGE_KEYS.TIPS, JSON.stringify(defaultTips));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.APN_SETTINGS)) {
        const defaultAPN = {
            econet: {
                name: 'Econet Internet',
                apn: 'econet',
                proxy: '',
                port: '',
                username: '',
                password: '',
                server: '',
                mmsc: 'http://10.252.140.66:8002',
                mms_proxy: '10.252.140.6',
                mms_port: '8080',
                mcc: '648',
                mnc: '01',
                authentication_type: 'None',
                apn_type: 'default,supl,mms'
            },
            netone: {
                name: 'NetOne Internet',
                apn: 'internet',
                proxy: '',
                port: '',
                username: '',
                password: '',
                server: '',
                mmsc: 'http://mms.ne.co.zw:8080',
                mms_proxy: '10.179.34.35',
                mms_port: '8080',
                mcc: '648',
                mnc: '03',
                authentication_type: 'None',
                apn_type: 'default,supl,mms'
            },
            telecel: {
                name: 'Telecel Internet',
                apn: 'internet',
                proxy: '',
                port: '',
                username: '',
                password: '',
                server: '',
                mmsc: 'http://mms.telecel.co.zw:8080',
                mms_proxy: '10.11.12.13',
                mms_port: '8080',
                mcc: '648',
                mnc: '04',
                authentication_type: 'None',
                apn_type: 'default,supl,mms'
            }
        };
        localStorage.setItem(STORAGE_KEYS.APN_SETTINGS, JSON.stringify(defaultAPN));
    }
}

// Load donation info
function loadDonationInfo() {
    const donationInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.DONATION_INFO));
    if (donationInfo) {
        document.getElementById('ecocash-number').textContent = donationInfo.ecocash;
        document.getElementById('onemoney-number').textContent = donationInfo.onemoney;
        document.getElementById('paypal-email').textContent = donationInfo.paypal;
    }
}

// Modal Controls
const adminLoginModal = document.getElementById('admin-login-modal');
const adminPanelModal = document.getElementById('admin-panel-modal');
const adminAccessBtn = document.getElementById('admin-access-btn');
const closeLoginModal = document.querySelector('.close-modal');
const closeAdminPanel = document.querySelector('.close-admin-panel');

// Open admin login modal
adminAccessBtn.addEventListener('click', () => {
    adminLoginModal.style.display = 'block';
});

// Close modals
closeLoginModal.addEventListener('click', () => {
    adminLoginModal.style.display = 'none';
});

closeAdminPanel.addEventListener('click', () => {
    adminPanelModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === adminLoginModal) {
        adminLoginModal.style.display = 'none';
    }
    if (e.target === adminPanelModal) {
        adminPanelModal.style.display = 'none';
    }
});

// Admin Login
document.getElementById('admin-login-btn').addEventListener('click', () => {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const errorElement = document.getElementById('login-error');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        adminLoginModal.style.display = 'none';
        adminPanelModal.style.display = 'block';
        errorElement.textContent = '';
        loadAdminPanel();
    } else {
        errorElement.textContent = '❌ Invalid credentials!';
    }
});

// Admin Logout
document.getElementById('admin-logout-btn').addEventListener('click', () => {
    isAdminLoggedIn = false;
    adminPanelModal.style.display = 'none';
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
});

// Admin Tab Navigation
const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
const adminTabContents = document.querySelectorAll('.admin-tab-content');

adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-admin-tab');
        
        adminTabBtns.forEach(b => b.classList.remove('active'));
        adminTabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// ============================================
// SNI BUGS MANAGEMENT
// ============================================

function loadAdminPanel() {
    loadAdminSNIList();
    loadAdminDonationSettings();
    loadAdminTipsList();
}

// Add SNI Host
document.getElementById('add-sni-btn').addEventListener('click', () => {
    const carrier = document.getElementById('admin-carrier').value;
    const host = document.getElementById('admin-sni-host').value.trim();
    const proxyIp = document.getElementById('admin-proxy-ip').value.trim();
    const port = document.getElementById('admin-proxy-port').value.trim();
    const status = document.getElementById('admin-sni-status').value;
    
    if (!host || !proxyIp || !port) {
        alert('❌ Please fill all fields!');
        return;
    }
    
    const sniData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SNI_BUGS));
    sniData[carrier].push({ host, proxyIp, port, status });
    localStorage.setItem(STORAGE_KEYS.SNI_BUGS, JSON.stringify(sniData));
    
    // Clear inputs
    document.getElementById('admin-sni-host').value = '';
    document.getElementById('admin-proxy-ip').value = '104.16.132.229';
    document.getElementById('admin-proxy-port').value = '443';
    
    loadAdminSNIList();
    loadSNIBugs(); // Refresh main display
    alert('✅ SNI host added successfully!');
});

// Load admin SNI list
function loadAdminSNIList() {
    const sniData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SNI_BUGS));
    const container = document.getElementById('admin-sni-list');
    container.innerHTML = '';
    
    Object.keys(sniData).forEach(carrier => {
        const carrierSection = document.createElement('div');
        carrierSection.innerHTML = `<h4 style="margin-top: 20px; text-transform: capitalize;">${carrier}</h4>`;
        
        sniData[carrier].forEach((sni, index) => {
            const statusIcon = sni.status === 'working' ? '✅' : sni.status === 'unstable' ? '⚠️' : '❌';
            const item = document.createElement('div');
            item.className = 'admin-list-item';
            item.innerHTML = `
                <div>
                    <strong>$${statusIcon}$$ {sni.host}</strong><br>
                    <small>IP: ${sni.proxyIp}:${sni.port}</small>
                </div>
                <button onclick="deleteSNI('$${carrier}',$$ {index})">Delete</button>
            `;
            carrierSection.appendChild(item);
        });
        
        container.appendChild(carrierSection);
    });
}

// Delete SNI
function deleteSNI(carrier, index) {
    if (!confirm('Are you sure you want to delete this SNI host?')) return;
    
    const sniData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SNI_BUGS));
    sniData[carrier].splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.SNI_BUGS, JSON.stringify(sniData));
    
    loadAdminSNIList();
    loadSNIBugs();
    alert('✅ SNI host deleted!');
}

// ============================================
// DONATION INFO MANAGEMENT
// ============================================

function loadAdminDonationSettings() {
    const donationInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.DONATION_INFO));
    document.getElementById('admin-ecocash').value = donationInfo.ecocash;
    document.getElementById('admin-onemoney').value = donationInfo.onemoney;
    document.getElementById('admin-paypal').value = donationInfo.paypal;
}

// Update donation info
document.getElementById('update-donation-btn').addEventListener('click', () => {
    const donationInfo = {
        ecocash: document.getElementById('admin-ecocash').value.trim(),
        onemoney: document.getElementById('admin-onemoney').value.trim(),
        paypal: document.getElementById('admin-paypal').value.trim()
    };
    
    if (!donationInfo.ecocash || !donationInfo.onemoney || !donationInfo.paypal) {
        alert('❌ Please fill all fields!');
        return;
    }
    
    localStorage.setItem(STORAGE_KEYS.DONATION_INFO, JSON.stringify(donationInfo));
    loadDonationInfo();
    alert('✅ Donation information updated!');
});

// ============================================
// TIPS MANAGEMENT
// ============================================

// Add tip
document.getElementById('add-tip-btn').addEventListener('click', () => {
    const title = document.getElementById('admin-tip-title').value.trim();
    const content = document.getElementById('admin-tip-content').value.trim();
    const icon = document.getElementById('admin-tip-icon').value.trim() || '💡';
    
    if (!title || !content) {
        alert('❌ Please fill title and content!');
        return;
    }
    
    const tips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIPS));
    const newId = tips.length > 0 ? Math.max(...tips.map(t => t.id)) + 1 : 1;
    
    tips.push({ id: newId, title, content, icon });
    localStorage.setItem(STORAGE_KEYS.TIPS, JSON.stringify(tips));
    
    // Clear inputs
    document.getElementById('admin-tip-title').value = '';
    document.getElementById('admin-tip-content').value = '';
    document.getElementById('admin-tip-icon').value = '';
    
    loadAdminTipsList();
    loadTips(); // Refresh main display
    alert('✅ Tip added successfully!');
});

// Load admin tips list
function loadAdminTipsList() {
    const tips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIPS));
    const container = document.getElementById('admin-tips-list');
    container.innerHTML = '';
    
    tips.forEach(tip => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
            <div>
                <strong>$${tip.icon}$$ {tip.title}</strong><br>
                <small>${tip.content.substring(0, 80)}...</small>
            </div>
            <button onclick="deleteTip(${tip.id})">Delete</button>
        `;
        container.appendChild(item);
    });
}

// Delete tip
function deleteTip(id) {
    if (!confirm('Are you sure you want to delete this tip?')) return;
    
    let tips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIPS));
    tips = tips.filter(tip => tip.id !== id);
    localStorage.setItem(STORAGE_KEYS.TIPS, JSON.stringify(tips));
    
    loadAdminTipsList();
    loadTips();
    alert('✅ Tip deleted!');
}

// ============================================
// APN SETTINGS MANAGEMENT
// ============================================

// Update APN
document.getElementById('update-apn-btn').addEventListener('click', () => {
    const carrier = document.getElementById('admin-apn-carrier').value;
    const name = document.getElementById('admin-apn-name').value.trim();
    const apn = document.getElementById('admin-apn-value').value.trim();
    const proxy = document.getElementById('admin-apn-proxy').value.trim();
    const port = document.getElementById('admin-apn-port').value.trim();
    const mmsc = document.getElementById('admin-apn-mmsc').value.trim();
    
    if (!name || !apn) {
        alert('❌ Please fill APN name and value!');
        return;
    }
    
    const apnSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.APN_SETTINGS));
    apnSettings[carrier].name = name;
    apnSettings[carrier].apn = apn;
    apnSettings[carrier].proxy = proxy;
    apnSettings[carrier].port = port;
    apnSettings[carrier].mmsc = mmsc;
    
    localStorage.setItem(STORAGE_KEYS.APN_SETTINGS, JSON.stringify(apnSettings));
    
    alert('✅ APN settings updated!');
});

// ============================================
// LOAD SNI BUGS ON MAIN PAGE
// ============================================

function loadSNIBugs() {
    const sniData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SNI_BUGS));
    const container = document.getElementById('sni-bugs-container');
    container.innerHTML = '';
    
    Object.keys(sniData).forEach(carrier => {
        const carrierName = carrier.charAt(0).toUpperCase() + carrier.slice(1);
        const section = document.createElement('div');
        section.className = 'sni-carrier-section';
        section.innerHTML = `<h3>📱 ${carrierName}</h3>`;
        
        sniData[carrier].forEach(sni => {
            const statusClass = sni.status === 'working' ? 'status-working' : 
                              sni.status === 'unstable' ? 'status-unstable' : 'status-not-working';
            const statusIcon = sni.status === 'working' ? '✅' : 
                             sni.status === 'unstable' ? '⚠️' : '❌';
            const statusText = sni.status === 'working' ? 'Working' : 
                             sni.status === 'unstable' ? 'Unstable' : 'Not Working';
            
            const card = document.createElement('div');
            card.className = 'sni-card';
            card.innerHTML = `
                <div class="sni-header">
                    <strong>SNI Host:</strong> ${sni.host}
                    <span class="sni-status ${statusClass}">$${statusIcon}$$ {statusText}</span>
                </div>
                <div class="sni-details">
                    <p><strong>Proxy IP:</strong> ${sni.proxyIp}</p>
                    <p><strong>Port:</strong> ${sni.port}</p>
                </div>
                <button class="btn-copy" onclick="copyToClipboard('${sni.host}')">📋 Copy SNI Host</button>
            `;
            section.appendChild(card);
        });
        
        container.appendChild(section);
    });
    
    // Update last updated time
    const now = new Date();
    document.getElementById('last-updated').textContent = now.toLocaleString();
}

// ============================================
// LOAD TIPS ON MAIN PAGE
// ============================================

function loadTips() {
    const tips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIPS));
    const container = document.getElementById('tips-container');
    container.innerHTML = '';
    
    tips.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'tip-card';
        card.innerHTML = `
            <div class="tip-icon">${tip.icon}</div>
            <h3>${tip.title}</h3>
            <p>${tip.content}</p>
        `;
        container.appendChild(card);
    });
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    loadDonationInfo();
    loadSNIBugs();
    loadTips();
});
