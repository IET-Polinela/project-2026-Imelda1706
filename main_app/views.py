from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.urls import reverse_lazy
from .models import Report
from django.views import View
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin


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
class ReportListView(ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'


# ======================
# DETAIL
# ======================
class ReportDetailView(DetailView):
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