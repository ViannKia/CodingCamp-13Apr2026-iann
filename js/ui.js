// js/ui.js — DOM rendering functions (vanilla JS, global scope)

var UI = (function () {
  var MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  function formatRupiah(amount) {
    return 'Rp ' + Number(amount).toLocaleString('id-ID');
  }

  // ── Transaction List ──────────────────────────────────────────────────────

  function renderTransactionList(transactions) {
    var list = document.getElementById('transaction-list');
    if (!list) return;

    if (!transactions || transactions.length === 0) {
      list.innerHTML = '<li class="empty-state">Belum ada transaksi.</li>';
      return;
    }

    list.innerHTML = transactions.map(function (t) {
      return (
        '<li class="transaction-item" data-id="' + t.id + '">' +
          '<div class="transaction-info">' +
            '<span class="transaction-name">' + escapeHtml(t.name) + '</span>' +
            '<span class="transaction-meta">' +
              '<span class="transaction-category category-' + t.category.toLowerCase() + '">' + t.category + '</span>' +
            '</span>' +
          '</div>' +
          '<div class="transaction-right">' +
            '<span class="transaction-amount">' + formatRupiah(t.amount) + '</span>' +
            '<button class="btn-delete" data-id="' + t.id + '" aria-label="Hapus transaksi">Delete</button>' +
          '</div>' +
        '</li>'
      );
    }).join('');
  }

  // ── Total Balance ─────────────────────────────────────────────────────────

  function renderTotalBalance(total) {
    var el = document.getElementById('total-balance');
    if (el) el.textContent = formatRupiah(total);
  }

  // ── Form errors ───────────────────────────────────────────────────────────

  function showFieldError(fieldName, message) {
    var span = document.getElementById('error-' + fieldName);
    if (span) {
      span.textContent = message;
      span.style.display = 'block';
    }
  }

  function clearFormErrors() {
    var spans = document.querySelectorAll('.field-error');
    spans.forEach(function (s) {
      s.textContent = '';
      s.style.display = 'none';
    });
  }

  function clearForm() {
    var form = document.getElementById('transaction-form');
    if (form) form.reset();
  }

  // ── Theme ─────────────────────────────────────────────────────────────────

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // ── Month Filter ──────────────────────────────────────────────────────────

  function renderMonthFilter(availableMonths) {
    var select = document.getElementById('month-filter');
    if (!select) return;

    var currentVal = select.value;

    // Build options: All Time + available months
    var options = '<option value="all">All Time</option>';
    availableMonths.forEach(function (ym) {
      var parts = ym.split('-');
      var year = parts[0];
      var monthIdx = parseInt(parts[1], 10) - 1;
      var label = MONTH_NAMES[monthIdx] + ' ' + year;
      options += '<option value="' + ym + '">' + label + '</option>';
    });

    select.innerHTML = options;

    // Restore previous selection if still valid
    if (currentVal && select.querySelector('option[value="' + currentVal + '"]')) {
      select.value = currentVal;
    } else {
      select.value = 'all';
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    renderTransactionList: renderTransactionList,
    renderTotalBalance: renderTotalBalance,
    showFieldError: showFieldError,
    clearFormErrors: clearFormErrors,
    clearForm: clearForm,
    applyTheme: applyTheme,
    renderMonthFilter: renderMonthFilter
  };
})();
