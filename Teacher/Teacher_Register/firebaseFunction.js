// firebaseFunctions.js

// 🔹 Generate a random 5-digit teacher ID
export function generateTeacherId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// 🔹 Validate form inputs
export function validateForm(password, confirmPassword, email, subjects) {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return false;
  }
  if (subjects.length === 0) {
    alert("Please add at least one subject you teach");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return false;
  }
  return true;
}

// 🔹 Update subject list on UI
export function updateSubjectList(subjects, subjectList, noSubjects) {
  if (subjects.length === 0) {
    noSubjects.style.display = "block";
    subjectList.innerHTML = "";
    return;
  }

  noSubjects.style.display = "none";
  subjectList.innerHTML = "";

  subjects.forEach((subject, index) => {
    const item = document.createElement("div");
    item.className = "subject-item";
    item.innerHTML = `
      <span>${subject}</span>
      <button type="button" class="remove-btn" data-index="${index}">
        <i class="fas fa-times"></i>
      </button>
    `;
    subjectList.appendChild(item);
  });
}

// 🔹 Show success modal
export function showSuccessModal(modal, teacherIdNumber, teacherId) {
  teacherIdNumber.textContent = teacherId;
  modal.style.display = "flex";
}

