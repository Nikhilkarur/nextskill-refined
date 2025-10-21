// UI utilities for enhanced interactions
(() => {
  // Toast notification system
  function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `alert ${type} fixed top-4 right-4 z-50 max-w-sm`;
    toast.textContent = message;
    toast.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Loading state manager
  function setLoading(element, loading = true) {
    if (loading) {
      element.classList.add('loading');
      element.disabled = true;
      element.setAttribute('aria-busy', 'true');
    } else {
      element.classList.remove('loading');
      element.disabled = false;
      element.removeAttribute('aria-busy');
    }
  }

  // Form validation
  function validateField(field, rules = {}) {
    const value = field.value.trim();
    const fieldContainer = field.closest('.field');
    const messageEl = fieldContainer?.querySelector('.field-message');
    
    let isValid = true;
    let message = '';

    if (rules.required && !value) {
      isValid = false;
      message = 'This field is required';
    } else if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    } else if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      message = `Must be at least ${rules.minLength} characters`;
    } else if (rules.pattern && value && !rules.pattern.test(value)) {
      isValid = false;
      message = rules.message || 'Invalid format';
    }

    // Update field state
    if (fieldContainer) {
      fieldContainer.classList.remove('error', 'success');
      fieldContainer.classList.add(isValid ? 'success' : 'error');
    }
    
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `field-message ${isValid ? 'success' : 'error'}`;
    }

    return isValid;
  }

  // Debounced function helper
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Smooth scroll to element
  function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Copy to clipboard with feedback
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success', 2000);
      return true;
    } catch {
      showToast('Failed to copy to clipboard', 'error');
      return false;
    }
  }

  // Progress indicator
  function updateProgress(percentage, container) {
    const progressBar = container.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    }
  }

  // Animate element entrance
  function animateIn(element, animationClass = 'fade-in') {
    element.classList.add(animationClass);
    element.addEventListener('animationend', () => {
      element.classList.remove(animationClass);
    }, { once: true });
  }

  // Focus management
  function focusFirstInput(container = document) {
    const firstInput = container.querySelector('input, select, textarea, button');
    if (firstInput) firstInput.focus();
  }

  // Error boundary for async operations
  async function withErrorHandling(asyncFn, errorMessage = 'An error occurred') {
    try {
      return await asyncFn();
    } catch (error) {
      console.error(error);
      showToast(errorMessage, 'error');
      throw error;
    }
  }

  globalThis.NSUI = {
    showToast,
    setLoading,
    validateField,
    debounce,
    scrollToElement,
    copyToClipboard,
    updateProgress,
    animateIn,
    focusFirstInput,
    withErrorHandling
  };
})();