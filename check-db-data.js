// Script to check database via backend API
const http = require('http');
const https = require('https');

const API_BASE = 'https://nextskill-refined3.onrender.com';

async function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${endpoint}`;
    console.log(`🔍 Checking: ${url}`);
    
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout - service might be sleeping'));
    }, 60000); // 60 second timeout for sleeping services
    
    https.get(url, (res) => {
      clearTimeout(timeout);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } else {
            resolve({ error: `HTTP ${res.statusCode}`, body: data });
          }
        } catch (e) {
          resolve({ error: 'Parse error', body: data });
        }
      });
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

async function checkBackendData() {
  console.log('🚀 Checking backend data via API...');
  console.log('⏰ Note: Free tier backend may be sleeping - waking up...\n');
  
  // Try to wake up the service with a simple request
  try {
    console.log('🌟 Waking up Render service...');
    await makeRequest('/');
    console.log('✅ Service is awake!\n');
  } catch (error) {
    console.log('⚠️  Service might be starting up, continuing...\n');
  }
  
  // Check health
  try {
    const health = await makeRequest('/actuator/health');
    console.log('📊 Health:', health);
  } catch (error) {
    console.log('📊 Health check failed:', error.message);
  }
  
  // Check user dashboard endpoints that should have data
  const testEndpoints = [
    '/', // Root endpoint
    '/api/dashboard/nikhil@example.com', // Try your email
    '/api/dashboard/test@example.com', // Try test email
  ];
  
  for (const endpoint of testEndpoints) {
    try {
      const result = await makeRequest(endpoint);
      console.log(`\n📋 ${endpoint}:`, result);
    } catch (error) {
      console.log(`\n❌ ${endpoint}: ${error.message}`);
    }
  }
}

checkBackendData();