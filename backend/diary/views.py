from rest_framework import viewsets
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer


class AdminCredentialPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method == "OPTIONS":
            return True

        username = request.headers.get("X-Admin-Username")
        password = request.headers.get("X-Admin-Password")

        return username == "learneradmin" and password == "admin@890"

class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all().order_by('-date')
    serializer_class = DiaryEntrySerializer
    permission_classes = [AdminCredentialPermission]
