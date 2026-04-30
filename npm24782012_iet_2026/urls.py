from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # main app
    path('', include('main_app.urls')),

    # static pages
    path('about/', include('about.urls')),
    path('contacts/', include('contacts.urls')),

    # usermanagement
    path('', include('usermanagement_24782012.urls')),
    path('', include('dashboard_24782012.urls')),
]