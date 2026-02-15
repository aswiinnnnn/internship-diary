from django.contrib import admin
from .models import DiaryEntry

@admin.register(DiaryEntry)
class DiaryEntryAdmin(admin.ModelAdmin):
    list_display = ('date', 'work_summary', 'hours_worked', 'created_at')
    list_filter = ('date',)
    search_fields = ('work_summary', 'learnings')
