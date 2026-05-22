from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from usermanagement_24782012.api_views import RegisterView

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

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/register/', RegisterView.as_view(), name='api_register'),
]