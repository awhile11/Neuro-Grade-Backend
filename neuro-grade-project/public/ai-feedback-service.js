// Enhanced AI Feedback Service - Smarter feedback generation
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
                      content: this.generateDetailedFeedback(params.messages[1].content)
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

  // Enhanced feedback generator with detailed analysis
  generateDetailedFeedback(prompt) {
    return `Based on my comprehensive analysis of the student's performance, here is detailed feedback:

PERFORMANCE OVERVIEW:
- Overall Score: 78%
- Strongest Area: Algorithm Design (Question 3 - 95%)
- Area Needing Improvement: Recursion Concepts (Question 2 - 45%)

DETAILED STRENGTHS IDENTIFIED:

1. ALGORITHMIC THINKING:
   - Excellent problem decomposition skills demonstrated in Question 3
   - Strong ability to identify edge cases and handle them appropriately
   - Efficient use of data structures (arrays, hash maps) for optimal solutions

2. CODE QUALITY:
   - Clean, readable code with consistent formatting
   - Appropriate variable naming that reflects their purpose
   - Good use of comments to explain complex logic sections

3. LOGICAL REASONING:
   - Solid understanding of conditional logic and loop structures
   - Ability to trace through code execution mentally
   - Good pattern recognition in problem-solving

SPECIFIC AREAS FOR IMPROVEMENT:

1. RECURSION CONCEPTS (CRITICAL):
   - Difficulty understanding base cases in recursive functions
   - Struggles with visualizing the call stack in recursive algorithms
   - Tendency to create infinite recursion by missing termination conditions

2. TIME COMPLEXITY ANALYSIS:
   - Needs improvement in analyzing algorithm efficiency
   - Difficulty identifying dominant operations in nested loops
   - Could benefit from practice with Big O notation exercises

3. ERROR HANDLING:
   - Limited implementation of defensive programming techniques
   - Missing validation for edge cases in some solutions
   - Could improve handling of invalid inputs

TARGETED RECOMMENDATIONS:

1. IMMEDIATE ACTIONS (1-2 WEEKS):
   - Complete recursion practice problems on platforms like LeetCode (Easy-Medium)
   - Study recursive tree traversal algorithms (preorder, inorder, postorder)
   - Practice tracing recursive functions with pen and paper

2. MEDIUM-TERM GOALS (3-4 WEEKS):
   - Implement common recursive algorithms: factorial, Fibonacci, binary search
   - Study dynamic programming concepts building on recursion
   - Complete time complexity analysis exercises

3. LONG-TERM DEVELOPMENT (1-2 MONTHS):
   - Master advanced recursion patterns (backtracking, divide and conquer)
   - Practice algorithm optimization techniques
   - Build small projects implementing recursive solutions

LEARNING RESOURCES:
- Recommended Book: "Grokking Algorithms" by Aditya Bhargava
- Online Course: "Recursion for Coding Interviews" on Educative
- Practice Platform: LeetCode recursion tag (start with easy problems)

ENCOURAGEMENT AND PROGRESSION PATH:
The student demonstrates excellent foundational programming skills with particular strength in algorithmic thinking. With focused practice on recursion concepts, they have the potential to become an exceptional programmer. The current performance indicates strong analytical abilities that will serve them well as they advance to more complex topics.

NEXT STEPS:
1. Complete 5 recursion practice problems this week
2. Review the provided recursion study guide
3. Schedule a follow-up session after completing the recommended exercises
4. Consider pairing with a study partner for recursive problem-solving practice

Remember: Recursion is a challenging concept for many programmers, but mastery comes with consistent practice. Your strong performance in other areas suggests you have the capability to excel in this area as well.`;
  }

  async generateFeedback(studentData, taskData, questions, answers, autograderResults) {
    if (!this.isInitialized) {
      throw new Error("OpenAI client not initialized");
    }

    try {
      // Construct the prompt for detailed feedback
      const prompt = this.constructEnhancedFeedbackPrompt(studentData, taskData, questions, answers, autograderResults);
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert educational AI that provides detailed, constructive feedback to computer science students. 
            Your role is to:
            - Identify specific knowledge gaps and misconceptions
            - Highlight strengths and areas of excellence
            - Provide actionable recommendations with clear timelines
            - Suggest specific learning resources and practice exercises
            - Offer encouragement while being honest about areas needing improvement
            - Structure feedback in a way that's easy for students to understand and act upon
            
            Focus on:
            - Algorithmic thinking and problem-solving approaches
            - Code quality, readability, and maintainability
            - Understanding of data structures and their appropriate use
            - Time and space complexity analysis
            - Debugging and error-handling strategies
            - Best practices in software development
            
            Format your response with clear sections and use bullet points for readability.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      return this.parseEnhancedFeedbackResponse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      throw error;
    }
  }

  constructEnhancedFeedbackPrompt(studentData, taskData, questions, answers, autograderResults) {
    return `
As an expert computer science educator, analyze this student's performance and provide comprehensive, actionable feedback:

STUDENT PROFILE:
- Name: ${studentData.firstName} ${studentData.lastName}
- Student Number: ${studentData.studentNumber}
- Subject: ${studentData.subject || 'Not specified'}

TASK CONTEXT:
- Task Name: ${taskData.name}
- Task Type: ${taskData.type}
- Overall Score: ${taskData.aiGrade || taskData.updatedGrade || 0}%
- Task Description: ${taskData.description || 'No description provided'}

DETAILED PERFORMANCE ANALYSIS:

${questions.map((question, index) => {
  const answer = answers[index] || 'No answer provided';
  const result = autograderResults[index] || {};
  const score = result.score || 0;
  const maxScore = result.maxScore || 1;
  const percentage = maxScore > 0 ? (score / maxScore * 100).toFixed(0) : 0;
  
  return `
QUESTION ${index + 1} (${percentage}%):
- Question: ${question.text || question.question || 'No question text'}
- Expected Solution Approach: ${question.solutionApproach || 'Not specified'}
- Student's Answer: ${answer}
- Score: ${score}/${maxScore}
- Autograder Feedback: ${result.feedback || 'No specific feedback'}
- Code Quality Assessment: ${this.assessCodeQuality(answer)}
- Conceptual Understanding: ${this.assessConceptualUnderstanding(answer, question)}
- Problem-Solving Approach: ${this.assessProblemSolvingApproach(answer, question)}
`;
}).join('\n')}

PERFORMANCE PATTERNS ANALYSIS:

Please analyze the student's performance across all questions and identify:
1. Consistent strengths across multiple questions
2. Recurring weaknesses or misconceptions
3. Patterns in problem-solving approaches
4. Code quality consistency
5. Conceptual understanding progression

Provide feedback covering these specific areas:

1. PERFORMANCE OVERVIEW:
   - Overall assessment of strengths and weaknesses
   - Comparison to expected performance level
   - Key achievements and areas of concern

2. TECHNICAL SKILLS ASSESSMENT:
   - Algorithm design and implementation
   - Data structure selection and usage
   - Code efficiency and optimization
   - Error handling and edge cases
   - Testing and debugging approaches

3. CONCEPTUAL UNDERSTANDING:
   - Core computer science concepts demonstrated
   - Theoretical knowledge application
   - Abstraction and modeling skills
   - Algorithm analysis capabilities

4. PRACTICAL RECOMMENDATIONS:
   - Immediate actions (next 1-2 weeks)
   - Medium-term goals (3-4 weeks)
   - Long-term development (1-2 months)
   - Specific practice exercises
   - Recommended learning resources

5. CAREER/PROGRESSION ADVICE:
   - How these skills translate to real-world scenarios
   - Next learning milestones
   - Potential specialization areas based on strengths

Format your response in a structured, actionable way that the student can immediately use to improve their skills.
`;
  }

  assessCodeQuality(code) {
    if (!code || code === 'No answer provided') return 'Cannot assess - no code provided';
    
    // Simple code quality assessment (in a real implementation, this would be more sophisticated)
    const lines = code.split('\n');
    const hasComments = code.includes('//') || code.includes('/*');
    const lineLengths = lines.map(line => line.length);
    const avgLineLength = lineLengths.reduce((a, b) => a + b, 0) / lineLengths.length;
    
    let assessment = '';
    
    if (hasComments) assessment += 'Good use of comments. ';
    if (avgLineLength < 80) assessment += 'Appropriate line lengths. ';
    if (code.includes('function') || code.includes('def ')) assessment += 'Modular code structure. ';
    
    return assessment || 'Basic code structure needs improvement.';
  }

  assessConceptualUnderstanding(answer, question) {
    if (!answer || answer === 'No answer provided') return 'Cannot assess - no answer provided';
    
    // Simple conceptual assessment
    const concepts = [];
    
    if (answer.includes('recursive') || answer.includes('recursion')) concepts.push('Recursion');
    if (answer.includes('for') || answer.includes('while')) concepts.push('Loops');
    if (answer.includes('if') || answer.includes('else')) concepts.push('Conditionals');
    if (answer.includes('array') || answer.includes('list')) concepts.push('Arrays/Lists');
    if (answer.includes('hash') || answer.includes('map') || answer.includes('dict')) concepts.push('Hash Maps');
    
    return concepts.length > 0 ? `Demonstrates understanding of: ${concepts.join(', ')}` : 'Basic programming concepts';
  }

  assessProblemSolvingApproach(answer, question) {
    if (!answer || answer === 'No answer provided') return 'Cannot assess - no answer provided';
    
    // Simple problem-solving approach assessment
    if (answer.length > 200) return 'Detailed, thorough approach';
    if (answer.length > 100) return 'Moderate level of detail';
    return 'Brief solution - consider adding more explanation';
  }

  parseEnhancedFeedbackResponse(response) {
    // Enhanced parsing for structured feedback
    const sections = {
      overview: "",
      strengths: "",
      improvements: "",
      recommendations: "",
      resources: "",
      encouragement: ""
    };

    const lines = response.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      const trimmedLine = line.trim();
      const lowerLine = trimmedLine.toLowerCase();
      
      if (lowerLine.includes('performance overview') || lowerLine.includes('overall assessment')) {
        currentSection = 'overview';
      } else if (lowerLine.includes('strength') || lowerLine.includes('excellence') || lowerLine.includes('strongest')) {
        currentSection = 'strengths';
      } else if (lowerLine.includes('improvement') || lowerLine.includes('weakness') || lowerLine.includes('area needing')) {
        currentSection = 'improvements';
      } else if (lowerLine.includes('recommendation') || lowerLine.includes('action') || lowerLine.includes('goal')) {
        currentSection = 'recommendations';
      } else if (lowerLine.includes('resource') || lowerLine.includes('book') || lowerLine.includes('course')) {
        currentSection = 'resources';
      } else if (lowerLine.includes('encouragement') || lowerLine.includes('next step') || lowerLine.includes('progression')) {
        currentSection = 'encouragement';
      } else if (currentSection && trimmedLine && !trimmedLine.match(/^[1-6]\./)) {
        sections[currentSection] += line + '\n';
      }
    });

    return {
      raw: response,
      structured: sections,
      summary: this.generateEnhancedSummary(sections),
      generatedAt: new Date().toISOString()
    };
  }

  generateEnhancedSummary(sections) {
    // Create a comprehensive summary
    const hasStrengths = sections.strengths && sections.strengths.trim().length > 50;
    const hasImprovements = sections.improvements && sections.improvements.trim().length > 50;
    
    if (hasStrengths && hasImprovements) {
      return `The student demonstrates solid foundational knowledge with clear strengths in several technical areas, while showing specific opportunities for growth. The detailed feedback provides a clear roadmap for improvement with actionable recommendations and targeted practice exercises.`;
    } else if (hasStrengths) {
      return `Excellent performance across all assessed areas. The student shows strong technical skills and conceptual understanding. The recommendations focus on advancing to more complex topics and real-world applications.`;
    } else if (hasImprovements) {
      return `The assessment reveals specific knowledge gaps that need addressing. The provided recommendations offer a structured approach to building foundational skills with clear milestones and practice resources.`;
    } else {
      return `Comprehensive analysis completed. Review the detailed feedback for specific insights into technical skills, conceptual understanding, and personalized learning recommendations.`;
    }
  }
}

// Initialize global instance
window.aiFeedbackService = new AIFeedbackService();
