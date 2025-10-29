// API Base URL
const API_URL = window.location.origin;

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// VPN Configuration
document.getElementById('vpn-carrier-select')?.addEventListener('change', async (e) => {
    const carrier = e.target.value;
    const displayDiv = document.getElementById('vpn-config-display');
    
    if (!carrier) {
        displayDiv.innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`$${API_URL}/api/vpn-config/$$ {carrier}`);
        const config = await response.json();
        
        displayDiv.innerHTML = `
            <h3>🔒 VPN Configuration for ${config.name}</h3>
            <div class="config-grid">
                <div class="config-item">
                    <strong>SNI/Host:</strong>
                    <span class="copyable" onclick="copyToClipboard('${config.sniHost}')">${config.sniHost} 📋</span>
                </div>
                <div class="config-item">
                    <strong>Proxy IP:</strong>
                    <span class="copyable" onclick="copyToClipboard('${config.proxyIP}')">${config.proxyIP} 📋</span>
                </div>
                <div class="config-item">
                    <strong>Proxy Port:</strong>
                    <span class="copyable" onclick="copyToClipboard('${config.proxyPort}')">${config.proxyPort} 📋</span>
                </div>
                <div class="config-item">
                    <strong>Primary DNS:</strong>
                    <span class="copyable" onclick="copyToClipboard('${config.dns1}')">${config.dns1} 📋</span>
                </div>
                <div class="config-item">
                    <strong>Secondary DNS:</strong>
                    <span class="copyable" onclick="copyToClipboard('${config.dns2}')">${config.dns2} 📋</span>
                </div>
                <div class="config-item">
                    <strong>Protocol:</strong>
                    <span>${config.protocol}</span>
                </div>
            </div>
            <div class="payload-section">
                <h4>Payload Configuration:</h4>
                <textarea readonly class="payload-box" onclick="this.select()">${config.payloadConfig}</textarea>
                <button class="btn btn-copy" onclick="copyToClipboard('${config.payloadConfig.replace(/'/g, "\\'")}')">Copy Payload</button>
            </div>
            <div class="config-notes">
                <p><strong>📝 Note:</strong> ${config.notes}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading VPN config:', error);
        displayDiv.innerHTML = '<p class="error">Error loading configuration. Please try again.</p>';
    }
});

// Load SNI Bugs
async function loadSNIBugs() {
    try {
        const response = await fetch(`${API_URL}/api/sni-bugs`);
        const data = await response.json();
        const container = document.getElementById('sni-bugs-container');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.keys(data).forEach(carrier => {
            const carrierData = data[carrier];
            const card = document.createElement('div');
            card.className = 'sni-carrier-card';
            
            const hostsHTML = carrierData.working.map(host => `
                <div class="sni-host-item">
                    <div class="host-info">
                        <span class="host-name">${host.host}</span>
                        <span class="host-badge ${host.status.toLowerCase()}">${host.status}</span>
                        <span class="host-speed">${host.speed}</span>
                    </div>
                    <button class="btn-copy-small" onclick="copyToClipboard('${host.host}')">📋 Copy</button>
                </div>
            `).join('');
            
            const ipsHTML = carrierData.proxyIPs.map(ip => `
                <div
                app.listen(PORT, () => {
  console.log(`🚀 ZimNet Optimizer v7 running on port ${PORT}`);
  console.log(`👨‍💻 Created by Ntando Mods`);
  console.log(`📧 Contact: zimnet.gmail.com`);
});

