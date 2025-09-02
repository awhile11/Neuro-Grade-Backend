    const container = document.getElementById('container');
    const teacherBtn = document.querySelector('.teacher-btn');
    const studentBtn = document.querySelector('.student-btn');
    const studentForm = document.getElementById('studentForm');
    const teacherForm = document.getElementById('teacherForm');

    // Toggle between student and teacher login
    teacherBtn.addEventListener('click', () => {
      container.classList.add('active');
    });

    studentBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });

    // Form validation
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function showError(inputElement, message) {
      const inputBox = inputElement.closest('.input-box');
      const errorMessage = inputBox.querySelector('.error-message');
      
      inputBox.classList.add('error');
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
      
      // Remove error after user starts typing
      inputElement.addEventListener('input', function removeError() {
        inputBox.classList.remove('error');
        errorMessage.style.display = 'none';
        inputElement.removeEventListener('input', removeError);
      });
    }

    // Student form submission
    studentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const studentNumber = document.getElementById('studentNumber').value;
      const password = document.getElementById('studentPassword').value;

      if (!studentNumber.trim()) {
        showError(document.getElementById('studentNumber'), 'Student number is required');
        return;
      }

      if (!password.trim()) {
        showError(document.getElementById('studentPassword'), 'Password is required');
        return;
      }

      // Here you would typically send the data to your server
      console.log('Student login:', { studentNumber, password });
      alert('Student login successful! (This is a demo)');
    });

    // Teacher form submission
    teacherForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('teacherEmail').value;
      const password = document.getElementById('teacherPassword').value;

      if (!email.trim()) {
        showError(document.getElementById('teacherEmail'), 'Email is required');
        return;
      }

      if (!validateEmail(email)) {
        showError(document.getElementById('teacherEmail'), 'Please enter a valid email address');
        return;
      }

      if (!password.trim()) {
        showError(document.getElementById('teacherPassword'), 'Password is required');
        return;
      }

      // Here you would typically send the data to your server
      console.log('Teacher login:', { email, password });
      alert('Teacher login successful! (This is a demo)');
    });

    // Add smooth focus effects
    document.querySelectorAll('.input-box input').forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
      });
    });