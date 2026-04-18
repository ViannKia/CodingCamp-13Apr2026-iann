# Requirements Document

## Introduction

Expense & Budget Visualizer adalah web app single-page berbasis HTML, CSS, dan Vanilla JavaScript yang memungkinkan pengguna mencatat transaksi pengeluaran, melihat total saldo, dan memvisualisasikan distribusi pengeluaran per kategori menggunakan pie chart. Data disimpan secara persisten di browser menggunakan Local Storage sehingga tetap tersedia setelah refresh.

## Glossary

- **App**: Aplikasi web Expense & Budget Visualizer secara keseluruhan
- **Transaction**: Satu entri pengeluaran yang terdiri dari nama item, jumlah (amount), dan kategori
- **Transaction_List**: Komponen UI yang menampilkan daftar semua transaksi yang telah ditambahkan
- **Input_Form**: Komponen UI berupa form untuk memasukkan data transaksi baru
- **Total_Balance**: Nilai agregat dari seluruh amount transaksi yang ditampilkan di bagian atas halaman
- **Pie_Chart**: Visualisasi distribusi pengeluaran per kategori menggunakan library Chart.js
- **Storage**: Mekanisme penyimpanan data berbasis Local Storage API di browser
- **Category**: Klasifikasi transaksi, terbatas pada tiga nilai: Food, Transport, Fun
- **Validator**: Logika validasi yang memastikan semua field pada Input_Form terisi sebelum transaksi disimpan
- **Theme_Toggle**: Komponen UI berupa tombol atau switch untuk berpindah antara light mode dan dark mode
- **Month_Filter**: Komponen UI berupa dropdown untuk memfilter tampilan berdasarkan bulan dan tahun tertentu
- **Sort_Control**: Komponen UI berupa dropdown untuk mengubah urutan tampilan Transaction_List

---

## Requirements

### Requirement 1: Input Form

**User Story:** As a user, I want to fill in a form with item name, amount, and category, so that I can record a new expense transaction.

#### Acceptance Criteria

1. THE Input_Form SHALL provide a text field for Item Name, a number field for Amount, and a dropdown field for Category with options: Food, Transport, and Fun.
2. THE Input_Form SHALL provide an "Add Transaction" button to submit the form.
3. WHEN the user clicks "Add Transaction" and any field is empty or not selected, THE Validator SHALL display an inline error message indicating which field is required.
4. WHEN the user clicks "Add Transaction" and all fields are valid, THE App SHALL create a new Transaction and clear all Input_Form fields.
5. WHEN the Amount field receives input, THE Input_Form SHALL accept only positive numeric values greater than zero.

---

### Requirement 2: Transaction List

**User Story:** As a user, I want to see a scrollable list of all my transactions, so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display each Transaction with its Item Name, Amount, and Category.
2. THE Transaction_List SHALL render transactions in reverse-chronological order, with the most recently added transaction appearing first.
3. THE Transaction_List SHALL have a maximum visible height with vertical scrolling enabled when the number of transactions exceeds the visible area.
4. WHEN a Transaction is displayed, THE Transaction_List SHALL render a Delete button for that Transaction.
5. WHEN the user clicks the Delete button on a Transaction, THE App SHALL remove that Transaction from the Transaction_List.

---

### Requirement 3: Total Balance

**User Story:** As a user, I want to see the total of all my expenses at the top of the page, so that I can quickly know how much I have spent in total.

#### Acceptance Criteria

1. THE App SHALL display the Total_Balance at the top of the page.
2. THE Total_Balance SHALL equal the sum of all Transaction amounts currently stored.
3. WHEN a new Transaction is added, THE Total_Balance SHALL update to reflect the new sum without requiring a page reload.
4. WHEN a Transaction is deleted, THE Total_Balance SHALL update to reflect the new sum without requiring a page reload.
5. WHEN no transactions exist, THE Total_Balance SHALL display a value of zero.

---

### Requirement 4: Pie Chart Visualization

**User Story:** As a user, I want to see a pie chart of my spending by category, so that I can understand how my budget is distributed.

#### Acceptance Criteria

1. THE Pie_Chart SHALL use the Chart.js library to render a pie chart showing spending distribution across all Categories.
2. THE Pie_Chart SHALL display one segment per Category that has at least one Transaction, labeled with the Category name and its total amount.
3. WHEN a new Transaction is added, THE Pie_Chart SHALL update automatically to reflect the new category distribution.
4. WHEN a Transaction is deleted, THE Pie_Chart SHALL update automatically to reflect the updated category distribution.
5. WHEN no transactions exist, THE Pie_Chart SHALL display an empty state or a placeholder message indicating no data is available.

---

### Requirement 5: Data Persistence

**User Story:** As a user, I want my transaction data to be saved in the browser, so that my records are not lost when I refresh or reopen the page.

#### Acceptance Criteria

