# Implementation Plan: Expense & Budget Visualizer

## Overview

Implementasi dilakukan secara incremental dari lapisan paling dasar (struktur file, data layer) ke atas (UI rendering, chart, fitur opsional).

**Technical Constraints:**
- HTML, CSS, Vanilla JavaScript SAJA
- Tidak ada package.json, npm, build step, atau testing framework
- Semua JS di-load via `<script>` tags di HTML (bukan ES modules)
- Cukup buka `index.html` di browser, langsung berjalan

## Tasks

- [x] 1. Setup struktur proyek
  - Buat `index.html` dengan boilerplate HTML5, link ke `style.css`, Chart.js via CDN, dan semua `<script>` tags
  - Buat `style.css` dengan CSS variables untuk color palette (light mode)
  - Buat stub kosong: `js/validator.js`, `js/store.js`, `js/ui.js`, `js/chartManager.js`, `js/main.js`
  - _Requirements: 6.1_

- [x] 2. Implementasi `js/validator.js`
  - [x] 2.1 Implementasi fungsi `validateForm(formData)`
    - Validasi field `name` tidak kosong → error "Item name is required"
    - Validasi field `amount` tidak kosong → error "Amount is required"
    - Validasi `amount` adalah angka positif > 0 → error "Amount must be greater than zero" atau "Amount must be a valid number"
    - Validasi field `category` dipilih → error "Please select a category"
    - Return `{ valid: boolean, errors: { name?, amount?, category? } }`
    - _Requirements: 1.3, 1.5_

- [x] 3. Implementasi `js/store.js` — state, computed functions, dan localStorage
  - [x] 3.1 Implementasi state shape dan fungsi `loadFromStorage()` / `saveToStorage()`
    - Definisikan state: `{ transactions: [], theme: 'light', activeFilter: 'all', sortOrder: 'default' }`
    - Implementasi `loadFromStorage()` dengan error handling (malformed JSON → return `[]`, clear storage)
    - Implementasi `getState()`, `setTheme()`, `setFilter()`, `setSortOrder()`
    - _Requirements: 5.3, 5.4, 5.5, 8.2_

  - [x] 3.2 Implementasi `addTransaction()` dan `deleteTransaction(id)`
    - `addTransaction` membuat Transaction baru dengan `crypto.randomUUID()` (fallback ke `Date.now() + Math.random()`)
    - Simpan ke localStorage setelah setiap mutasi
    - `deleteTransaction` filter by id, simpan ke localStorage
    - _Requirements: 1.4, 2.5, 5.1, 5.2_

  - [x] 3.3 Implementasi pure computed functions
    - `computeTotal(transactions)` → sum semua amount, return 0 untuk array kosong
    - `computeCategoryTotals(transactions)` → group by category, hanya sertakan kategori dengan total > 0
    - `filterTransactions(transactions, filter)` → filter by 'YYYY-MM' atau return semua jika 'all'
    - `sortTransactions(transactions, order)` → sort by asc/desc/category/default (reverse-chronological)
    - `getAvailableMonths(transactions)` → array 'YYYY-MM' unik tanpa duplikat
    - _Requirements: 2.2, 3.2, 3.5, 4.2, 9.1, 9.3, 10.3, 10.4_

- [x] 4. Implementasi `js/ui.js` — DOM rendering functions
  - [x] 4.1 Implementasi `renderTransactionList(transactions)`
    - Render setiap transaksi dengan nama, amount (format Rupiah), kategori, dan tombol Delete
    - Tampilkan empty state jika array kosong
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.2 Implementasi `renderTotalBalance(total)`
    - Update elemen `#total-balance` dengan nilai total diformat sebagai currency Rupiah
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 4.3 Implementasi `showFieldError()`, `clearFormErrors()`, `clearForm()`
    - Tampilkan error di elemen `<span class="field-error">` di bawah masing-masing field
    - _Requirements: 1.3_

  - [x] 4.4 Implementasi `applyTheme(theme)`
    - Set atribut `data-theme` pada `<html>` element
    - _Requirements: 8.3_

  - [x] 4.5 Implementasi `renderMonthFilter(availableMonths)`
    - Render opsi "All Time" + daftar bulan dalam format "Januari 2026"
    - _Requirements: 9.1, 9.2_

- [x] 5. Implementasi `js/chartManager.js` — Chart.js wrapper
  - Implementasi `initChart(canvasId)` — inisialisasi Chart.js pie chart
  - Implementasi `updateChart(categoryTotals)` — update data dan label chart
  - Implementasi `destroyChart()` — cleanup instance Chart.js
  - Handle empty state: tampilkan placeholder jika `categoryTotals` kosong
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Implementasi `index.html` — struktur HTML lengkap
  - Tambahkan semua elemen UI: form, transaction list, total balance, chart canvas, theme toggle, month filter, sort control
  - Tambahkan field form: input text (name), input number (amount), select (category), tombol submit
  - Tambahkan `<span class="field-error">` di bawah setiap field form
  - Load semua JS files via `<script src="...">` tags (bukan ES modules)
  - _Requirements: 1.1, 1.2, 2.3, 3.1, 4.1, 8.1, 9.1, 10.1_

- [x] 7. Implementasi `js/main.js` — entry point dan event binding
  - Panggil `loadFromStorage()` saat init, render initial state (list, balance, chart, theme, month filter)
  - Bind event listener pada form submit: validate → addTransaction → re-render semua komponen
  - Bind event listener pada delete button (event delegation): deleteTransaction → re-render
  - Bind event listener pada `#theme-toggle`: toggle theme → applyTheme → save
  - Bind event listener pada `#month-filter`: setFilter → re-render
  - Bind event listener pada `#sort-control`: setSortOrder → re-render list
  - _Requirements: 1.3, 1.4, 2.5, 3.3, 3.4, 4.3, 4.4, 5.1, 5.2, 5.3, 8.3, 8.4, 9.3, 10.3_

- [x] 8. Implementasi `style.css` — layout responsif dan visual design (MVP)
  - Layout responsif: single-column di bawah 768px, multi-column di 768px ke atas
  - Styling semua komponen: form, transaction list, balance display, chart container, delete button
  - Minimum font size 14px, unit relatif (rem, %, vw)
  - Color contrast ratio ≥ 4.5:1
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4_

- [x] 9. Implementasi fitur opsional: Dark/Light Mode Toggle (Req 8)
  - Tambahkan CSS variables untuk dark mode menggunakan `[data-theme="dark"]` selector
  - Warna dark mode memenuhi contrast ratio ≥ 4.5:1
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 10. Implementasi fitur opsional: Monthly Summary View (Req 9)
  - Render month filter dropdown dengan opsi "All Time" + bulan tersedia
  - Filter Transaction List, Total Balance, dan Pie Chart berdasarkan bulan aktif
  - Update month filter options saat transaksi ditambah/dihapus
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 11. Implementasi fitur opsional: Sort Transactions (Req 10)
  - Sort control dropdown: Default, Amount asc/desc, Category A-Z
  - Sort hanya mengubah tampilan, tidak memodifikasi data di localStorage
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 12. Final check — Verifikasi semua fitur berjalan di browser
  - Buka `index.html` langsung di browser
  - Verifikasi add/delete transaksi, pie chart update, localStorage persistence, dark mode, filter bulan, sort

## Notes

- Semua JS menggunakan global scope (bukan ES modules) — tidak ada `import`/`export`
- Semua file di-load via `<script src="...">` di `index.html`, urutan: validator → store → ui → chartManager → main
- Chart.js di-load via CDN sebelum chartManager.js
- Tidak ada npm, tidak ada build step, tidak ada testing framework
