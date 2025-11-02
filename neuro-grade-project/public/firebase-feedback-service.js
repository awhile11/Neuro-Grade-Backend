// Firebase Service for storing and retrieving AI feedback
class FirebaseFeedbackService {
  constructor() {
    this.db = window.firebaseDb;
    this.functions = window.firebaseFunctions;
    this.initialized = false;
    this.initialize();
  }

  initialize() {
    if (window.firebaseDb && window.firebaseFunctions) {
      this.initialized = true;
      console.log("Firebase Feedback Service initialized");
    } else {
      console.warn("Firebase not available yet, will retry initialization");
      setTimeout(() => this.initialize(), 1000);
    }
  }

  async saveAIFeedback(studentId, taskId, taskType, feedbackData) {
    if (!this.initialized) {
      throw new Error("Firebase Feedback Service not initialized");
    }

    try {
      const feedbackDoc = {
        studentId: studentId,
        taskId: taskId,
        taskType: taskType,
        feedback: feedbackData,
        generatedAt: this.functions.serverTimestamp(),
        teacherId: window.currentUser?.uid,
        collectionKey: "NmXzaV6FkkE3koeUI3Ix"
      };

      const docRef = await this.functions.addDoc(
        this.functions.collection(this.db, "ai_feedback"),
        feedbackDoc
      );

      console.log("AI feedback saved with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving AI feedback:", error);
      throw error;
    }
  }

  async getAIFeedback(studentId, taskId) {
    if (!this.initialized) {
      throw new Error("Firebase Feedback Service not initialized");
    }

    try {
      const feedbackQuery = this.functions.query(
        this.functions.collection(this.db, "ai_feedback"),
        this.functions.where("studentId", "==", studentId),
        this.functions.where("taskId", "==", taskId),
        this.functions.orderBy("generatedAt", "desc")
      );

      const querySnapshot = await this.functions.getDocs(feedbackQuery);
      
      if (!querySnapshot.empty) {
        const latestFeedback = querySnapshot.docs[0];
        return {
          id: latestFeedback.id,
          ...latestFeedback.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error retrieving AI feedback:", error);
      throw error;
    }
  }

  async getStudentAIFeedback(studentId) {
    if (!this.initialized) {
      throw new Error("Firebase Feedback Service not initialized");
    }

    try {
      const feedbackQuery = this.functions.query(
        this.functions.collection(this.db, "ai_feedback"),
        this.functions.where("studentId", "==", studentId),
        this.functions.orderBy("generatedAt", "desc")
      );

      const querySnapshot = await this.functions.getDocs(feedbackQuery);
      const feedbackList = [];
      
      querySnapshot.forEach(doc => {
        feedbackList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return feedbackList;
    } catch (error) {
      console.error("Error retrieving student AI feedback:", error);
      throw error;
    }
  }

  async updateAIFeedback(feedbackId, updates) {
    if (!this.initialized) {
      throw new Error("Firebase Feedback Service not initialized");
    }

    try {
      const feedbackRef = this.functions.doc(this.db, "ai_feedback", feedbackId);
      await this.functions.updateDoc(feedbackRef, {
        ...updates,
        lastUpdated: this.functions.serverTimestamp()
      });

      console.log("AI feedback updated:", feedbackId);
      return true;
    } catch (error) {
      console.error("Error updating AI feedback:", error);
      throw error;
    }
  }

  async deleteAIFeedback(feedbackId) {
    if (!this.initialized) {
      throw new Error("Firebase Feedback Service not initialized");
    }

    try {
      // Note: You might want to use soft delete in production
      const feedbackRef = this.functions.doc(this.db, "ai_feedback", feedbackId);
      await this.functions.deleteDoc(feedbackRef);

      console.log("AI feedback deleted:", feedbackId);
      return true;
    } catch (error) {
      console.error("Error deleting AI feedback:", error);
      throw error;
    }
  }
}

// Initialize global instance
window.firebaseFeedbackService = new FirebaseFeedbackService();