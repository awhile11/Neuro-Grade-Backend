import { getCurrentTeacher,saveSubject } from "../auth-service.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {app, auth, db,functions} from "../firebase-init.js";
import { displayTeacherProfile,showErrorModal,sendMessage,fetchSubjects  } from "./teacher-services.js";

//
document.addEventListener("DOMContentLoaded", async () => {
    await displayTeacherProfile();
    const teacher = await getCurrentTeacher();
    const students = await fetchStudentData();
    
    document.getElementById('class-average').textContent = 'Loading...';
    document.getElementById('students-count').textContent = 'Fetching data from database...';
    const teacherUID = localStorage.getItem("teacherUID"); // Get teacher UID from localStorage
    const subjects = await fetchSubjects(teacher.uid);
    console.log("Teacher data:", teacher);
            if (!teacherUID) return alert("Teacher not logged in!");
    // Update the display with the fetched data
    updateClassAverage(students, null);
    renderSubjects(subjects);
// Listen for messages
if (teacher) {
    // Initialize notifications
    const unsubscribeNotifications = listenAndRenderNotifications(teacher.uid);
    
    // Initialize messaging (you might want to trigger this when opening a chat)
    // const unsubscribeMessages = listenMessages(teacher.uid, otherUserId, (messages) => {
    //   renderMessages(messages, teacher.uid);
    // });
    
    // Store unsubscribe functions for cleanup
    window.appUnsubscribers = {
      notifications: unsubscribeNotifications,
      // messages: unsubscribeMessages
    };
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (window.appUnsubscribers) {
      Object.values(window.appUnsubscribers).forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') unsubscribe();
      });
    }
  });

});
// Example: 
 // Function to update the class average display
  function updateClassAverage(students, previousAverage) {
    const average = calculateClassAverage(students);
    const averageElement = document.getElementById('class-average');
    const studentsCountElement = document.getElementById('students-count');
    const averageChangeElement = document.getElementById('average-change');
    
    averageElement.textContent = `${average}%`;
    studentsCountElement.textContent = `Calculated from ${students.length} students`;
    
    // Calculate and display change
    const changeData = calculateAverageChange(parseFloat(average), previousAverage);
    if (changeData.direction === 'increased') {
      averageChangeElement.innerHTML = `<i class="fas fa-arrow-up"></i> increased by ${changeData.change}% from last week`;
      averageChangeElement.style.color = '#28a745';
    } else if (changeData.direction === 'decreased') {
      averageChangeElement.innerHTML = `<i class="fas fa-arrow-down"></i> decreased by ${changeData.change}% from last week`;
      averageChangeElement.style.color = '#dc3545';
    } else {
      averageChangeElement.innerHTML = `No change from last week`;
      averageChangeElement.style.color = '#6c757d';
    }
    
    // Add animation effect
    averageElement.style.transition = 'all 0.5s ease';
    averageElement.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
      averageElement.style.transform = 'scale(1)';
    }, 500);
    
    return parseFloat(average);
  }

  // Function to fetch student data from your database
  async function fetchStudentData() {
    try {
      // REPLACE THIS WITH YOUR DATABASE CONNECTION CODE
      // Example using fetch API:
      /*
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const students = await response.json();
      return students;
      */
      
      // For now, return empty array - you will connect this to your actual database
      return [];
      
    } catch (error) {
      console.error('Error fetching student data:', error);
      return [];
    }
  }

  // Function to render subjects in the UI
  function renderSubjects(subjects) {
  const container = document.getElementById('subjects-container');
  
  if (!subjects || subjects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book-open"></i>
        <p>No subjects yet</p>
        <p>Click "Add Subject" to create your first subject</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = subjects.map(subject => `
    <div class="subject-item" data-id="${subject.id}">
      <div class="subject-info">
        <h3>${subject.name}</h3>
        <p>${subject.year}</p>
      </div>
      <div class="subject-actions">
        <button class="edit-btn" data-id="${subject.id}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="view-btn" data-id="${subject.id}">
          <i class="fas fa-eye"></i> View
        </button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const subjectId = e.target.closest('.edit-btn').dataset.id;
      const subject = subjects.find(s => s.id == subjectId);
      if (subject) openSubjectPopup(subject);
    });
  });
}

  // Function to open subject popup for adding/editing
  function openSubjectPopup(subject = null) {
    const popup = document.getElementById('subject-popup');
    const title = document.getElementById('subject-popup-title');
    const nameInput = document.getElementById('subject-name');
    const yearSelect = document.getElementById('subject-year');
    
    if (subject) {
      // Editing existing subject
      title.textContent = 'Edit Subject';
      nameInput.value = subject.name;
      yearSelect.value = subject.year;
      popup.setAttribute('data-edit-id', subject.id);
    } else {
      // Adding new subject
      title.textContent = 'Add Subject';
      nameInput.value = '';
      yearSelect.value = '';
      popup.removeAttribute('data-edit-id');
    }
    
    showPopup(popup);
  }

  // Function to save subject (add or update)
  const saveBtn = document.getElementById('save-subject');
saveBtn.addEventListener('click', async () => {
  const subjectName = document.getElementById('subject-name').value.trim();
  const subjectYear = document.getElementById('subject-year').value;

  if (!subjectName || !subjectYear) {
    alert('Please fill in all fields!');
    return;
  }

  const subjectData = {
    name: subjectName,
    year: subjectYear,
    teacherId: getCurrentTeacher.teacherId, // make sure you have currentTeacher object
  };

  try {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    const savedSubject = await saveSubject(subjectData);

    // Update the UI
    addSubjectToUI(savedSubject);

    // Close popup
    closePopup('subject-popup');
  } catch (err) {
    console.error('Failed to save subject:', err.message);
    alert('Failed to save subject.');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  }
});

//   async function saveSubject(subjectData) {
//     try {
//       // REPLACE THIS WITH YOUR DATABASE CONNECTION CODE
//       // Example using fetch API:
//       /*
//       const url = subjectData.id ? `/api/subjects/${subjectData.id}` : '/api/subjects';
//       const method = subjectData.id ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(subjectData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
      
//       return await response.json();
//       */
      
//       // For demonstration, simulate a successful save
//       console.log('Subject saved:', subjectData);
//       return { success: true, message: 'Subject saved successfully' };
      
//     } catch (error) {
//       console.error('Error saving subject:', error);
//       return { success: false, message: 'Error saving subject' };
//     }
//   }

  // Function to refresh data from the database
  async function refreshData() {
    const refreshBtn = document.getElementById('refresh-btn');
    const originalText = refreshBtn.innerHTML;
    
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Loading...';
    refreshBtn.disabled = true;
    
    try {
      // Get the current average before updating
      const currentAverage = parseFloat(document.getElementById('class-average').textContent);
      
      // Update the display with new data
      const newAverage = updateClassAverage(students, isNaN(currentAverage) ? null : currentAverage);
      renderSubjects(subjects);
      
      // Show success message
      alert(`Data refreshed successfully! Loaded ${students.length} student records and ${subjects.length} subjects from the database.`);
      
      return newAverage;
    } catch (error) {
      alert('Error refreshing data. Please try again.');
      console.error('Refresh error:', error);
      return null;
    } finally {
      // Restore button state
      refreshBtn.innerHTML = originalText;
      refreshBtn.disabled = false;
    }
  }

  // Menu interactivity
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const navButtons = document.querySelectorAll(".nav button");
  const overlay = document.getElementById('overlay');

  // Toggle sidebar on mobile
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
  });

  // Close sidebar when clicking on overlay
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.style.display = 'none';
  });

  // Sidebar active highlight
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all buttons
      navButtons.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Get the page name from data attribute
      const page = btn.getAttribute('data-page');
      
      // Here you would typically load the appropriate page content
      console.log(`Loading page: ${page}`);
      
      // Close sidebar on mobile after selection
      if (window.innerWidth <= 992) {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
      }
    });
  });

  // Popup functionality
  const mailIcon = document.getElementById('mail-icon');
  const notificationIcon = document.getElementById('notification-icon');
  const mailPopup = document.getElementById('mail-popup');
  const notificationPopup = document.getElementById('notification-popup');
  const subjectPopup = document.getElementById('subject-popup');
  const closeButtons = document.querySelectorAll('.popup-close');
  const refreshBtn = document.getElementById('refresh-btn');
  const addSubjectBtn = document.getElementById('add-subject-btn');
  const cancelSubjectBtn = document.getElementById('cancel-subject');
  const saveSubjectBtn = document.getElementById('save-subject');

  function showPopup(popup) {
    popup.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function hidePopups() {
    document.querySelectorAll('.popup').forEach(popup => {
      popup.style.display = 'none';
    });
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
function renderMessages(messages, currentUserId) {
  const container = document.getElementById('messages-container');
  if (!container) return;
  
  container.innerHTML = messages.map(message => `
    <div class="message-item ${message.senderId === currentUserId ? 'message-sent' : 'message-received'}">
      ${message.senderId !== currentUserId ? 
        `<div class="message-sender">${getUserName(message.senderId)}</div>` : ''}
      <p class="message-text">${message.text}</p>
      <div class="message-time">${formatTimeAgo(message.timestamp)}</div>
    </div>
  `).join('');
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Helper function to get user name (you'll need to implement this based on your user structure)
async function getUserName(userId) {
  // Implement based on your user data structure
  return 'User';
}
  mailIcon.addEventListener('click', (e) => {
    e.preventDefault();
    showPopup(mailPopup);
  });

  notificationIcon.addEventListener('click', (e) => {
    e.preventDefault();
    showPopup(notificationPopup);
  });

  addSubjectBtn.addEventListener('click', () => {
    openSubjectPopup();
  });

  cancelSubjectBtn.addEventListener('click', hidePopups);

  saveSubjectBtn.addEventListener('click', async () => {
    const name = document.getElementById('subject-name').value;
    const year = document.getElementById('subject-year').value;
    const editId = subjectPopup.getAttribute('data-edit-id');
    
    if (!name || !year) {
      alert('Please fill in all fields');
      return;
    }
    
    const subjectData = { name, year };
    if (editId) {
      subjectData.id = editId;
    }
    
    const result = await saveSubject(subjectData);
    
    if (result.success) {
      alert(result.message);
      hidePopups();
      // Refresh the subjects list
      const subjects = await fetchSubjects(teacher.docId);
      renderSubjects(subjects);
    } else {
      alert(result.message);
    }
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', hidePopups);
  });

  // Refresh button event
  refreshBtn.addEventListener('click', refreshData);

  // Close popup when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hidePopups();
      sidebar.classList.remove('active');
    }
  });


