from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),

    # main app
    path('', include('main_app.urls')),

    # static pages
    path('about/', include('about.urls')),
    path('contacts/', include('contacts.urls')),

    path('login/', LoginView.as_view(
        template_name='registration/login.html'
    ), name='login'),

    path('logout/', LogoutView.as_view(
        next_page='login'
    ), name='logout'),

    path('', include('usermanagement_24782012.urls')),
    path('', include('dashboard_24782012.urls')),

    path('api/', include('main_app.api_urls')),
]