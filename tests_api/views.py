import torch
from django.http import JsonResponse
from rest_framework.decorators import api_view
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_PATH = r"C:/Users/KALI-KHAN/Neuro-Grade/Neuro-Grade-Backend/models/flan-t5-small"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)
model.eval()

@api_view(['POST'])
def generate_test(request):
    # Endpoint to generate test questions based on input criteria
    try:
        data = request.data

        count = data.get("count")
        if not isinstance(count, int) or count <= 0:
            return JsonResponse({"error": "count is invalid"}, status=400)
    # Validate and extract input parameters
        difficulty = data.get("difficulty")
        topic = data.get("topic")
        types = data.get("types")

        # Create prompt dynamically from frontend input
        type_str = ", ".join(types) if isinstance(types, list) else str(types)
        prompt = f"Generate {count} questions of difficulty '{difficulty}' and type(s) '{type_str}' on '{topic}'."
# Tokenize and generate output
        inputs = tokenizer(prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = model.generate(**inputs, max_new_tokens=150*count)

        question_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # Split output into individual questions if possible
        questions = [{"content": q.strip()} for q in question_text.split("\n") if q.strip()]

        return JsonResponse({"questions": questions})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
