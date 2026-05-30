from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.views import LoginView, LogoutView
from .forms import RegisterForm


# ================= REGISTER =================
def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)

            # role default (Citizen)
            user.is_admin = False
            user.is_member = True

            user.save()

            messages.success(request, "Registrasi berhasil! Silakan login.")
            return redirect('login')
        else:
            messages.error(request, "Registrasi gagal! Periksa kembali input.")
    else:
        form = RegisterForm()

    return render(request, 'register.html', {'form': form})


# ================= LOGIN =================
class CustomLoginView(LoginView):
    template_name = 'registration/login.html'

    def form_valid(self, form):
        messages.success(self.request, "Login berhasil!")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "Username atau password salah!")
        return super().form_invalid(form)


# ================= LOGOUT =================
class CustomLogoutView(LogoutView):
    def dispatch(self, request, *args, **kwargs):
        messages.success(request, "Berhasil logout!")
        return super().dispatch(request, *args, **kwargs)