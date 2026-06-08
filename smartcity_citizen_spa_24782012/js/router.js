let editingReportId = null;
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

      <aside class="col-12 col-lg-3">

        <div class="card p-3">

          <h5 class="fw-bold">
            <i class="bi bi-clipboard-data-fill me-2"></i>
            Menu Laporan
          </h5>

          <button
            class="btn btn-pink w-100 mt-3"
            onclick="window.location.hash='#reports'"
          >
            <i class="bi bi-list-ul me-2"></i>
            Lihat Feed Kota
          </button>

          <button
            class="btn btn-outline-secondary w-100 mt-2"
            onclick="window.location.hash='#myreports'"
          >
            <i class="bi bi-person-lines-fill me-2"></i>
            Laporan Saya
          </button>

          <button
            class="btn btn-success w-100 mt-2"
            onclick="openCreateModal()"
          >
            <i class="bi bi-plus-circle-fill me-2"></i>
            Buat Laporan Baru
          </button>

        </div>

      </aside>

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

        <p>
          <i class="bi bi-person-check-fill me-2"></i>
          Status : Login Aktif
        </p>

        <hr>

        <h6 class="fw-bold">
          Rekap Status
        </h6>

        <p class="mb-1">
          Draft :
          <span id="draft-count">0</span>
        </p>

        <p class="mb-1">
          Diproses :
          <span id="progress-count">0</span>
        </p>

        <p class="mb-0">
          Selesai :
        <span id="resolved-count">0</span>
        </p>

  </div>

</aside>

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

    </div>
  `,

}

async function loadReports() {

  const container = document.getElementById("report-list");

  const result = await requestAPI("/report/");

  console.log(result);

  if (!result.ok) {

    container.innerHTML = `
      <div class="alert alert-danger">
        Gagal memuat data laporan.
      </div>
    `;

    return;
  }

  const reports = result.data.results || result.data;

  console.log(reports);

  let html = "";

  if (reports.length === 0) {
  container.innerHTML = `
    <div class="alert alert-info">
      Belum ada laporan.
    </div>
  `;
  return;
}

  reports.forEach(report => {
  
    let progress = 0;

switch (report.status) {

  case "DRAFT":
    progress = 25;
    break;

  case "REPORTED":
    progress = 50;
    break;

  case "VERIFIED":
    progress = 75;
    break;

  case "IN_PROGRESS":
    progress = 90;
    break;

  case "RESOLVED":
    progress = 100;
    break;

  default:
    progress = 0;
}

    html += `
      <div class="card mb-3 p-3">

        <h5>${report.title}</h5>

        <p>
          <strong>Pelapor:</strong>
          ${report.reporter || "Warga Anonim"}
        </p>

        <p>
          <strong>Kategori:</strong> ${report.category}
        </p>

        <p>
          <strong>Status:</strong> ${report.status}
        </p>

        <p>
          <strong>Progress:</strong>
          ${progress}%
        </p>

      <div style="
        width:100%;
        height:20px;
        background:#ddd;
        border-radius:10px;
        overflow:hidden;
        margin-bottom:15px;
      ">

      <div style="
        width:${progress}%;
        height:100%;
        background:#198754;
        color:white;
        text-align:center;
        font-size:12px;
        line-height:20px;
        font-weight:bold;
      ">
        ${report.status}
      </div>

</div>
        <p>
          <strong>Lokasi:</strong>
          ${report.location}
        </p>

</div>
`;

  });

  container.innerHTML = html;
}


async function loadMyReports() {

  const container = document.getElementById("my-report-list");

  const result = await requestAPI("/report/?tab=my_reports");

  if (!result.ok) {

    container.innerHTML = `
      <div class="alert alert-danger">
        Gagal memuat laporan saya.
      </div>
    `;

    return;
  }

  const reports = result.data.results || result.data;

  if (reports.length === 0) {

    container.innerHTML = `
      <div class="alert alert-info">
        Anda belum memiliki laporan.
      </div>
    `;

    return;
  }

  let html = "";

  reports.forEach(report => {

    let progress = 0;

    switch (report.status) {

      case "DRAFT":
        progress = 25;
        break;

      case "REPORTED":
        progress = 50;
        break;

      case "VERIFIED":
        progress = 75;
        break;

      case "IN_PROGRESS":
        progress = 90;
        break;

      case "RESOLVED":
        progress = 100;
        break;

      default:
        progress = 0;
    }

    html += `
      <div class="card mb-3 p-3">

        <h5>${report.title}</h5>

        <p>
          <strong>Pelapor:</strong>
          ${report.reporter || "Warga Anonim"}
        </p>

        <p>
          <strong>Kategori:</strong>
          ${report.category}
        </p>

        <p>
          <strong>Status:</strong>
          ${report.status}
        </p>

        <p>
          <strong>Progress:</strong> ${progress}%
        </p>

        <div style="
          width:100%;
          height:20px;
          background:#ddd;
          border-radius:10px;
          overflow:hidden;
          margin-bottom:15px;
        ">

          <div style="
            width:${progress}%;
            height:100%;
            background:#198754;
            color:white;
            text-align:center;
            font-size:12px;
            line-height:20px;
            font-weight:bold;
