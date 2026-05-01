// // Ambil semua riwayat peminjaman (loop pagination)
// async function getAllHistoryLoans() {
//   let allLoans = [];
//   let page = 1;
//   let hasNextPage = true;

//   while (hasNextPage) {
//     const res = await fetch(`${API_URL}/loans/history?page=${page}&limit=20`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//     const result = await res.json();

//     const loans = result.data?.loans || [];
//     allLoans = allLoans.concat(loans);

//     // cek pagination dari API
//     hasNextPage = result.pagination?.hasNextPage;
//     page++;
//   }

//   return allLoans;
// }

// // Render tabel riwayat
// async function loadAllHistoryLoan() {
//   try {
//     const history = await getAllHistoryLoans();
//     const returnedLoans = history.filter(l => l.status === "returned");

//     let historyHtml = "<table><tr><th>Nama Peminjam</th><th>Judul Buku</th><th>Tanggal Pinjam</th><th>Tanggal Pengembalian</th><th>Status</th></tr>";
//     if (returnedLoans.length > 0) {
//       returnedLoans.forEach(loan => {
//         console.log("Loan member:", loan.member); // debug isi member

//         // kalau member object → ambil name, kalau string → tampilkan ID
//         const memberName =
//           loan.member && typeof loan.member === "object"
//             ? loan.member.name || "-"
//             : loan.member || "-";

//         // kalau book object → ambil title, kalau string → tampilkan ID
//         const bookTitle =
//           loan.book && typeof loan.book === "object"
//             ? loan.book.title || "-"
//             : loan.book || "-";

//         const loanDate = loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : "-";
//         const returnDate = loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : "-";
//         const status = loan.status || "-";

//         historyHtml += `<tr>
//           <td>${memberName}</td>
//           <td>${bookTitle}</td>
//           <td>${loanDate}</td>
//           <td>${returnDate}</td>
//           <td>${status}</td>
//         </tr>`;
//       });
//     } else {
//       historyHtml += `<tr><td colspan="5">Belum ada riwayat peminjaman.</td></tr>`;
//     }
//     historyHtml += "</table>";

//     document.getElementById("loanHistory").innerHTML = historyHtml;
//   } catch (error) {
//     console.error("Gagal memuat riwayat:", error);
//     document.getElementById("loanHistory").innerHTML = "<p>Terjadi kesalahan saat memuat riwayat.</p>";
//   }
// }

// // Logout
// function logout() {
//   localStorage.clear();
//   window.location.href = "login.html";
// }

// window.onload = loadAllHistoryLoan;
