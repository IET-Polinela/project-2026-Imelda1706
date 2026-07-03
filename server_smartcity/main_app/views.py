from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.urls import reverse_lazy
from .models import Report
from django.views import View
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied

# ======================
# ADMIN REQUIRED
# ======================
class AdminRequiredMixin(LoginRequiredMixin):
    login_url = 'login'

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "Silakan login terlebih dahulu.")
            return self.handle_no_permission()

        if not request.user.is_admin:
            messages.error(request, "Akses ditolak. Hanya admin yang dapat melakukan aksi ini.")
            return redirect('report_list')

        return super().dispatch(request, *args, **kwargs)


# ======================
# HOME (HALAMAN AWAL)
# ======================
class HomeView(TemplateView):
    template_name = 'main_app/home.html'


# ======================
# REPORT LIST
# ======================
class ReportListView(AdminRequiredMixin, ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'

    def get_queryset(self):
        return Report.objects.exclude(
            status='DRAFT'
        ).order_by('-created_at')

# ======================
# DETAIL
# ======================
class ReportDetailView(AdminRequiredMixin, DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'


# ======================
# CREATE
# ======================
class ReportCreateView(AdminRequiredMixin, CreateView):
    model = Report
    fields = ['title', 'category', 'description', 'location']
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil ditambahkan!")
        return super().form_valid(form)


# ======================
# UPDATE
# ======================
class ReportUpdateView(AdminRequiredMixin, UpdateView):
    model = Report
    fields = ['title', 'category', 'description', 'location']
    template_name = 'main_app/update_report.html'
    success_url = reverse_lazy('report_list')

    def get(self, request, *args, **kwargs):
        raise PermissionDenied

    def post(self, request, *args, **kwargs):
        raise PermissionDenied

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil diperbarui!")
        return super().form_valid(form)


# ======================
# DELETE
# ======================
class ReportDeleteView(AdminRequiredMixin, DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def get(self, request, *args, **kwargs):
        raise PermissionDenied

    def post(self, request, *args, **kwargs):
        raise PermissionDenied

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil dihapus!")
        return super().form_valid(form)


# ======================
# UPDATE STATUS
# ======================
class ReportUpdateStatusView(AdminRequiredMixin, View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        report.status = request.POST.get('status')
        report.save()

        messages.success(request, "Status laporan berhasil diubah!")
        return redirect('report_list')

# =====================
# Live Search dan Modal 
# =====================
class ReportSearchView(View):
    def get(self, request):

        if (
            not request.user.is_authenticated
            or not request.user.is_admin
        ):
            return JsonResponse(
                {"error": "Akses ditolak"},
                status=403,
            )

        keyword = request.GET.get('q', '')

        reports = Report.objects.all().order_by('-created_at')

        if keyword:
            reports = reports.filter(title__icontains=keyword)

        data = []

        for report in reports:
            data.append({
                'id': report.id,
                'title': report.title,
                'category': report.category,
                'location': report.location,
                'status': report.status,
            })

        return JsonResponse({'reports': data})


class ReportDetailJsonView(View):
    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)

        data = {
            'id': report.id,
            'title': report.title,
            'category': report.category,
            'description': report.description,
            'location': report.location,
            'status': report.status,
            'created_at': report.created_at.strftime('%d %B %Y %H:%M'),
        }

        return JsonResponse(data)
    
def report_detail_api(request, pk):
        report = get_object_or_404(Report, pk=pk)

        return JsonResponse({
            'id': report.id,
            'title': report.title,
            'category': report.category,
            'description': report.description,
            'location': report.location,
            'status': report.status,
        })