">
  ${report.status}
</div>

        </div>

        <p>
          <strong>Lokasi:</strong>
          ${report.location}
        </p>

        ${
          report.status === "DRAFT"
          ? `
              <button
                class="btn btn-warning mt-2"
                onclick="editReport(${report.id})"
              >
                Edit Draft
              </button>
  `
  : ""
}
</div>
`;
  });

  container.innerHTML = html;
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
  }

  if (hash === "reports") {
    loadReports();
  }

  if (hash === "myreports") {
    loadMyReports();
  }

}

window.addEventListener("hashchange", handleRouting);
window.addEventListener("DOMContentLoaded", handleRouting);


async function loadReportForEdit(id) {

  console.log("LOAD REPORT ID =", id);

  const result = await requestAPI(`/report/${id}/`);

  console.log(result);

  if (!result.ok) {
    alert("Gagal memuat draft.");
    return;
  }

  const report = result.data;

  document.getElementById("title").value =
    report.title || "";

  document.getElementById("category").value =
    report.category || "";

  document.getElementById("description").value =
    report.description || "";

  document.getElementById("location").value =
    report.location || "";
}

async function editReport(id) {

  editingReportId = id;

  const result =
      await requestAPI(
          `/report/${id}/`
      );

  if (!result.ok) {
      alert("Gagal memuat draft.");
      return;
  }

  const report =
      result.data;

  document.getElementById("title").value =
      report.title || "";

  document.getElementById("category").value =
      report.category || "";

  document.getElementById("description").value =
      report.description || "";

  document.getElementById("location").value =
      report.location || "";

  document.getElementById(
      "modalTitle"
  ).textContent =
      "Edit Draft";

  document.getElementById(
      "btnSubmit"
  ).textContent =
      "Update Draft";

  const modal =
      new bootstrap.Modal(
          document.getElementById(
              "reportModal"
          )
      );

  modal.show();
}

async function loadSummaryStats() {

  const result = await requestAPI(
    "/report/?tab=my_reports&page_size=1000"
  );

  if (!result.ok) return;

  const reports =
    result.data.results || [];

  const draftCount =
    reports.filter(
      r => r.status === "DRAFT"
    ).length;

  const progressCount =
    reports.filter(
      r => r.status === "IN_PROGRESS"
    ).length;

  const resolvedCount =
    reports.filter(
      r => r.status === "RESOLVED"
    ).length;

  document.getElementById(
    "draft-count"
  ).textContent = draftCount;

  document.getElementById(
    "progress-count"
  ).textContent = progressCount;

  document.getElementById(
    "resolved-count"
  ).textContent = resolvedCount;
}

function openCreateModal() {
  

    editingReportId = null;

    document.getElementById(
        "reportForm"
    ).reset();

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Buat Laporan Baru";

    document.getElementById(
        "btnSubmit"
    ).textContent =
        "Simpan Draft";

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "reportModal"
            )
        );

    modal.show();
}

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const submitButton =
            document.getElementById(
                "btnSubmit"
            );

        if (!submitButton) return;

        submitButton.addEventListener(
            "click",
            async function () {

                const payload = {
                    title:
                        document.getElementById(
                            "title"
                        ).value,

                    category:
                        document.getElementById(
                            "category"
                        ).value,

                    description:
                        document.getElementById(
                            "description"
                        ).value,

                    location:
                        document.getElementById(
                            "location"
                        ).value
                };

                let result;

                if (
                    editingReportId === null
                ) {

                    result =
                        await requestAPI(
                            "/report/",
                            "POST",
                            payload
                        );

                } else {

                    result =
                        await requestAPI(
                            `/report/${editingReportId}/`,
                            "PUT",
                            payload
                        );

                }

                if (result.ok) {

                    bootstrap.Modal
                        .getInstance(
                            document.getElementById(
                                "reportModal"
                            )
                        )
                        .hide();

                    document
                        .getElementById(
                            "reportForm"
                        )
                        .reset();

                    editingReportId =
                        null;

                    loadMyReports();

                    alert(
                        "Data berhasil disimpan!"
                    );

                } else {

                    alert(
                        "Gagal menyimpan data."
                    );

                }

            }
        );

    }
);