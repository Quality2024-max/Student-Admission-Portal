// =====================================================
// ADMIN PAGES - shared client-side behaviour
// (modals, flash auto-dismiss, simple table search)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---- Open modal ----
  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById(btn.dataset.modal);
      if (modal) modal.classList.add("open");
    });
  });

  // ---- Close modal (close button or overlay click) ----
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
    overlay.querySelectorAll(".close").forEach((btn) => {
      btn.addEventListener("click", () => overlay.classList.remove("open"));
    });
  });

  // ---- Confirm delete forms ----
  document.querySelectorAll("form.delete-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!confirm("Are you sure you want to delete this record?")) {
        e.preventDefault();
      }
    });
  });

  // ---- Flash message close + auto dismiss ----
  document.querySelectorAll(".flash-message").forEach((msg) => {
    const closeBtn = msg.querySelector(".flash-close");
    if (closeBtn) closeBtn.addEventListener("click", () => msg.remove());
    setTimeout(() => msg.remove(), 4000);
  });

  // ---- Simple client-side table search ----
  const searchInput = document.getElementById("tableSearch");
  const dataTable = document.getElementById("dataTable");
  if (searchInput && dataTable) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      dataTable.querySelectorAll("tr").forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
  }
});
