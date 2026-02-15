from django.db import models
import uuid

class DiaryEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField(unique=True)
    work_summary = models.TextField(max_length=5000)
    hours_worked = models.CharField(max_length=5000) # Using CharField as per plan, though integer/float might be better but string offers flexibility
    show_your_work = models.TextField(max_length=5000, blank=True)
    learnings = models.TextField(max_length=5000, blank=True)
    blockers = models.TextField(max_length=5000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Diary Entry for {self.date}"
