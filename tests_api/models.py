# tests_api/models.py
from django.db import models

class Test(models.Model):
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    questions = models.JSONField()  # Store questions as JSON
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
