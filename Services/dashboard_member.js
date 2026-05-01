// ================= GET ALL BOOKS =================
async function getAllBooks() {
  let allBooks = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const res = await fetch(`${API_URL}/books?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    const books = result.data?.books || [];

    allBooks = allBooks.concat(books);
    hasNextPage = result.pagination?.hasNextPage;
    page++;
  }

  return allBooks;
}

async function getAllFines() {
  try {
    const res = await fetch(`${API_URL}/fines`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    return result.data?.fines || [];
  } catch (err) {
    console.error("Gagal ambil denda:", err);
    return [];
  }
}

async function loadBooks() {
  const books = await getAllBooks();
  const loans = await getLoans();
  const fines = await getAllFines();

  const activeLoans = loans.filter(l => l.status === "borrowed");
  const returnedLoans = loans.filter(l => l.status === "returned");

  let borrowedHtml = "<table><tr><th>Judul</th><th>Penulis</th><th>Batas </th><th>Kembalikan</th></tr>";

  if (activeLoans.length > 0) {
    activeLoans.forEach(loan => {
      borrowedHtml += `<tr>
        <td>${loan.book.title}</td>
        <td>${loan.book.author}</td>
        <td>${new Date(loan.dueDate).toLocaleDateString('id-ID')}</td>
        <td><button onclick="goToReturnPage('${loan._id}')">Kembalikan</button></td>
      </tr>`;
    });
  } else {
    borrowedHtml += `<tr><td colspan="3">Belum ada buku yang kamu pinjam.</td></tr>`;
  }

  borrowedHtml += "</table>";
  document.getElementById("borrowedBooks").innerHTML = borrowedHtml;

  let fineHtml = `
    <table>
      <tr>
        <th>Judul Buku</th>
        <th>Jumlah Denda</th>
        <th>Alasan</th>
        <th>Catatan</th>
        <th>Status</th>
      </tr>
  `;

  if (returnedLoans.length > 0) {
    returnedLoans.forEach(loan => {

      const loanFines = fines.filter(f => f.loan?._id === loan._id);

      if (loanFines.length > 0) {
        loanFines.forEach(f => {
          fineHtml += `<tr>
            <td>${loan.book.title}</td>
            <td>${f.amount}</td>
            <td>${f.reason}</td>
            <td>${f.notes || "-"}</td>
                    <td>
  ${f.status === "paid" 
    ? "✔ Lunas" 
    : `<button onclick="openPayPopup('${f._id}')">Bayar</button>`
  }
</td>
          </tr>`;
        });
      }
    });
  }

  if (fineHtml === `<table>
      <tr>
        <th>Judul Buku</th>
        <th>Jumlah Denda</th>
        <th>Alasan</th>
        <th>Catatan</th>
        <th>Status</th>
      </tr>
  `) {
    fineHtml += `<tr><td colspan="5">Tidak ada denda.</td></tr>`;
  }

  fineHtml += "</table>";
  document.getElementById("userFines").innerHTML = fineHtml;


  renderAvailableBooks(books, activeLoans);
}

function openPayPopup(fineId) {
  document.getElementById("fineId").value = fineId;
  document.getElementById("payPopup").style.display = "block";
}

function closePayPopup() {
  document.getElementById("payPopup").style.display = "none";
}


document.addEventListener("DOMContentLoaded", () => {
  const payForm = document.getElementById("payForm");

  if (payForm) {
    payForm.addEventListener("submit", async function(e) {
      e.preventDefault();

      const fineId = document.getElementById("fineId").value;
      const paymentMethod = document.getElementById("paymentMethod").value;
      const notes = document.getElementById("payNotes").value;

      try {
        const res = await fetch(`${API_URL}/fines/${fineId}/pay`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ paymentMethod, notes })
        });

        const result = await res.json();
        console.log("PAY RESPONSE:", result);

        if (!res.ok) {
          alert("Gagal bayar: " + result.message);
          return;
        }

        alert("Denda berhasil dibayar!");

        closePayPopup();
        loadBooks();

      } catch (err) {
        console.error("Gagal bayar:", err);
      }
    });
  }
});

function renderAvailableBooks(books, activeLoans) {
  let availableHtml = "<table><tr><th>Judul</th><th>Penulis</th><th>Kategori</th><th>Jumlah</th><th>Pinjam</th></tr>";

  const borrowedIds = activeLoans.map(l => l.book._id);

  books.forEach(book => {
    if (book.availableCopies > 0 && book.isActive && !borrowedIds.includes(book._id)) {
      availableHtml += `<tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.category}</td>
        <td>${book.availableCopies}</td>
        <td><button onclick="goToBorrowPage('${book._id}')">Pinjam</button></td>
      </tr>`;
    }
  });

  availableHtml += "</table>";
  document.getElementById("availableBooks").innerHTML = availableHtml;
}

async function searchBooksByCategory() {
  const category = document.getElementById("searchCategory").value;

  if (!category) {
    alert("Pilih kategori dulu!");
    return;
  }

  const res = await fetch(`${API_URL}/books?category=${category}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const result = await res.json();
  const books = result.data?.books || [];

  renderAvailableBooks(books, []);
}

function goToBorrowPage(id) {
  window.location.href = `borrow.html?id=${id}`;
}

function goToReturnPage(id) {
  window.location.href = `return.html?id=${id}`;
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

window.onload = loadBooks;