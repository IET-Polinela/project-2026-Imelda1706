from rest_framework import viewsets, permissions
from django.db.models import Q

from .models import Report
from .serializers import ReportSerializer
from .permissions import IsOwnerAndDraftOrReadOnly


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Report.objects.none()

        if user.is_admin:
            return Report.objects.exclude(status='DRAFT').order_by('-created_at')

        return Report.objects.filter(
            Q(status__in=['REPORTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED']) |
            Q(reporter=user)
        ).order_by('-created_at')

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerAndDraftOrReadOnly()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)