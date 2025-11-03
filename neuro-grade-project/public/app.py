from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
openai.api_key = os.getenv('OPENAI_API_KEY', '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')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/generate-feedback', methods=['POST'])
def generate_feedback():
    try:
        start_time = datetime.now()
        data = request.get_json()
        
        if not data:
            return jsonify({"success": False, "error": "No JSON data provided"}), 400
        
        student_data = data.get('student_data', {})
        task_data = data.get('task_data', {})
        questions = data.get('questions', [])
        answers = data.get('answers', [])
        autograder_results = data.get('autograder_results', [])
        
        logger.info(f"Generating feedback for student: {student_data.get('firstName', 'Unknown')}")
        
        # Enhanced prompt construction
        prompt = construct_enhanced_prompt(student_data, task_data, questions, answers, autograder_results)
        
        # Call OpenAI API with enhanced parameters
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert computer science educator with 15+ years of experience teaching programming and software engineering. Your role is to provide detailed, constructive, and actionable feedback that helps students grow.

KEY RESPONSIBILITIES:
1. Identify specific technical strengths and weaknesses
2. Analyze problem-solving approaches and algorithmic thinking
3. Assess code quality, readability, and best practices
4. Provide concrete recommendations with timelines
5. Suggest specific learning resources and practice exercises
6. Offer encouragement while being honest about improvement areas

FOCUS AREAS:
- Algorithm design and efficiency
- Data structure selection and usage
- Code organization and maintainability
- Debugging and error handling strategies
- Time and space complexity analysis
- Software engineering best practices

FORMAT REQUIREMENTS:
- Use clear sections with headings
- Provide specific examples from the student's work
- Include actionable items with deadlines
- Recommend specific resources (books, courses, practice platforms)
- Be encouraging but honest"""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=2500,
            temperature=0.7,
            top_p=0.9
        )
        
        feedback_text = response.choices[0].message.content
        structured_feedback = parse_enhanced_feedback_response(feedback_text)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        logger.info(f"Feedback generated successfully in {processing_time:.2f} seconds")
        
        return jsonify({
            'success': True,
            'feedback': structured_feedback,
            'processing_time': processing_time,
            'model_used': 'gpt-4'
        })
        
    except openai.error.OpenAIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"OpenAI API error: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Internal server error: {str(e)}"
        }), 500

def construct_enhanced_prompt(student_data, task_data, questions, answers, autograder_results):
    # Build a comprehensive performance summary
    total_score = 0
    total_max_score = 0
    question_analysis = []
    
    for i, (question, answer, result) in enumerate(zip(questions, answers, autograder_results)):
        score = result.get('score', 0) if result else 0
        max_score = result.get('maxScore', 1) if result else 1
        percentage = (score / max_score * 100) if max_score > 0 else 0
        
        total_score += score
        total_max_score += max_score
        
        question_analysis.append({
            'number': i + 1,
            'score': score,
            'max_score': max_score,
            'percentage': percentage,
            'question': question.get('text', question.get('question', '')),
            'answer': answer or 'No answer provided',
            'feedback': result.get('feedback', '') if result else ''
        })
    
    overall_percentage = (total_score / total_max_score * 100) if total_max_score > 0 else 0
    
    prompt = f"""
COMPREHENSIVE STUDENT PERFORMANCE ANALYSIS REQUEST

STUDENT INFORMATION:
- Name: {student_data.get('firstName', '')} {student_data.get('lastName', '')}
- Student ID: {student_data.get('studentNumber', 'N/A')}
- Subject: {student_data.get('subject', 'Not specified')}

ASSIGNMENT CONTEXT:
- Task: {task_data.get('name', 'Unnamed Task')}
- Type: {task_data.get('type', 'Assignment')}
- Overall Score: {overall_percentage:.1f}% ({total_score}/{total_max_score})
- Description: {task_data.get('description', 'No description provided')}

DETAILED QUESTION-BY-QUESTION ANALYSIS:
"""
    
    for qa in question_analysis:
        prompt += f"""
QUESTION {qa['number']} ({qa['percentage']:.1f}%):
▸ Question: {qa['question']}
▸ Student's Answer: {qa['answer']}
▸ Score: {qa['score']}/{qa['max_score']}
▸ Autograder Feedback: {qa['feedback'] or 'No specific feedback provided'}
"""
    
    prompt += """

REQUESTED ANALYSIS SECTIONS:

1. EXECUTIVE SUMMARY
   - Overall performance assessment
   - Key strengths demonstrated
   - Critical areas needing improvement
   - Learning trajectory assessment

2. TECHNICAL SKILLS BREAKDOWN
   - Algorithmic thinking and problem-solving
   - Code quality and organization
   - Data structure proficiency
   - Efficiency and optimization awareness
   - Error handling and edge cases

3. CONCEPTUAL UNDERSTANDING
   - Core computer science concepts mastery
   - Theoretical knowledge application
   - Abstraction and modeling capabilities
   - Pattern recognition skills

4. ACTIONABLE IMPROVEMENT PLAN
   - Immediate priorities (next 7 days)
   - Short-term goals (2-4 weeks)
   - Medium-term development (1-2 months)
   - Long-term growth areas (3-6 months)

5. TARGETED LEARNING PATH
   - Specific practice exercises
   - Recommended projects
   - Study resources (books, courses, platforms)
   - Skill-building activities

6. CAREER/PROFESSIONAL DEVELOPMENT
   - Relevant real-world applications
   - Industry best practices to focus on
   - Potential specialization areas
   - Next learning milestones

Please provide detailed, specific, and actionable feedback that the student can immediately use to improve their programming skills.
"""
    
    return prompt

def parse_enhanced_feedback_response(response):
    # Enhanced parsing for better structure
    sections = {
        'executive_summary': "",
        'technical_skills': "",
        'conceptual_understanding': "",
        'improvement_plan': "",
        'learning_path': "",
        'career_development': ""
    }
    
    current_section = None
    lines = response.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        lower_line = line.lower()
        
        # Section detection
        if 'executive summary' in lower_line or 'overall performance' in lower_line:
            current_section = 'executive_summary'
        elif 'technical skills' in lower_line or 'technical breakdown' in lower_line:
            current_section = 'technical_skills'
        elif 'conceptual understanding' in lower_line or 'conceptual mastery' in lower_line:
            current_section = 'conceptual_understanding'
        elif 'improvement plan' in lower_line or 'actionable plan' in lower_line:
            current_section = 'improvement_plan'
        elif 'learning path' in lower_line or 'targeted learning' in lower_line:
            current_section = 'learning_path'
        elif 'career development' in lower_line or 'professional development' in lower_line:
            current_section = 'career_development'
        elif current_section and line and not line.startswith(('#', '===', '---')):
            sections[current_section] += line + '\n'
    
    return {
        'raw': response,
        'structured': sections,
        'summary': sections.get('executive_summary', '')[:500] + '...' if sections.get('executive_summary') else 'Analysis completed. Review detailed feedback sections.',
        'generated_at': datetime.now().isoformat(),
        'version': '2.0'
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
