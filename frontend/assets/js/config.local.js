// Local development configuration
// This overrides any production config for local testing

window.NS_CONFIG = {
  // Point to local backend for development
  API_BASE: 'http://127.0.0.1:8080'
};

console.log('🔧 Local config loaded - API calls will go to:', window.NS_CONFIG.API_BASE);