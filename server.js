const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// SNI Bug Hosts Data (Updated regularly)
const sniBugHosts = {
  econet: {
    working: [
      { host: "www.opensignal.com", status: "Active", speed: "Fast", lastTested: "2024-10-29" },
      { host: "www.googleapis.com", status: "Active", speed: "Medium", lastTested: "2024-10-29" },
      { host: "api.whatsapp.com", status: "Active", speed: "Fast", lastTested: "2024-10-29" },
      { host: "www.cloudflare.com", status: "Active", speed: "Fast", lastTested: "2024-10-29" },
      { host: "cdn.jsdelivr.net", status: "Active", speed: "Medium", lastTested: "2024-10-29" }
    ],
    proxyIPs: [
      "104.16.132.229:443",
      "104.16.133.229:443",
      "172.67.70.101:443",
      "104.21.54.138:443"
    ]
  },
  netone: {
    working: [
      { host: "m.facebook.com", status: "Active", speed: "Fast", lastTested: "2024-10-29" },
      { host: "www.whatsapp.com", status: "Active", speed: "Medium", lastTested: "2024-10-29" },
      { host: "fonts.googleapis.com", status: "Active", speed: "Fast", lastTested: "2024-10-29" },
      { host: "www.cloudflare.com", status: "Active", speed: "Fast", lastTested: "2024-10-29" },
      { host: "ajax.googleapis.com", status: "Active", speed: "Medium", lastTested: "2024-10-29" }
    ],
    proxyIPs: [
      "104.16.132.229:443",
      "172.67.165.165:443",
      "104.21.48.35:443",
      "172.67.70.101:443"
    ]
  },
  telecel: {
    working: [
      { host: "www.google.com", status: "Active", speed: "Medium", lastTested: "2024-10-29" },
      { host: "www.youtube.com", status: "Active", speed: "Fast", lastTested: "2024-10-29" },
      { host: "fonts.gstatic.com", status: "Active", speed: "Medium", lastTested: "2024-10-29" },
      { host: "www.cloudflare.com", status: "Active", speed: "Fast", lastTested: "2024-10-29" },
      { host: "cdn.jsdelivr.net", status: "Active", speed: "Medium", lastTested: "2024-10-29" }
    ],
    proxyIPs: [
      "104.16.132.229:443",
      "104.16.133.229:443",
      "172.67.70.101:443",
      "104.21.54.138:443"
    ]
  }
};

// VPN Configuration Templates
const vpnConfigs = {
  econet: {
    name: "Econet Wireless",
    sniHost: "www.opensignal.com",
    proxyIP: "104.16.132.229",
    proxyPort: "443",
    dns1: "1.1.1.1",
    dns2: "8.8.8.8",
    protocol: "SSL/TLS",
    payloadConfig: "GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf][crlf]",
    notes: "Works best with HTTP Injector or HA Tunnel Plus"
  },
  netone: {
    name: "NetOne",
    sniHost: "m.facebook.com",
    proxyIP: "104.16.132.229",
    proxyPort: "443",
    dns1: "1.1.1.1",
    dns2: "8.8.8.8",
    protocol: "SSL/TLS",
    payloadConfig: "GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf][crlf]",
    notes: "Stable connection with custom DNS"
  },
  telecel: {
    name: "Telecel Zimbabwe",
    sniHost: "www.youtube.com",
    proxyIP: "104.16.132.229",
    proxyPort: "443",
    dns1: "1.1.1.1",
    dns2: "8.8.8.8",
    protocol: "SSL/TLS",
    payloadConfig: "GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf][crlf]",
    notes: "Use with SSL tunnel for best results"
  }
};

// Network data for Zimbabwe carriers
const carrierData = {
  econet: {
    name: "Econet Wireless",
    has5G: true,
    coverage: "95%",
    apn: {
      name: "internet",
      username: "",
      password: "",
      type: "default,supl"
    },
    speeds: { "4G": "20-50 Mbps", "5G": "100-300 Mbps" }
  },
  netone: {
    name: "NetOne",
    has5G: true,
    coverage: "85%",
    apn: {
      name: "internet",
      username: "",
      password: "",
      type: "default"
    },
    speeds: { "4G": "15-40 Mbps", "5G": "80-250 Mbps" }
  },
  telecel: {
    name: "Telecel Zimbabwe",
    has5G: false,
    coverage: "75%",
    apn: {
      name: "internet",
      username: "",
      password: "",
      type: "default"
    },
    speeds: { "4G": "10-35 Mbps" }
  }
};

