async function getAllLoans() {
  let allLoans = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const res = await fetch(`${API_URL}/loans?page=${page}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    const loans = result.data?.loans || [];
    allLoans = allLoans.concat(loans);

    hasNextPage = result.pagination?.hasNextPage;
    page++;
  }

  return allLoans;
}

async function getAllFines() {
  try {
    const res = await fetch(`${API_URL}/fines`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    return result.data?.fines || [];
  } catch (error) {
    console.error("Gagal memuat denda:", error);
    return [];
  }
}
async function loadLoans() {
  const loans = await getAllLoans();
  const fines = await getAllFines();

  const activeLoans = loans.filter(l => l.status === "borrowed");
  const returnedLoans = loans.filter(l => l.status === "returned");

  let activeHtml = "<table><tr><th>Nama</th><th>Buku</th><th>Tgl Pinjam</th><th>Jatuh Tempo</th></tr>";

  if (activeLoans.length > 0) {
    activeLoans.forEach(loan => {
      const memberName = loan.member?.name || "-";
      const bookTitle = loan.book?.title || "-";
      const loanDate = loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : "-";
      const dueDate = loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "-";

      activeHtml += `<tr>
        <td>${memberName}</td>
        <td>${bookTitle}</td>
        <td>${loanDate}</td>
        <td>${dueDate}</td>
      </tr>`;
    });
  } else {
    activeHtml += `<tr><td colspan="4">Tidak ada peminjaman aktif.</td></tr>`;
  }

  activeHtml += "</table>";
  document.getElementById("loanList").innerHTML = activeHtml;

  let historyHtml = `
    <table>
      <tr>
        <th>Nama</th>
        <th>Buku</th>
        <th>Tgl Pinjam</th>
        <th>Tgl Kembali</th>
        <th>Denda</th>
        <th>Alasan</th>
        <th>Catatan</th>
        <th>Aksi</th>
      </tr>
  `;

  if (returnedLoans.length > 0) {
    returnedLoans.forEach(loan => {
      const memberName = loan.member?.name || "-";
      const bookTitle = loan.book?.title || "-";
      const loanDate = loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : "-";
      const returnDate = loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : "-";

      const loanFines = fines.filter(f => f.loan?._id === loan._id);

const amount = loanFines.length > 0 
  ? loanFines.map(f => f.amount).join(", ") 
  : "";

const reason = loanFines.length > 0 
  ? loanFines.map(f => f.reason).join(", ") 
  : "";

const notes = loanFines.length > 0 
  ? loanFines.map(f => f.notes).join(" | ") 
  : "";

      historyHtml += `<tr>
        <td>${memberName}</td>
        <td>${bookTitle}</td>
        <td>${loanDate}</td>
        <td>${returnDate}</td>
        <td>${amount}</td>
        <td>${reason}</td>
        <td>${notes}</td>
        <td>
          <button onclick="openFinePopup('${loan._id}')">Tambah Denda</button>
        </td>
      </tr>`;
    });
  } else {
    historyHtml += `<tr><td colspan="8">Belum ada riwayat.</td></tr>`;
  }

  historyHtml += "</table>";
  document.getElementById("loanHistory").innerHTML = historyHtml;
}

function openFinePopup(loanId) {
  document.getElementById("loanId").value = loanId;
  document.getElementById("finePopup").style.display = "block";
}

function closeFinePopup() {
  document.getElementById("finePopup").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const fineForm = document.getElementById("fineForm");
  if (fineForm) {
    fineForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      const loanId = document.getElementById("loanId").value;
      const amount = parseInt(document.getElementById("amount").value, 10);
      const reason = document.getElementById("reason").value;
      const notes = document.getElementById("notes").value;

      const fine = { loanId, amount, reason, notes };

      try {
        await fetch(`${API_URL}/fines`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(fine)
        });
      } catch (err) {
        console.error("Gagal simpan denda:", err);
      }

      closeFinePopup();
      loadLoans(); 
    });
  }
})

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

window.onload = loadLoans;
