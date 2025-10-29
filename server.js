const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

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

// Huawei 5G compatible devices
const huaweiDevices = [
  { model: "Huawei P40 Pro", supports5G: true },
  { model: "Huawei P40 Pro+", supports5G: true },
  { model: "Huawei Mate 40 Pro", supports5G: true },
  { model: "Huawei Mate 40", supports5G: true },
  { model: "Huawei P50 Pro", supports5G: false },
  { model: "Huawei Nova 9", supports5G: false },
  { model: "Huawei Y9a", supports5G: false },
  { model: "Huawei Mate 30 Pro", supports5G: true },
  { model: "Huawei P30 Pro", supports5G: false }
];

// API Endpoints
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
  res.json(huaweiDevices);
});

app.post('/api/check-device', (req, res) => {
  const { deviceModel } = req.body;
  const device = huaweiDevices.find(d => 
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
        title: "Clear Cache",
        description: "Improve phone performance",
        steps: ["Settings > Apps", "Clear cache for system apps"]
      }
    ]
  });
});

app.get('/api/speed-test-servers', (req, res) => {
  res.json({
    servers: [
      { name: "Econet Server", url: "econet.co.zw" },
      { name: "NetOne Server", url: "netone.co.zw" },
      { name: "Google", url: "google.com" },
      { name: "Cloudflare", url: "cloudflare.com" }
    ]
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ZimNet Optimizer running on port ${PORT}`);
});
