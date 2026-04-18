// js/main.js — Entry point & event binding (vanilla JS, global scope)

(function () {
  // ── Helpers ───────────────────────────────────────────────────────────────

  function getActiveTransactions() {
    var s = Store.getState();
    var filtered = Store.filterTransactions(s.transactions, s.activeFilter);
    return Store.sortTransactions(filtered, s.sortOrder);
  }

  // ── Full re-render ────────────────────────────────────────────────────────

  function renderAll() {
    var s = Store.getState();
    var active = getActiveTransactions();

    UI.renderTransactionList(active);
    UI.renderTotalBalance(Store.computeTotal(active));
    ChartManager.updateChart(Store.computeCategoryTotals(active));
    UI.renderMonthFilter(Store.getAvailableMonths(s.transactions));

    // Keep month-filter select in sync with state
    var monthSelect = document.getElementById('month-filter');
    if (monthSelect) monthSelect.value = s.activeFilter;

    // Keep sort-control select in sync with state
    var sortSelect = document.getElementById('sort-control');
    if (sortSelect) sortSelect.value = s.sortOrder;
  }

  // ── Form submit ───────────────────────────────────────────────────────────

  function handleFormSubmit(e) {
    e.preventDefault();
    UI.clearFormErrors();

    var formData = {
      name: document.getElementById('input-name').value,
      amount: document.getElementById('input-amount').value,
      category: document.getElementById('input-category').value
    };

    var result = Validator.validateForm(formData);

    if (!result.valid) {
      Object.keys(result.errors).forEach(function (field) {
        UI.showFieldError(field, result.errors[field]);
      });
      return;
    }

    Store.addTransaction(formData);
    UI.clearForm();
    renderAll();
  }

  // ── Delete (event delegation) ─────────────────────────────────────────────

  function handleListClick(e) {
    var btn = e.target.closest('.btn-delete');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    if (id) {
      Store.deleteTransaction(id);
      renderAll();
    }
  }

  // ── Theme toggle ──────────────────────────────────────────────────────────

  function handleThemeToggle() {
    var current = Store.getState().theme;
    var next = current === 'dark' ? 'light' : 'dark';
    Store.setTheme(next);
    UI.applyTheme(next);
  }

  // ── Month filter ──────────────────────────────────────────────────────────

  function handleMonthFilter(e) {
    Store.setFilter(e.target.value);
    renderAll();
  }

  // ── Sort control ──────────────────────────────────────────────────────────

  function handleSortControl(e) {
    Store.setSortOrder(e.target.value);
    renderAll();
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    Store.loadFromStorage();
    UI.applyTheme(Store.getState().theme);
    ChartManager.initChart('expense-chart');
    renderAll();

    // Bind events
    var form = document.getElementById('transaction-form');
    if (form) form.addEventListener('submit', handleFormSubmit);

    var list = document.getElementById('transaction-list');
    if (list) list.addEventListener('click', handleListClick);

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', handleThemeToggle);

    var monthSelect = document.getElementById('month-filter');
    if (monthSelect) monthSelect.addEventListener('change', handleMonthFilter);

    var sortSelect = document.getElementById('sort-control');
    if (sortSelect) sortSelect.addEventListener('change', handleSortControl);

    // Clear field errors on input change
    ['input-name', 'input-amount', 'input-category'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () {
          var field = id.replace('input-', '');
          var span = document.getElementById('error-' + field);
          if (span) { span.textContent = ''; span.style.display = 'none'; }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
