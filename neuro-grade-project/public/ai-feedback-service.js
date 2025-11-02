// AI Feedback Service - Handles OpenAI integration and feedback generation
class AIFeedbackService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.initializeOpenAI();
  }

  initializeOpenAI() {
    try {
      // Using the provided API key
      // Note: In production, this should be handled via backend for security
      this.client = {
        chat: {
          completions: {
            create: async (params) => {
              // Mock implementation - replace with actual OpenAI API call
              console.log("OpenAI API call with params:", params);
              
              // Simulate API response
              return {
                choices: [
                  {
                    message: {
                      content: this.generateMockFeedback(params.messages[1].content)
                    }
                  }
                ]
              };
            }
          }
        }
      };
      
      this.isInitialized = true;
      console.log("OpenAI client initialized (mock mode)");
    } catch (error) {
      console.error("Failed to initialize OpenAI client:", error);
      this.isInitialized = false;
    }
  }

  // Mock feedback generator - replace with actual OpenAI API call
  generateMockFeedback(prompt) {
    return `Based on my analysis of the student's performance, here is detailed feedback:

STRENGTHS IDENTIFIED:
- The student demonstrated solid understanding of basic programming concepts
- Good problem-solving approach in questions 1 and 3
- Clear and logical thinking in algorithm design

AREAS FOR IMPROVEMENT:
- Need to improve understanding of recursion concepts (evident in question 2)
- Should practice more on data structure implementations
- Time complexity analysis needs more attention

SPECIFIC RECOMMENDATIONS:
1. Practice recursive problem-solving with exercises on factorial, Fibonacci series
2. Study binary tree traversal algorithms and their implementations
3. Work on understanding Big O notation for algorithm analysis
4. Complete coding challenges on platforms like LeetCode for array manipulation

ENCOURAGEMENT AND NEXT STEPS:
The student shows great potential and with focused practice on the identified areas, significant improvement is expected. Keep up the good work and continue practicing regularly.`;
  }

  async generateFeedback(studentData, taskData, questions, answers, autograderResults) {
    if (!this.isInitialized) {
      throw new Error("OpenAI client not initialized");
    }

    try {
      // Construct the prompt for detailed feedback
      const prompt = this.constructFeedbackPrompt(studentData, taskData, questions, answers, autograderResults);
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert educational AI that provides detailed, constructive feedback to learners. 
            Your role is to identify knowledge gaps, misconceptions, and areas for improvement while being encouraging and specific.
            Always provide actionable recommendations and highlight strengths.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      });

      return this.parseFeedbackResponse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      throw error;
    }
  }

  constructFeedbackPrompt(studentData, taskData, questions, answers, autograderResults) {
    return `
As an educational expert, analyze this student's performance and provide detailed feedback:

STUDENT INFORMATION:
- Name: ${studentData.firstName} ${studentData.lastName}
- Student Number: ${studentData.studentNumber}

TASK INFORMATION:
- Task Name: ${taskData.name}
- Task Type: ${taskData.type}
- Overall Score: ${taskData.aiGrade || taskData.updatedGrade || 0}%

QUESTIONS AND ANSWERS ANALYSIS:

${questions.map((question, index) => `
QUESTION ${index + 1}:
- Question: ${question.text || question.question || 'No question text'}
- Student's Answer: ${answers[index] || 'No answer provided'}
- Autograder Result: ${autograderResults[index] ? `Score: ${autograderResults[index].score}/${autograderResults[index].maxScore}` : 'No result'}
- Autograder Feedback: ${autograderResults[index]?.feedback || 'No specific feedback'}
`).join('\n')}

Please provide comprehensive feedback covering:

1. STRENGTHS IDENTIFIED:
   - What concepts did the student demonstrate understanding of?
   - Which answers were particularly well-reasoned?

2. AREAS FOR IMPROVEMENT:
   - Specific knowledge gaps or misconceptions
   - Common patterns in incorrect answers
   - Conceptual misunderstandings

3. SPECIFIC RECOMMENDATIONS:
   - Study suggestions for each weak area
   - Practice exercises or resources
   - Learning strategies tailored to their performance

4. ENCOURAGEMENT AND NEXT STEPS:
   - Positive reinforcement
   - Clear action plan for improvement

Format your response in a structured way that can be easily displayed to the student.
`;
  }

  parseFeedbackResponse(response) {
    // Parse the AI response into structured feedback
    const sections = {
      strengths: "",
      improvements: "",
      recommendations: "",
      encouragement: ""
    };

    const lines = response.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('strengths') || lowerLine.includes('strength') || lowerLine.includes('what went well')) {
        currentSection = 'strengths';
      } else if (lowerLine.includes('improvement') || lowerLine.includes('areas to improve') || lowerLine.includes('weakness')) {
        currentSection = 'improvements';
      } else if (lowerLine.includes('recommendation') || lowerLine.includes('suggestion') || lowerLine.includes('advice')) {
        currentSection = 'recommendations';
      } else if (lowerLine.includes('encouragement') || lowerLine.includes('next steps') || lowerLine.includes('conclusion')) {
        currentSection = 'encouragement';
      } else if (currentSection && line.trim() && !line.match(/^[1-4]\./)) {
        sections[currentSection] += line + '\n';
      }
    });

    return {
      raw: response,
      structured: sections,
      summary: this.generateSummary(sections)
    };
  }

  generateSummary(sections) {
    // Create a brief summary of the feedback
    const hasStrengths = sections.strengths && sections.strengths.trim().length > 0;
    const hasImprovements = sections.improvements && sections.improvements.trim().length > 0;
    
    if (hasStrengths && hasImprovements) {
      return `Based on your performance, you have demonstrated solid understanding in several areas while showing opportunities for growth in others. Focus on the specific recommendations to enhance your learning outcomes.`;
    } else if (hasStrengths) {
      return `Excellent work! You've demonstrated strong understanding across all areas. Continue building on these strengths with more challenging exercises.`;
    } else if (hasImprovements) {
      return `Your performance indicates some areas needing attention. Follow the detailed recommendations to strengthen your understanding and skills.`;
    } else {
      return `Comprehensive analysis of your performance reveals insights into your learning progress. Review the detailed feedback for specific guidance.`;
    }
  }
}

// Initialize global instance
window.aiFeedbackService = new AIFeedbackService();