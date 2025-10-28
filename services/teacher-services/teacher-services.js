    import { getCurrentTeacher } from "../auth-service.js";
import { auth, db,orderBy, onSnapshot, addDoc,doc, getDoc, serverTimestamp } from '../firebase-init.js';
import { getDocs, collection, query, where } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

    
    // teacher-services.js

    // Shared subjects array
    export let subjects = [];

    // Generate a random teacher ID
    export function generateTeacherId() {
      return Math.floor(10000 + Math.random() * 90000).toString();
    }
      console.log(generateTeacherId)
      console.log(Math)

    // Show success modal
    export function showSuccessModal(teacherId) {
      const teacherIdNumber = document.getElementById("teacherIdNumber");
      const successModal = document.getElementById("successModal");
      if (!teacherIdNumber || !successModal) return;

      teacherIdNumber.textContent = teacherId;
      successModal.style.display = "flex";
    }

    // Show error modal
    export function showErrorModal(message) {
      const modal = document.getElementById("errorModal");
      if (!modal) return;

      modal.querySelector(".modal-icon i").className = "fas fa-times-circle";
      modal.querySelector(".modal-icon").style.color = "red";
      modal.querySelector("h2").textContent = "Error!";
      modal.querySelector(".modal-message").textContent = message;

      const generatedTeacherId = document.getElementById("generatedTeacherId");
      if (generatedTeacherId) generatedTeacherId.style.display = "none";

      modal.style.display = "flex";
    }

    // Validate form
    export function validateForm() {
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const email = document.getElementById("email").value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (password !== confirmPassword) {
        showErrorModal("Passwords do not match");
        return false;
      }
      if (subjects.length === 0) {
        showErrorModal("Please add at least one subject you teach");
        return false;
      }
      if (!emailRegex.test(email)) {
        showErrorModal("Please enter a valid email address");
        return false;
      }

      const errorModal = document.getElementById("errorModal");
      const errorOkBtn = document.getElementById("errorOkBtn");
      if (errorOkBtn && errorModal) {
        errorOkBtn.addEventListener("click", function () {
          errorModal.style.display = "none";
        });
      }

      return true;
    }

    // DOM-dependent setup wrapped in a function
    export function initTeacherSubjects() {
      const subjectInput = document.getElementById("subject");
      const addSubjectBtn = document.getElementById("addSubject");
      const subjectList = document.getElementById("subjectList");
      const noSubjects = document.getElementById("noSubjects");

      if (!subjectInput || !addSubjectBtn || !subjectList || !noSubjects) return;

      function updateSubjectList() {
        if (subjects.length === 0) {
          noSubjects.style.display = "block";
          subjectList.innerHTML = "";
          return;
        }
        noSubjects.style.display = "none";
        subjectList.innerHTML = "";

        subjects.forEach((subject, index) => {
          const subjectItem = document.createElement("div");
          subjectItem.className = "subject-item";
          subjectItem.innerHTML = `
            <span>${subject}</span>
            <button type="button" class="remove-btn" data-index="${index}">
              <i class="fas fa-times"></i>
            </button>
          `;
          subjectList.appendChild(subjectItem);
        });

        subjectList.querySelectorAll(".remove-btn").forEach((button) => {
          button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            subjects.splice(index, 1);
            updateSubjectList();
          });
        });
      }

      function addSubject() {
        const subjectName = subjectInput.value.trim();
        if (!subjectName) return showErrorModal("Please enter a subject name");
        if (subjects.includes(subjectName)) return showErrorModal("This subject has already been added");

        subjects.push(subjectName);
        updateSubjectList();
        subjectInput.value = "";
        subjectInput.focus();
      }

      addSubjectBtn.addEventListener("click", addSubject);
      subjectInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addSubject();
        }
      });

      // Initialize list
      updateSubjectList();
    }

    // Display teacher profile information
   export async function displayTeacherProfile(subjectsContainerId = "subjects-container") {
    try {
      const teacher = await getCurrentTeacher();

      // Update top user info
      const topUserSpan = document.querySelector(".top-user span");
      if (topUserSpan) {
        topUserSpan.innerHTML = `<b>${teacher.firstName}</b><br><small>${teacher.email}</small>`;
      }

      // Update profile picture with initial if no profilePic
      const topUserImg = document.querySelector(".top-user img");
      if (topUserImg) {
        topUserImg.src = teacher.profilePic 
          ? teacher.profilePic 
          : `https://placehold.co/35x35/8e44ad/FFFFFF?text=${encodeURIComponent(teacher.firstName ? teacher.firstName.charAt(0).toUpperCase() : "U")}`;
      }

      // Update welcome box
      const welcomeH1 = document.querySelector(".welcome-box h1");
      if (welcomeH1) {
        welcomeH1.textContent = `WELCOME BACK, ${teacher.firstName.toUpperCase()} ${teacher.lastName.toUpperCase()}!`;
      }

      return teacher;
    } catch (err) {
      console.error("Error displaying teacher profile:", err);
      return null;
    }
}

