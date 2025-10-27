// firebaseLoginFunctions.js

/**
 * Validate email and password
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show error message on input
 */
export function showError(inputElement, message) {
  const inputBox = inputElement.closest('.input-box');
  const errorMessage = inputBox.querySelector('.error-message');

  inputBox.classList.add('error');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  inputElement.addEventListener('input', function removeError() {
    inputBox.classList.remove('error');
    errorMessage.style.display = 'none';
    inputElement.removeEventListener('input', removeError);
  });
}

/**
 * Toggle password visibility
 */
export function togglePasswordVisibility(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    toggle.classList.toggle('fa-eye');
    toggle.classList.toggle('fa-eye-slash');
  });
}
