// Production configuration for deployed frontend
// Sets API_BASE to empty string for proxy mode (Netlify/Vercel rewrites)
// Include this script BEFORE assets/js/http.js in deployed pages

window.NS_CONFIG = {
  // Empty string means use relative URLs (/api/...) which get proxied
  API_BASE: ''
};

// Alternative for direct backend calls (no proxy):
// window.NS_CONFIG = {
//   API_BASE: 'https://your-backend-name.onrender.com'
// };