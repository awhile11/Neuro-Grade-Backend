export function showSuccessModal(teacherId) {
        teacherIdNumber.textContent = teacherId;
        successModal.style.display = 'flex';
      }
export function showErrorModal(message) {
        const modal = document.getElementById("errorModal"); // reuse success modal
        modal.querySelector(".modal-icon i").className = "fas fa-times-circle";
        modal.querySelector(".modal-icon").style.color = "red";
        modal.querySelector("h2").textContent = "Error!";
        modal.querySelector(".modal-message").textContent = message;
        //document.getElementById("generatedTeacherId").style.display = "none";
        modal.style.display = "flex";
}
function validateForm() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value;
        
        if (password !== confirmPassword) {
          showErrorModal('Passwords do not match');
          return false;
        }
        
        if (subjects.length === 0) {
          showErrorModal('Please add at least one subject you teach');
          return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showErrorModal('Please enter a valid email address');
          return false;
        }
        
        return true;
      }