// Fetch subjects for a teacher
export async function fetchSubjects(teacherDocId) {
  try {
    if (!teacherDocId || typeof teacherDocId !== "string") {
      throw new Error("Invalid teacherDocId: must be a string");
    }

    const teacherRef = doc(db, "teachers", teacherDocId);
    const teacherSnap = await getDoc(teacherRef);

    if (!teacherSnap.exists()) {
      console.warn("Teacher document not found!");
      return [];
    }

    const data = teacherSnap.data();
    const subjects = data.subjects || [];

    return subjects.map((subj, index) => ({
      id: index + 1,
      name: subj,
    }));

  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}
export async function addSubject(teacherDocId, subjectName) {
  const teacherRef = doc(db, "teachers", teacherDocId);
  await updateDoc(teacherRef, {
    subjects: arrayUnion(subjectName)
  });
}

// messaging functions
export async function sendMessage(senderId, receiverId, text) {
  try {
    if (!text.trim()) {
      throw new Error('Message cannot be empty');
    }

    const messageData = {
      senderId,
      receiverId,
      text: text.trim(),
      timestamp: serverTimestamp(),
      read: false
    };

    const docRef = await addDoc(collection(db, 'messages'), messageData);
    console.log('Message sent successfully! ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Listen for messages between two users
export function listenMessages(currentUserId, chatUserId, callback) {
  if (!currentUserId || !chatUserId) {
    console.error('User IDs are required for listening to messages');
    return () => {}; // Return empty unsubscribe function
  }

  const q = query(
    collection(db, 'messages'),
    where('senderId', 'in', [currentUserId, chatUserId]),
    where('receiverId', 'in', [currentUserId, chatUserId]),
    orderBy('timestamp', 'asc')
  );

  const unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to Date
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      
      console.log("Fetched messages:", messages.length);
      callback(messages);
    },
    (error) => {
      console.error("Error listening to messages:", error);
    }
  );

  return unsubscribe; // Return unsubscribe function
}

// Get all conversations for a user
export function listenUserConversations(userId, callback) {
  const q = query(
    collection(db, 'messages'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTimestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(conversations);
  });
}
// Enhanced notification functions
export async function sendNotification(userId, message, type = 'info', link = null) {
  try {
    if (!userId || !message) {
      throw new Error('User ID and message are required');
    }

    const notificationData = {
      userId,
      message: message.trim(),
      type, // 'info', 'warning', 'success', 'error'
      link,
      read: false,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    console.log('Notification sent! ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

// Enhanced notification listener with UI updates
export function listenAndRenderNotifications(currentUserId) {
  const container = document.querySelector("#notification-popup .popup-content");
  const badge = document.querySelector("#notification-icon .icon-badge");
  
  console.log("Setting up notification listener for user:", currentUserId);
  
  if (!container) {
    console.error("Notification container not found");
    return () => {};
  }

  if (!currentUserId) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>User not authenticated</p>
        <p>Please log in to see notifications</p>
      </div>
    `;
    return () => {};
  }

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', currentUserId),
    orderBy('timestamp', 'desc')
  );

  const unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      
      console.log("Fetched notifications:", notifications.length);
      renderNotifications(notifications, container, badge);
    },
    (error) => {
      console.error("Error listening to notifications:", error);
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error loading notifications</p>
          <p>Please try again later</p>
        </div>
      `;
    }
  );

  return unsubscribe;
}

// Render notifications in the UI
function renderNotifications(notifications, container, badge) {
  if (!notifications || notifications.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="far fa-bell-slash"></i>
        <p>No notifications yet</p>
        <p>You're all caught up!</p>
      </div>
    `;
    
    if (badge) {
      badge.textContent = '0';
      badge.style.display = 'none';
    }
    return;
  }

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Update badge
  if (badge) {
    badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }

  // Render notifications list
  container.innerHTML = `
    <div class="notifications-header">
      <span>You have ${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}</span>
      ${unreadCount > 0 ? `<button class="mark-all-read-btn">Mark all as read</button>` : ''}
    </div>
    <div class="notifications-list">
      ${notifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
          <div class="notification-icon ${getNotificationIcon(notification.type)}">
            <i class="${getNotificationIconClass(notification.type)}"></i>
          </div>
          <div class="notification-content">
            <p class="notification-message">${notification.message}</p>
            <small class="notification-time">${formatTimeAgo(notification.timestamp)}</small>
          </div>
          ${!notification.read ? '<div class="notification-dot"></div>' : ''}
        </div>
      `).join('')}
    </div>
  `;

  // Add event listeners
  const markAllReadBtn = container.querySelector('.mark-all-read-btn');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => markAllNotificationsAsRead(notifications.map(n => n.id)));
  }

  container.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => {
      const notificationId = item.dataset.id;
      markNotificationAsRead(notificationId);
      
      // Handle notification click (e.g., navigate to link)
      const notification = notifications.find(n => n.id === notificationId);
      if (notification.link) {
        window.location.href = notification.link;
      }
    });
  });
}

// Helper functions for notifications
function getNotificationIcon(type) {
  const icons = {
    info: 'info',
    warning: 'warning',
    success: 'success',
    error: 'error'
  };
  return icons[type] || 'info';
}

function getNotificationIconClass(type) {
  const iconClasses = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    success: 'fas fa-check-circle',
    error: 'fas fa-times-circle'
  };
  return iconClasses[type] || 'fas fa-info-circle';
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return timestamp.toLocaleDateString();
}

// Mark notification as read
export async function markNotificationAsRead(notificationId) {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(notificationIds) {
  try {
    const batch = writeBatch(db);
    
    notificationIds.forEach(id => {
      const notificationRef = doc(db, 'notifications', id);
      batch.update(notificationRef, { read: true });
    });
    
    await batch.commit();
    console.log('All notifications marked as read');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
}
    // Automatically initialize subjects UI on DOM load
    document.addEventListener("DOMContentLoaded", initTeacherSubjects);
