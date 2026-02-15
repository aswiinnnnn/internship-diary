from rest_framework import viewsets
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer

class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all().order_by('-date')
    serializer_class = DiaryEntrySerializer
