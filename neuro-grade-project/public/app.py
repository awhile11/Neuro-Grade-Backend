from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenAI
openai.api_key = "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"

# Initialize Firebase
try:
    # For production, use service account key file
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully")
except:
    print("Firebase initialization failed - using mock mode")
    db = None

@app.route('/')
def home():
    return jsonify({"message": "NeuroGrade AI Feedback API", "status": "running"})

@app.route('/api/generate-feedback', methods=['POST'])
def generate_feedback():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"success": False, "error": "No JSON data provided"}), 400
        
        student_data = data.get('student_data', {})
        task_data = data.get('task_data', {})
        questions = data.get('questions', [])
        answers = data.get('answers', [])
        autograder_results = data.get('autograder_results', [])
        
        # Construct prompt
        prompt = construct_feedback_prompt(student_data, task_data, questions, answers, autograder_results)
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert educational AI that provides detailed, constructive feedback to learners. 
                    Your role is to identify knowledge gaps, misconceptions, and areas for improvement while being encouraging and specific.
                    Always provide actionable recommendations and highlight strengths."""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        feedback_text = response.choices[0].message.content
        structured_feedback = parse_feedback_response(feedback_text)
        
        # Save to Firebase if available
        feedback_id = None
        if db:
            feedback_data = {
                'student_id': student_data.get('id'),
                'task_id': task_data.get('id'),
                'task_type': task_data.get('type'),
                'feedback': structured_feedback,
                'generated_at': firestore.SERVER_TIMESTAMP,
                'collection_key': "NmXzaV6FkkE3koeUI3Ix"
            }
            
            doc_ref = db.collection('ai_feedback').add(feedback_data)
            feedback_id = doc_ref[1].id
        
        return jsonify({
            'success': True,
            'feedback_id': feedback_id,
            'feedback': structured_feedback
        })
        
    except Exception as e:
        print(f"Error generating feedback: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/feedback/<student_id>/<task_id>', methods=['GET'])
def get_feedback(student_id, task_id):
    try:
        if not db:
            return jsonify({"success": False, "error": "Firebase not available"}), 500
            
        # Query for the latest feedback for this student and task
        feedback_ref = db.collection('ai_feedback')
        query = feedback_ref.where('student_id', '==', student_id)\
                           .where('task_id', '==', task_id)\
                           .order_by('generated_at', direction=firestore.Query.DESCENDING)\
                           .limit(1)
        
        docs = query.stream()
        
        feedback_list = []
        for doc in docs:
            feedback_data = doc.to_dict()
            feedback_data['id'] = doc.id
            feedback_list.append(feedback_data)
        
        if feedback_list:
            return jsonify({
                'success': True,
                'feedback': feedback_list[0]
            })
        else:
            return jsonify({
                'success': True,
                'feedback': None
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/feedback/student/<student_id>', methods=['GET'])
def get_student_feedback(student_id):
    try:
        if not db:
            return jsonify({"success": False, "error": "Firebase not available"}), 500
            
        feedback_ref = db.collection('ai_feedback')
        query = feedback_ref.where('student_id', '==', student_id)\
                           .order_by('generated_at', direction=firestore.Query.DESCENDING)
        
        docs = query.stream()
        
        feedback_list = []
        for doc in docs:
            feedback_data = doc.to_dict()
            feedback_data['id'] = doc.id
            feedback_list.append(feedback_data)
        
        return jsonify({
            'success': True,
            'feedback': feedback_list
        })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def construct_feedback_prompt(student_data, task_data, questions, answers, autograder_results):
    prompt = f"""
As an educational expert, analyze this student's performance and provide detailed feedback:

STUDENT INFORMATION:
- Name: {student_data.get('firstName', '')} {student_data.get('lastName', '')}
- Student Number: {student_data.get('studentNumber', '')}

TASK INFORMATION:
- Task Name: {task_data.get('name', '')}
- Task Type: {task_data.get('type', '')}
- Overall Score: {task_data.get('aiGrade', task_data.get('updatedGrade', 0))}%

QUESTIONS AND ANSWERS ANALYSIS:
"""
    
    for i in range(len(questions)):
        question = questions[i] if i < len(questions) else {}
        answer = answers[i] if i < len(answers) else 'No answer provided'
        result = autograder_results[i] if i < len(autograder_results) else {}
        
        prompt += f"""
QUESTION {i+1}:
- Question: {question.get('text', question.get('question', 'No question text'))}
- Student's Answer: {answer}
- Autograder Result: {f"Score: {result.get('score', 0)}/{result.get('maxScore', 1)}" if result else 'No result'}
- Autograder Feedback: {result.get('feedback', 'No specific feedback')}
"""
    
    prompt += """
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
"""
    
    return prompt

def parse_feedback_response(response):
    sections = {
        'strengths': '',
        'improvements': '',
        'recommendations': '',
        'encouragement': ''
    }
    
    current_section = ''
    lines = response.split('\n')
    
    for line in lines:
        lower_line = line.lower().strip()
        
        if 'strengths' in lower_line or 'strength' in lower_line or 'what went well' in lower_line:
            current_section = 'strengths'
        elif 'improvement' in lower_line or 'areas to improve' in lower_line or 'weakness' in lower_line:
            current_section = 'improvements'
        elif 'recommendation' in lower_line or 'suggestion' in lower_line or 'advice' in lower_line:
            current_section = 'recommendations'
        elif 'encouragement' in lower_line or 'next steps' in lower_line or 'conclusion' in lower_line:
            current_section = 'encouragement'
        elif current_section and line.strip() and not line.strip().startswith(('1.', '2.', '3.', '4.')):
            sections[current_section] += line + '\n'
    
    # Generate summary
    summary = generate_summary(sections)
    
    return {
        'raw': response,
        'structured': sections,
        'summary': summary
    }

def generate_summary(sections):
    has_strengths = bool(sections['strengths'] and sections['strengths'].strip())
    has_improvements = bool(sections['improvements'] and sections['improvements'].strip())
    
    if has_strengths and has_improvements:
        return "Based on your performance, you have demonstrated solid understanding in several areas while showing opportunities for growth in others. Focus on the specific recommendations to enhance your learning outcomes."
    elif has_strengths:
        return "Excellent work! You've demonstrated strong understanding across all areas. Continue building on these strengths with more challenging exercises."
    elif has_improvements:
        return "Your performance indicates some areas needing attention. Follow the detailed recommendations to strengthen your understanding and skills."
    else:
        return "Comprehensive analysis of your performance reveals insights into your learning progress. Review the detailed feedback for specific guidance."

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)