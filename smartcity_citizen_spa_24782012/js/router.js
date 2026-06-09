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

  <aside class="col-lg-3">

    <div class="card p-3">

      <h5>
        <i class="bi bi-clipboard-data-fill me-2"></i>
        Raccoon City
      </h5>

      <button
        class="btn btn-success w-100 mb-3"
        onclick="openCreateModal()">

        <i class="bi bi-plus-circle me-2"></i>
        Buat Laporan Baru

      </button>

      <hr>

      <h6>Rekap Status</h6>

      <p>
        Draft :
        <span id="draft-count">0</span>
      </p>

      <p>
        Diproses :
        <span id="progress-count">0</span>
      </p>

      <p>
        Selesai :
        <span id="resolved-count">0</span>
      </p>

    </div>

  </aside>

  <section class="col-lg-9">

    <div class="card p-4">

      <div class="mb-3">

        <button
          class="btn btn-pink"
          onclick="loadDashboardData('my_reports',1)">

          Laporan Saya

        </button>

        <button
          class="btn btn-outline-secondary"
          onclick="loadDashboardData('feed',1)">

          Feed Kota

        </button>

      </div>

      <div id="dashboard-report-list">

        Loading...

      </div>

      <div
        id="pagination-container"
        class="mt-3 text-center">

      </div>

    </div>

  </section>

</section>

`,

  reports: `
    <div class="card p-4">

      <div class="d-flex justify-content-between align-items-center mb-4">

        <h3 class="fw-bold mb-0">
          Feed Kota
        </h3>

        <button
          class="btn btn-pink"
          onclick="window.location.hash='#dashboard'"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Dashboard
        </button>

      </div>

      <div id="report-list">
        Loading...
      </div>

      <div
        id="pagination-container"
        class="mt-3 text-center">
      </div>

    </div>
  `,

  myreports: `
    <div class="card p-4">

      <div class="d-flex justify-content-between align-items-center mb-4">

        <h3 class="fw-bold mb-0">
          Laporan Saya
        </h3>

        <button
          class="btn btn-pink"
          onclick="window.location.hash='#dashboard'"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Dashboard
        </button>

      </div>

      <div id="my-report-list">
        Loading...
      </div>

      <div
        id="pagination-container"
        class="mt-3 text-center">
      </div>

    </div>
  `,

}

function handleRouting() {

  const app = document.getElementById("app-content");

  const hash = window.location.hash.replace("#", "") || "login";

  app.innerHTML = routes[hash] || routes.login;

  updateNavbar();

  if (hash === "login") {
    setupLoginForm();
  }

  const token = localStorage.getItem("access_token");

  if (
    (
      hash === "dashboard" ||
      hash === "reports" ||
      hash === "myreports"
    ) &&
    !token
  ) {
    window.location.hash = "#login";
    return;
  }

  if (hash === "dashboard") {

  loadSummaryStats();

  loadDashboardData(
    "my_reports",
    1
  );

}

  if (hash === "reports") {
  loadDashboardData(
    "feed",
    1
  );
}

  if (hash === "myreports") {
  loadDashboardData(
    "my_reports",
    1
  );
}

} // <-- penutup handleRouting

window.addEventListener(
  "hashchange",
  handleRouting
);

window.addEventListener(
  "DOMContentLoaded",
  handleRouting
);