1. WHEN a new Transaction is added, THE Storage SHALL save the updated transaction list to Local Storage immediately.
2. WHEN a Transaction is deleted, THE Storage SHALL save the updated transaction list to Local Storage immediately.
3. WHEN the App loads, THE Storage SHALL retrieve the transaction list from Local Storage and restore all previously saved Transactions.
4. WHEN Local Storage contains no prior data, THE App SHALL initialize with an empty transaction list.
5. IF Local Storage data is malformed or unreadable, THEN THE App SHALL initialize with an empty transaction list and clear the corrupted data from Local Storage.

---

### Requirement 6: Responsive Layout

**User Story:** As a user, I want to use the app on both desktop and mobile devices, so that I can record expenses from any device.

#### Acceptance Criteria

1. THE App SHALL render a usable layout on viewport widths from 320px to 1440px.
2. WHEN the viewport width is less than 768px, THE App SHALL stack all UI sections vertically in a single-column layout.
3. WHEN the viewport width is 768px or greater, THE App SHALL arrange UI sections in a multi-column layout where appropriate.
4. THE App SHALL use relative units (rem, %, vw) for font sizes and spacing to ensure readability across screen sizes.

---

### Requirement 7: Visual Design

**User Story:** As a user, I want a clean and readable interface, so that I can use the app without visual confusion.

#### Acceptance Criteria

1. THE App SHALL apply a consistent typographic scale with a minimum body font size of 14px.
2. THE App SHALL maintain a clear visual hierarchy by differentiating headings, labels, and body text through font size and weight.
3. THE App SHALL use sufficient color contrast between text and background, meeting a minimum contrast ratio of 4.5:1 for normal text.
4. THE App SHALL apply a minimal, clean visual style with consistent spacing and alignment across all UI components.

---

### Requirement 8: Dark/Light Mode Toggle (OPTIONAL)

**User Story:** As a user, I want to toggle between light and dark mode, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE App SHALL display a Theme_Toggle button on the page using a moon or sun icon, or a switch component, that is accessible at all times.
2. THE App SHALL apply light mode as the default theme on first load when no theme preference is stored.
3. WHEN the user clicks the Theme_Toggle, THE App SHALL switch the active theme between light mode and dark mode.
4. WHEN the theme changes, THE Storage SHALL save the selected theme preference to Local Storage immediately.
5. WHEN the App loads, THE Storage SHALL retrieve the theme preference from Local Storage and apply the last active theme before rendering the UI.
6. THE App SHALL maintain a minimum color contrast ratio of 4.5:1 for normal text in both light mode and dark mode.

---

### Requirement 9: Monthly Summary View (OPTIONAL)

**User Story:** As a user, I want to filter transactions by month, so that I can review my spending for a specific period.

#### Acceptance Criteria

1. THE App SHALL display a Month_Filter dropdown that lists available month-year options (e.g., Januari 2026, Februari 2026) derived from the stored transactions, plus an "All Time" option.
2. THE App SHALL set "All Time" as the default selected option in the Month_Filter on load.
3. WHEN the user selects a specific month from the Month_Filter, THE Transaction_List SHALL display only Transactions whose date falls within that selected month and year.
4. WHEN the user selects a specific month from the Month_Filter, THE Total_Balance SHALL equal the sum of only the Transactions from that selected month and year.
5. WHEN the user selects a specific month from the Month_Filter, THE Pie_Chart SHALL calculate category distribution using only the Transactions from that selected month and year.
6. WHEN the user selects "All Time" from the Month_Filter, THE Transaction_List, Total_Balance, and Pie_Chart SHALL revert to displaying all stored Transactions.
7. WHEN a new Transaction is added, THE Month_Filter SHALL update its list of available month-year options if the new Transaction introduces a previously unlisted month.

---

### Requirement 10: Sort Transactions by Amount or Category (OPTIONAL)

**User Story:** As a user, I want to sort my transaction list by amount or category, so that I can find and analyze transactions more easily.

#### Acceptance Criteria

1. THE App SHALL display a Sort_Control dropdown above the Transaction_List with the following options: "Default (Terbaru)", "Amount (Terkecil ke Terbesar)", "Amount (Terbesar ke Terkecil)", and "Category (A-Z)".
2. THE App SHALL set "Default (Terbaru)" as the selected option in the Sort_Control on load, preserving the reverse-chronological order defined in Requirement 2.
3. WHEN the user selects "Amount (Terkecil ke Terbesar)" from the Sort_Control, THE Transaction_List SHALL re-render transactions ordered by Amount in ascending order.
4. WHEN the user selects "Amount (Terbesar ke Terkecil)" from the Sort_Control, THE Transaction_List SHALL re-render transactions ordered by Amount in descending order.
5. WHEN the user selects "Category (A-Z)" from the Sort_Control, THE Transaction_List SHALL re-render transactions ordered alphabetically by Category name.
6. WHEN the Sort_Control option changes, THE App SHALL only change the display order of the Transaction_List and SHALL NOT modify, delete, or reorder the underlying stored Transaction data.
7. WHEN a new Transaction is added or an existing Transaction is deleted, THE Transaction_List SHALL re-render according to the currently active Sort_Control option.
