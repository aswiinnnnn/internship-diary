from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.response import Response
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer


class AdminCredentialPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method == "OPTIONS":
            return True

        username = request.headers.get("X-Admin-Username")
        password = request.headers.get("X-Admin-Password")

        return username == "learneradmin" and password == "admin@890"


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    # Public ping endpoint used by external cron services to keep the app warm.
    return Response({"status": "ok"})

class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all().order_by('-date')
    serializer_class = DiaryEntrySerializer
    permission_classes = [AdminCredentialPermission]
