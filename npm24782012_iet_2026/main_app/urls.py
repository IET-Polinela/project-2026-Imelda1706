from django.urls import path
from .views import *

urlpatterns = [
    # HOME
    path('', HomeView.as_view(), name='home'),

    # REPORTS
    path('reports/', ReportListView.as_view(), name='report_list'),
    path('detail/<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    path('add/', ReportCreateView.as_view(), name='add_report'),
    path('update/<int:pk>/', ReportUpdateView.as_view(), name='update_report'),
    path('delete/<int:pk>/', ReportDeleteView.as_view(), name='delete_report'),
    path('reports/search/', ReportSearchView.as_view(), name='report_search'),
    path('reports/detail-json/<int:pk>/', ReportDetailJsonView.as_view(), name='report_detail_json'),

    # STATUS
    path('update-status/<int:pk>/', ReportUpdateStatusView.as_view(), name='update_status'),
]