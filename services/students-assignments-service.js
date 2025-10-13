import { getCurrentTeacher,saveSubject } from "./auth-service.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {app, auth, db} from "./firebase-init.js";
import { showErrorModal } from "./teacher-services.js";

// Mobile menu toggle functionality
  document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const viewAllBtn = document.getElementById('view-all-btn');
    const integrityPopup = document.getElementById('integrity-popup-overlay');
    const integrityCheckbox = document.getElementById('integrity-checkbox');
    const finalSubmitButton = document.getElementById('final-submit-button');
    const cancelButton = document.getElementById('cancel-button');
    const popupFileName = document.getElementById('popup-file-name');
    const popupFileInfo = document.getElementById('popup-file-info');

    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickInsideMenuToggle = menuToggle.contains(event.target);
      
      if (!isClickInsideSidebar && !isClickInsideMenuToggle && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    });
    
    // View All button functionality
    viewAllBtn.addEventListener('click', function() {
      alert('View All Assignments functionality would show all assignments in a dedicated page.');
    });
    
    // Integrity checkbox change
    integrityCheckbox.addEventListener('change', function() {
      finalSubmitButton.disabled = !this.checked;
    });
    
    // Cancel button in popup
    cancelButton.addEventListener('click', function() {
      integrityPopup.classList.remove('active');
    });
    
    // Final submit button
    finalSubmitButton.addEventListener('click', function() {
      // Show loading state
      finalSubmitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      finalSubmitButton.disabled = true;
      
      // Simulate submission process
      setTimeout(() => {
        alert('Assignment submitted successfully!');
        integrityPopup.classList.remove('active');
        finalSubmitButton.innerHTML = 'Submit Assignment';
        finalSubmitButton.disabled = false;
        integrityCheckbox.checked = false;
      }, 2000);
    });
    
    // File upload functionality
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFile = document.getElementById('remove-file');
    const uploadButton = document.getElementById('upload-button');
    const uploadProgress = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const uploadSuccess = document.getElementById('upload-success');
    
    let selectedFile = null;
    
    // Format file size
    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Get file icon based on type
    function getFileIcon(type) {
      if (type.includes('pdf')) return 'fa-file-pdf';
      if (type.includes('word') || type.includes('document')) return 'fa-file-word';
      if (type.includes('zip') || type.includes('compressed')) return 'fa-file-archive';
      if (type.includes('image')) return 'fa-file-image';
      return 'fa-file';
    }
    
    // Handle file selection
    function handleFileSelect(file) {
      if (file) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('File size exceeds 10MB limit. Please choose a smaller file.');
          return;
        }
        
        selectedFile = file;
        const fileIcon = getFileIcon(file.type);
        
        // Update preview
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        document.querySelector('.file-icon').className = `fas ${fileIcon} file-icon`;
        filePreview.classList.add('active');
        uploadButton.disabled = false;
        
        // Reset progress and success messages
        uploadProgress.classList.remove('active');
        uploadSuccess.classList.remove('active');
      }
    }
    
    // Click to select file
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });
    
    // Drag and drop events
    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('dragover');
      
      if (e.dataTransfer.files.length) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
    
    // File input change
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        handleFileSelect(fileInput.files[0]);
      }
    });
    
    // Remove selected file
    removeFile.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedFile = null;
      filePreview.classList.remove('active');
      uploadButton.disabled = true;
      fileInput.value = '';
    });
    
    // Upload button click
    uploadButton.addEventListener('click', () => {
      if (!selectedFile) return;
      
      // Simulate upload process
      uploadButton.disabled = true;
      uploadProgress.classList.add('active');
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Show success message
          setTimeout(() => {
            uploadProgress.classList.remove('active');
            uploadSuccess.classList.add('active');
            
            // Show integrity popup after upload
            setTimeout(() => {
              // Update popup with file info
              popupFileName.textContent = selectedFile.name;
              popupFileInfo.textContent = 'PDF Document • ' + formatFileSize(selectedFile.size);
              
              // Show the popup
              integrityPopup.classList.add('active');
            }, 1000);
          }, 500);
        }
        
        // Update progress bar
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Uploading... ${Math.round(progress)}%`;
      }, 200);
    });
    
    // Add button functionality for assignment cards
    const viewButtons = document.querySelectorAll('.view-button');
    const downloadButtons = document.querySelectorAll('.download-button');
    //to view the s
    viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const assignmentTitle = button.closest('.blue-card').querySelector('h3').textContent;
        alert(`View functionality would open: ${assignmentTitle}`);
      });
    });
    
    downloadButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const assignmentTitle = button.closest('.blue-card').querySelector('h3').textContent;
        alert(`Download functionality would start for: ${assignmentTitle}`);
      });
    });
    
    // Add some sample notifications
    setTimeout(() => {
      document.getElementById('mail-icon').querySelector('.icon-badge').textContent = '3';
      document.getElementById('notification-icon').querySelector('.icon-badge').textContent = '5';
    }, 1000);
  });
