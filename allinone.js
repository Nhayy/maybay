const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;
const REFRESH_INTERVAL = 3000;

app.use(cors());
app.use(express.json());

app.set('etag', false);
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

const API_SOURCES = {
  sunwinlivex88: { url: "https://sunwinsicbolive-p8to.onrender.com/x99", name: "SUNWIN SICBO LIVE (X88)" },
  sunwintaixiu: { url: "https://sunwintxnhahaha-b92i.onrender.com/api/taixiu/sunwin", name: "SUNWIN TAI XIU" },
  sunwinsicbo: { url: "https://sunwinsicboday-zj4k.onrender.com/predict", name: "SUNWIN SICBO" },
  b52sicbo: { url: "https://b52sicbophuonghoang-n1ho.onrender.com/predict", name: "B52 SICBO" },
  b52md5: { url: "https://b52banmd5-tcgc.onrender.com/api/taixiu", name: "B52 MD5" },
  hitclubhu: { url: "https://hitclubbanxanhnha-1qj0.onrender.com/api/taixiu", name: "HITCLUB BAN HU" },
  hitclubmd5: { url: "https://hitclubmd5nha-kknq.onrender.com/data", name: "HITCLUB MD5" },
  hitclubsicbo: { url: "https://hitclubsicbodaiphuquy-zu83.onrender.com/predict", name: "HITCLUB SICBO" },
  "789clubsicbo": { url: "https://seven89sicbobip-gy9m.onrender.com/predict", name: "789CLUB SICBO" },
  xocdia88: { url: "https://xocdia88donhahaha-y4k5.onrender.com/", name: "XOCDIA88" },
  sumclub: { url: "https://sumclubmd5donha-5qdx.onrender.com/", name: "SUMCLUB" },
  luckywinmd5: { url: "https://luckywinthantai-vgwq.onrender.com/api/taixiu/lottery", name: "LUCKYWIN MD5 (THAN TAI)" },
  lc79md5: { url: "https://laucua79md5-wyri.onrender.com", name: "LC79" },
  betvipmd5: { url: "https://betvipdayahaha.onrender.com/api/taixiu", name: "BETVIP MD5" },
  rikvipmd5: { url: "https://rikvipdaynha.onrender.com/dudoanvip", name: "RIKVIP MD5" }
};

let apiCache = {};
let lastUpdateTime = null;
let updateCount = 0;

async function fetchAPI(key, source) {
  try {
    const response = await axios.get(source.url, { timeout: 30000 });
    return {
      success: true,
      source: source.name,
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      source: source.name,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function refreshAllAPIs() {
  console.log(`[${new Date().toISOString()}] Dang cap nhat tat ca API...`);
  
  const promises = Object.entries(API_SOURCES).map(async ([key, source]) => {
    const result = await fetchAPI(key, source);
    apiCache[key] = result;
    return { key, success: result.success };
  });
  
  const results = await Promise.all(promises);
  lastUpdateTime = new Date().toISOString();
  updateCount++;
  
  const successCount = results.filter(r => r.success).length;
  console.log(`[${lastUpdateTime}] Cap nhat xong: ${successCount}/${results.length} API thanh cong (Lan thu ${updateCount})`);
}

async function startAutoRefresh() {
  await refreshAllAPIs();
  
  setInterval(async () => {
    await refreshAllAPIs();
  }, REFRESH_INTERVAL);
  
  console.log(`Auto-refresh da bat dau: Cap nhat moi ${REFRESH_INTERVAL/1000} giay`);
}

app.get('/', (req, res) => {
  const endpoints = Object.keys(API_SOURCES).map(key => `/${key}`);
  res.json({
    id: ["@ngphungggiahuyy", "@mryanhdz"],
    message: "API Aggregator - Tong hop cac API",
    auto_refresh: `Moi ${REFRESH_INTERVAL/1000} giay`,
    last_update: lastUpdateTime,
    update_count: updateCount,
    endpoints: endpoints,
    all_data: "/all"
  });
});

app.get('/sunwinlivex88', (req, res) => {
  res.json(apiCache.sunwinlivex88 || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/sunwintaixiu', (req, res) => {
  res.json(apiCache.sunwintaixiu || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/sunwinsicbo', (req, res) => {
  res.json(apiCache.sunwinsicbo || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/b52sicbo', (req, res) => {
  res.json(apiCache.b52sicbo || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/b52md5', (req, res) => {
  res.json(apiCache.b52md5 || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/hitclubhu', (req, res) => {
  res.json(apiCache.hitclubhu || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/hitclubmd5', (req, res) => {
  res.json(apiCache.hitclubmd5 || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/hitclubsicbo', (req, res) => {
  res.json(apiCache.hitclubsicbo || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/789clubsicbo', (req, res) => {
  res.json(apiCache["789clubsicbo"] || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/xocdia88', (req, res) => {
  res.json(apiCache.xocdia88 || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/sumclub', (req, res) => {
  res.json(apiCache.sumclub || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/luckywinmd5', (req, res) => {
  res.json(apiCache.luckywinmd5 || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/lc79md5', (req, res) => {
  res.json(apiCache.lc79md5 || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/betvipmd5', (req, res) => {
  res.json(apiCache.betvipmd5 || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/rikvipmd5', (req, res) => {
  res.json(apiCache.rikvipmd5 || { success: false, error: "Chua co du lieu, vui long doi..." });
});

app.get('/all', (req, res) => {
  const allData = Object.entries(apiCache).map(([key, value]) => ({
    endpoint: `/${key}`,
    ...value
  }));
  
  res.json({
    success: true,
    total: allData.length,
    last_update: lastUpdateTime,
    update_count: updateCount,
    auto_refresh: `Moi ${REFRESH_INTERVAL/1000} giay`,
    data: allData,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`API Aggregator running on port ${PORT}`);
  console.log('Available endpoints:');
  Object.keys(API_SOURCES).forEach(key => {
    console.log(`  - /${key}`);
  });
  console.log('  - /all (fetch all APIs)');
  console.log('');
  
  await startAutoRefresh();
});
