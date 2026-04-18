// js/store.js — State management + localStorage (vanilla JS, global scope)

var Store = (function () {
  var STORAGE_KEY_TRANSACTIONS = 'expense_transactions';
  var STORAGE_KEY_THEME = 'expense_theme';

  var state = {
    transactions: [],
    theme: 'light',
    activeFilter: 'all',
    sortOrder: 'default'
  };

  // ── Storage ──────────────────────────────────────────────────────────────

  function loadFromStorage() {
    // Load transactions
    try {
      var raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          state.transactions = parsed;
        } else {
          localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
          state.transactions = [];
        }
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
      state.transactions = [];
    }

    // Load theme
    try {
      var savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      state.theme = (savedTheme === 'dark') ? 'dark' : 'light';
    } catch (e) {
      state.theme = 'light';
    }
  }

  function saveTransactions() {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(state.transactions));
    } catch (e) {
      // localStorage unavailable (e.g. private mode) — degrade gracefully
    }
  }

  function saveTheme() {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, state.theme);
    } catch (e) {}
  }

  // ── State accessors ───────────────────────────────────────────────────────

  function getState() {
    return state;
  }

  function setTheme(theme) {
    state.theme = (theme === 'dark') ? 'dark' : 'light';
    saveTheme();
  }

  function setFilter(filter) {
    state.activeFilter = filter || 'all';
  }

  function setSortOrder(order) {
    state.sortOrder = order || 'default';
  }

  // ── Mutations ─────────────────────────────────────────────────────────────

  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function addTransaction(formData) {
    var transaction = {
      id: generateId(),
      name: String(formData.name).trim(),
      amount: Number(formData.amount),
      category: formData.category,
      date: new Date().toISOString()
    };
    state.transactions.unshift(transaction); // newest first in storage
    saveTransactions();
    return transaction;
  }

  function deleteTransaction(id) {
    state.transactions = state.transactions.filter(function (t) { return t.id !== id; });
    saveTransactions();
  }

  // ── Computed (pure functions) ─────────────────────────────────────────────

  function computeTotal(transactions) {
    if (!transactions || transactions.length === 0) return 0;
    return transactions.reduce(function (sum, t) { return sum + t.amount; }, 0);
  }

  function computeCategoryTotals(transactions) {
    var totals = {};
    if (!transactions) return totals;
    transactions.forEach(function (t) {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    // Remove categories with 0 total
    Object.keys(totals).forEach(function (k) {
      if (totals[k] <= 0) delete totals[k];
    });
    return totals;
  }

  function filterTransactions(transactions, filter) {
    if (!transactions) return [];
    if (!filter || filter === 'all') return transactions;
    return transactions.filter(function (t) {
      var d = new Date(t.date);
      var ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      return ym === filter;
    });
  }

  function sortTransactions(transactions, order) {
    if (!transactions) return [];
    var arr = transactions.slice(); // never mutate original
    if (order === 'asc') {
      arr.sort(function (a, b) { return a.amount - b.amount; });
    } else if (order === 'desc') {
      arr.sort(function (a, b) { return b.amount - a.amount; });
    } else if (order === 'category') {
      arr.sort(function (a, b) { return a.category.localeCompare(b.category); });
    }
    // 'default' keeps insertion order (already newest-first from addTransaction)
    return arr;
  }

  function getAvailableMonths(transactions) {
    if (!transactions) return [];
    var seen = {};
    var months = [];
    transactions.forEach(function (t) {
      var d = new Date(t.date);
      var ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      if (!seen[ym]) {
        seen[ym] = true;
        months.push(ym);
      }
    });
    return months;
  }

  return {
    loadFromStorage: loadFromStorage,
    getState: getState,
    setTheme: setTheme,
    setFilter: setFilter,
    setSortOrder: setSortOrder,
    addTransaction: addTransaction,
    deleteTransaction: deleteTransaction,
    computeTotal: computeTotal,
    computeCategoryTotals: computeCategoryTotals,
    filterTransactions: filterTransactions,
    sortTransactions: sortTransactions,
    getAvailableMonths: getAvailableMonths
  };
})();
