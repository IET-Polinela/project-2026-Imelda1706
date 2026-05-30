const routes = {

  login: `
    <section class="row justify-content-center mt-5">

      <div class="col-12 col-md-6 col-lg-4 card shadow-sm border-0 p-4">

        <h3 class="text-center fw-bold mb-4 welcome-title">
          <i class="bi bi-buildings-fill me-2"></i>
          Raccoon City
        </h3>

        <form id="login-form">

          <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" id="loginUsername" class="form-control" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" id="loginPassword" class="form-control" required>
          </div>

          <button type="submit" class="btn btn-pink w-100 fw-bold">
            <i class="bi bi-box-arrow-in-right me-2"></i>
            Login
          </button>

        </form>

      </div>

    </section>
  `,

  dashboard: `
    <section class="row g-4">

      <!-- MENU -->
      <aside class="col-12 col-lg-3">

        <div class="card p-3">

          <h5 class="fw-bold">
            <i class="bi bi-clipboard-data-fill me-2"></i>
            Menu Laporan
          </h5>

          <button class="btn btn-pink w-100 mt-3">
            <i class="bi bi-plus-circle-fill me-2"></i>
            Buat Laporan Baru
          </button>

        </div>

      </aside>

      <!-- CONTENT -->
      <section class="col-12 col-lg-6">

        <div class="card p-4 text-center">

          <h3 class="fw-bold welcome-title">
            Selamat Datang,
          </h3>

          <h4 class="mb-3">
            ${localStorage.getItem("username") || "Warga Raccoon"}
          </h4>

          <p class="text-muted">
            Portal Citizen Raccoon City digunakan untuk
            mengelola laporan masyarakat secara cepat,
            transparan, dan terintegrasi.
          </p>

          <div class="soft-box mt-3">

            <i class="bi bi-shield-check fs-2"></i>

            <h5 class="mt-2">
              Sistem Aktif
            </h5>

            <p class="mb-0">
              Login berhasil dan token JWT tersimpan
              dengan aman pada browser.
            </p>

          </div>

        </div>

      </section>

      <!-- INFO -->
      <aside class="col-12 col-lg-3">

        <div class="card p-3">

          <h5 class="fw-bold">
            <i class="bi bi-info-circle-fill me-2"></i>
            Informasi
          </h5>

          <p class="text-muted">
            Gunakan portal ini untuk membuat,
            memantau, dan mengelola laporan warga.
          </p>

          <hr>

          <p class="mb-0">
            <i class="bi bi-person-check-fill me-2"></i>
            Status : Login Aktif
          </p>

        </div>

      </aside>

    </section>
  `
};

function handleRouting() {

  const app = document.getElementById("app-content");

  const hash = window.location.hash.replace("#", "") || "login";

  app.innerHTML = routes[hash] || routes.login;

  updateNavbar();

  if (hash === "login") {
    setupLoginForm();
  }

  if (hash === "dashboard") {

    const token = localStorage.getItem("access_token");

    if (!token) {
      window.location.hash = "#login";
    }
  }
}

window.addEventListener("hashchange", handleRouting);
window.addEventListener("DOMContentLoaded", handleRouting);