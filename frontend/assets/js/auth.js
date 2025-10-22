// NextSkill Authentication - Production Version
(function () {
  function qs(sel) { return document.querySelector(sel); }
  
  function showTab(which) {
    const signinTab = qs('#signin-tab');
    const signupTab = qs('#signup-tab');
    const signinForm = qs('#signin-form');
    const signupForm = qs('#signup-form');

    if (!signinTab || !signupTab || !signinForm || !signupForm) return;

    const isSignup = which === 'signup';
    signinTab.classList.toggle('active', !isSignup);
    signupTab.classList.toggle('active', isSignup);

    signinForm.classList.toggle('hidden', isSignup);
    signupForm.classList.toggle('hidden', !isSignup);
  }

  function currentFormFromQuery() {
    try {
      const params = new URLSearchParams(globalThis.location.search);
      const form = params.get('form');
      return form === 'signup' ? 'signup' : 'signin';
    } catch { return 'signin'; }
  }

  function showToast(message) {
    try {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-primary text-black px-4 py-2 rounded-lg z-50 transition-transform duration-300 transform translate-x-full';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } catch {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    console.log('[Auth] Production auth loaded');

    const signinTab = qs('#signin-tab');
    const signupTab = qs('#signup-tab');

    // Initial state from URL (?form=signup|signin)
    showTab(currentFormFromQuery());

    // Tab click handlers
    if (signinTab) signinTab.addEventListener('click', () => showTab('signin'));
    if (signupTab) signupTab.addEventListener('click', () => showTab('signup'));

    // Form submission handlers
    const signinForm = qs('#signin-form');
    const signupForm = qs('#signup-form');

    if (signinForm) {
      signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = qs('#signin-email')?.value;
        const password = qs('#signin-password')?.value;
        if (email && password) {
          handleAuth('signin', email, password);
        }
      });
    }

    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = qs('#signup-email')?.value;
        const password = qs('#signup-password')?.value;
        if (email && password) {
          handleAuth('signup', email, password);
        }
      });
    }
  });

  async function handleAuth(type, email, password) {
    // Buttons in the markup are `signin-btn` and `signup-btn`
    const submitBtn = qs(type === 'signin' ? '#signin-btn' : '#signup-btn');
    const errorBox = qs('#auth-error');
    
    if (submitBtn) {
      submitBtn.textContent = type === 'signin' ? 'Signing In...' : 'Creating Account...';
      submitBtn.disabled = true;
    }
    
    if (errorBox) errorBox.classList.add('hidden');

    try {
      const endpoint = type === 'signin' ? '/api/auth/signin' : '/api/auth/signup';

      // Prefer NSHttp if available (it wraps base URL + auth header), otherwise fall back to fetch
      let response;
      if (globalThis.NSHttp && typeof globalThis.NSHttp.request === 'function') {
        response = await globalThis.NSHttp.request(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
      } else {
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        // try to parse JSON but be resilient
        try { response = await r.json(); } catch { response = null; }
      }

      if (response?.token) {
        // Store token and user info
        localStorage.setItem('ns_token', response.token);
        localStorage.setItem('currentUser', JSON.stringify({ email }));
        
        showToast(`${type === 'signin' ? 'Signed in' : 'Account created'} successfully!`);
        
        // Redirect to questions
        setTimeout(() => globalThis.location.assign('questions.html'), 700);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('[Auth] Error:', error);

      const raw = String(error?.message ?? '').trim();
      const msg = raw.toLowerCase();
      let errorMessage = raw || 'Authentication failed. Please try again.';
      if (msg.includes('email already exists') || msg.includes('email already registered') || msg.includes('conflict')) {
        errorMessage = 'Email already exists. Please sign in instead.';
        // Switch to sign-in for convenience and prefill the email the user entered
        try {
          showTab('signin');
          const se = qs('#signin-email');
          if (se && email) se.value = email;
          const sp = qs('#signin-password');
          if (sp) sp.focus();
        } catch {}
      } else if (msg.includes('invalid credentials') || msg.includes('bad credentials') || msg.includes('401') || msg.includes('unauthorized')) {
        errorMessage = 'Invalid email or password.';
      } else if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('not loaded')) {
        errorMessage = raw || 'Network error. Please retry.';
      } 
      
      if (errorBox) {
        errorBox.textContent = errorMessage;
        errorBox.classList.remove('hidden');
      }
      
      showToast(errorMessage);
    } finally {
      if (submitBtn) {
        submitBtn.textContent = type === 'signin' ? 'Sign In' : 'Create Account';
        submitBtn.disabled = false;
      }
    }
  }
})();