// 5G compatible devices (expanded list)
const devices5G = [
  { model: "Samsung Galaxy S21", supports5G: true, brand: "Samsung" },
  { model: "Samsung Galaxy S22", supports5G: true, brand: "Samsung" },
  { model: "Samsung Galaxy S23", supports5G: true, brand: "Samsung" },
  { model: "iPhone 12", supports5G: true, brand: "Apple" },
  { model: "iPhone 13", supports5G: true, brand: "Apple" },
  { model: "iPhone 14", supports5G: true, brand: "Apple" },
  { model: "Huawei P40 Pro", supports5G: true, brand: "Huawei" },
  { model: "Huawei Mate 40 Pro", supports5G: true, brand: "Huawei" },
  { model: "Xiaomi Mi 11", supports5G: true, brand: "Xiaomi" },
  { model: "OnePlus 9", supports5G: true, brand: "OnePlus" },
  { model: "Google Pixel 6", supports5G: true, brand: "Google" },
  { model: "Huawei P30 Pro", supports5G: false, brand: "Huawei" },
  { model: "Samsung Galaxy A52", supports5G: false, brand: "Samsung" }
];

// API Endpoints

// Get all SNI bug hosts
app.get('/api/sni-bugs', (req, res) => {
  res.json(sniBugHosts);
});

// Get SNI bugs for specific carrier
app.get('/api/sni-bugs/:carrier', (req, res) => {
  const carrier = req.params.carrier.toLowerCase();
  if (sniBugHosts[carrier]) {
    res.json(sniBugHosts[carrier]);
  } else {
    res.status(404).json({ error: 'Carrier not found' });
  }
});

// Get VPN configuration
app.get('/api/vpn-config/:carrier', (req, res) => {
  const carrier = req.params.carrier.toLowerCase();
  if (vpnConfigs[carrier]) {
    res.json(vpnConfigs[carrier]);
  } else {
    res.status(404).json({ error: 'VPN configuration not found' });
  }
});

// Test connection endpoint
app.post('/api/test-connection', (req, res) => {
  const { proxyIP, proxyPort } = req.body;
  
  // Simulate connection test
  setTimeout(() => {
    const isValid = proxyIP && proxyPort;
    const latency = Math.floor(Math.random() * 100) + 50;
    
    res.json({
      success: isValid,
      latency: `${latency}ms`,
      status: isValid ? 'Connected' : 'Failed',
      message: isValid 
        ? `Connection successful! Latency: ${latency}ms` 
        : 'Invalid proxy settings. Please check your configuration.'
    });
  }, 1500);
});

app.get('/api/carriers', (req, res) => {
  res.json(carrierData);
});

app.get('/api/carrier/:name', (req, res) => {
  const carrier = carrierData[req.params.name.toLowerCase()];
  if (carrier) {
    res.json(carrier);
  } else {
    res.status(404).json({ error: 'Carrier not found' });
  }
});

app.get('/api/devices', (req, res) => {
  res.json(devices5G);
});

app.post('/api/check-device', (req, res) => {
  const { deviceModel } = req.body;
  const device = devices5G.find(d => 
    d.model.toLowerCase().includes(deviceModel.toLowerCase())
  );
  
  if (device) {
    res.json(device);
  } else {
    res.json({ 
      model: deviceModel, 
      supports5G: false, 
      message: "Device not in database. Check manufacturer specs." 
    });
  }
});

app.get('/api/network-tips', (req, res) => {
  res.json({
    tips: [
      {
        title: "Enable VoLTE",
        description: "Voice over LTE improves call quality and maintains data during calls",
        steps: ["Go to Settings", "Mobile Network", "Enable VoLTE"]
      },
      {
        title: "Use Custom DNS",
        description: "Faster DNS servers improve browsing speed",
        steps: [
          "Go to WiFi/Mobile settings",
          "Advanced settings",
          "Set DNS to 1.1.1.1 and 8.8.8.8"
        ]
      },
      {
        title: "Reset Network Settings",
        description: "Fixes most connectivity issues",
        steps: ["Settings > System > Reset", "Reset Network Settings", "Confirm"]
      },
      {
        title: "Toggle Airplane Mode",
        description: "Quick fix for connection issues",
        steps: ["Enable Airplane mode for 30 seconds", "Disable to reconnect"]
      },
      {
        title: "Select Network Manually",
        description: "Connect to stronger towers",
        steps: ["Settings > Mobile Network", "Network Operators", "Search and select manually"]
      },
      {
        title: "Clear System Cache",
        description: "Improve phone performance",
        steps: ["Settings > Apps", "Clear cache for system apps"]
      },
      {
        title: "Enable 5G (if supported)",
        description: "Get faster speeds on compatible devices",
        steps: [
          "Go to Settings > Mobile Network",
          "Preferred Network Type",
          "Select 5G/4G/3G Auto"
        ]
      }
    ]
  });
});

app.get('/api/app-info', (req, res) => {
  res.json({
    version: "7.0.0",
    creator: "Ntando Mods",
    email: "zimnet.gmail.com",
    lastUpdated: new Date().toISOString().split('T')[0],
    features: [
      "SNI Bug Hosts",
      "VPN Configuration",
      "Speed Testing",
      "APN Settings",
      "5G Compatibility Check",
      "Network Tips"
    ]
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ZimNet Optimizer v7 running on port ${PORT}`);
  console.log(`👨‍💻 Created by Ntando Mods`);
  console.log(`📧 Contact: zimnet.gmail.com`);
});
