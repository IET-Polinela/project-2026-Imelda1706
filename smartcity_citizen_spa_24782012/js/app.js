let editingReportId = null;
function updateNavbar() {
    const navMenu = document.getElementById("nav-menus");
    const token = localStorage.getItem("access_token");
  
    if (token) {
      navMenu.innerHTML = `
        <button class="btn btn-light btn-sm" onclick="logout()">
          <i class="bi bi-box-arrow-right me-1"></i>Logout
        </button>
      `;
    } else {
      navMenu.innerHTML = `
        <a href="#login" class="btn btn-light btn-sm">
          <i class="bi bi-box-arrow-in-right me-1"></i>Login
        </a>
      `;
    }
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

  let statusChart = null;
  let categoryChart = null;

function renderDashboardCharts(reports) {

    const statusCanvas = document.getElementById("statusChart");
    const categoryCanvas = document.getElementById("categoryChart");

    if (!statusCanvas || !categoryCanvas) return;

    const statusData = {
        DRAFT: 0,
        REPORTED: 0,
        VERIFIED: 0,
        IN_PROGRESS: 0,
        RESOLVED: 0
    };

    const categoryData = {};

    reports.forEach(report => {

        statusData[report.status] =
            (statusData[report.status] || 0) + 1;

        categoryData[report.category] =
            (categoryData[report.category] || 0) + 1;

    });

    if (statusChart) statusChart.destroy();

    if (categoryChart) categoryChart.destroy();

    statusChart = new Chart(statusCanvas, {

        type: "pie",

        data: {

            labels: Object.keys(statusData),

            datasets: [{

                data: Object.values(statusData)

            }]
        }

    });

    categoryChart = new Chart(categoryCanvas, {

        type: "bar",

        data: {

            labels: Object.keys(categoryData),

            datasets: [{

                label: "Jumlah",

                data: Object.values(categoryData)

            }]
        }

    });

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
<div class="col">

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

        ${
            report.status === "DRAFT"
            ? `
                <button
                    class="btn btn-warning mt-2"
                    onclick="editDraft(${report.id})">
                    Edit Draft
                </button>
              `
            : ""
        }

    </div>

</div>
`;
  });

  container.innerHTML = html;
}

async function loadDashboardData(tab, page = 1) {

    const result = await requestAPI(
        `/report/?tab=${tab}&page=${page}`
    );

    if (!result.ok) return;

    const reports = result.data.results;

    if (tab === "my_reports") {
        renderMyReports(reports);
    } else {
        renderFeedReports(reports);
    }

    renderPagination(result.data, tab);

    if (tab === "my_reports") {
        renderDashboardCharts(reports);
    }

} 

function renderFeedReports(reports) {

  const container =
    document.getElementById(
      "listContainer"
    );

  if (!container) return;

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
    <div class="col">

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
          <strong>Progress:</strong>
          ${progress}%
        </p>

        <div class="progress mb-3">

          <div
            class="progress-bar"
            role="progressbar"
            style="width:${progress}%"
          >
            ${report.status}
          </div>

        </div>

        <p>
          <strong>Lokasi:</strong>
          ${report.location}
        </p>
            </div>

      </div>
    `;
  });

  container.innerHTML = html;
}

function renderMyReports(reports) {

  const container =
    document.getElementById(
      "listContainer"
    );

  if (!container) return;

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
          <strong>Kategori:</strong>
          ${report.category}
        </p>

        <p>
          <strong>Deskripsi:</strong>
          ${report.description || "-"}
        </p>

        <p>
          <strong>Status:</strong>
          ${report.status}
        </p>

        <p>
          <strong>Progress:</strong>
          ${progress}%
        </p>

        <div class="progress mb-3">

          <div
            class="progress-bar"
            role="progressbar"
            style="width:${progress}%"
          >
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

        <div class="mt-2">
          <button
              class="btn btn-warning btn-sm mt-2"
              style="width:auto;"
              onclick="editDraft(${report.id})"
          >
              Edit Draft
          </button>
        </div>
          `
          : ""
        }

      </div>
    `;
  });

  container.innerHTML = html;
}

function renderPagination(
  data,
  tab
) {

  const totalPages =
    Math.ceil(
      data.count / 10
    );

  console.log("TOTAL DATA :", data.count);
  console.log("TOTAL PAGE :", totalPages);

  const container =
    document.getElementById(
      "paginationContainer"
    );

  if (!container) return;

  let html = `
    <nav aria-label="Pagination">
      <ul class="pagination justify-content-center">
  `;

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {

    html += `
      <li class="page-item">

        <button
          class="page-link"
          onclick="
            loadDashboardData(
              '${tab}',
              ${i}
            )
          "
        >
          ${i}
        </button>

      </li>
    `;

  }

  html += `
      </ul>
    </nav>
  `;

  container.innerHTML = html;
}

async function loadReportForEdit(id) {

  console.log("LOAD REPORT ID =", id);

  const result = await requestAPI(`/report/${id}/`);

  console.log(result);

  if (!result.ok) {
    alert("Gagal memuat draft.");
    return;
  }

  const report = result.data;

  document.getElementById("inputTitle").value =
  report.title || "";

  document.getElementById("category").value =
  report.category || "";

  document.getElementById("inputDescription").value =
  report.description || "";

  document.getElementById("inputLocation").value =
  report.location || "";
}

async function editDraft(id) {

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

  document.getElementById("inputTitle").value =
    report.title || "";

  document.getElementById("category").value =
    report.category || "";

  document.getElementById("inputDescription").value =
    report.description || "";

  document.getElementById("inputLocation").value =
    report.location || "";

  document.getElementById(
      "reportModalLabel"
  ).textContent =
      "Edit Draft"; 

//  document.getElementById(
 //     "btnSubmit"
 // ).textContent =
  //    "Update Draft";

  const modal =
      new bootstrap.Modal(
          document.getElementById(
              "reportModal"
          )
      );

  modal.show();
}

function openCreateModal() {

    editingReportId = null;

    document.getElementById(
        "reportForm"
    ).reset();

    document.getElementById(
        "reportModalLabel"
    ).textContent =
        "Buat Laporan Baru";

    document.getElementById(
        "btnSubmit"
    ).textContent =
        "Ajukan";

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

        const draftButton =
            document.getElementById(
                "btnDraft"
            );

        console.log(
            "Submit =",
            submitButton
            );

        console.log(
            "Draft =",
            draftButton
            );

        if (!submitButton) return;

        submitButton.addEventListener(
            "click",
            async function () {

                const payload = {
                    title:
                        document.getElementById(
                            "inputTitle"
                        ).value,

                    category:
                        document.getElementById(
                            "category"
                        ).value,

                    description:
                        document.getElementById(
                           "inputDescription"
                        ).value,

                    location:
                        document.getElementById(
                            "inputLocation"
                        ).value,
                    
                    status: "REPORTED"
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

                    loadDashboardData(
                      "my_reports",
                      1
                    );

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

        draftButton.addEventListener(
    "click",
    async function () {

        const payload = {
            title: document.getElementById("inputTitle").value,
            category: document.getElementById("category").value,
            description: document.getElementById("inputDescription").value,
            location: document.getElementById("inputLocation").value,
            status: "DRAFT"
        };

        let result;

        if (editingReportId === null) {

            result = await requestAPI(
                "/report/",
                "POST",
                payload
            );

        } else {

            result = await requestAPI(
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

            loadDashboardData(
                "my_reports",
                1
            );

            alert(
                "Draft berhasil disimpan!"
            );

        } else {

            alert(
                "Gagal menyimpan draft."
            );

        }

    }
);

});