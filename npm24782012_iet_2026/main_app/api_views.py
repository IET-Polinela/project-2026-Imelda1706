from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination

from .models import Report
from .serializers import ReportSerializer
from .permissions import IsOwnerAndDraftOrReadOnly


class ReportPagination(PageNumberPagination):
    page_size = 10


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    pagination_class = ReportPagination

    def get_queryset(self):

        user = self.request.user

        if not user.is_authenticated:
            return Report.objects.none()

        # DETAIL / EDIT / DELETE laporan milik sendiri
        if self.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy"
        ]:
            return Report.objects.filter(
                reporter=user
            )

        tab = self.request.query_params.get("tab")

        # Laporan Saya
        if tab == "my_reports":
            return Report.objects.filter(
                reporter=user
            ).order_by("-updated_at")

        # Feed Kota (draft tidak tampil)
        return Report.objects.exclude(
            status="DRAFT"
        ).order_by("-updated_at")

    def get_permissions(self):

        if self.action in [
            "update",
            "partial_update",
            "destroy"
        ]:
            return [
                permissions.IsAuthenticated(),
                IsOwnerAndDraftOrReadOnly()
            ]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(
            reporter=self.request.user
        )