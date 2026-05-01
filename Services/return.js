const params = new URLSearchParams(window.location.search);
const loanId = params.get("id");

async function loadLoanDetail() {
  try {
    const res = await fetch(`${API_URL}/loans/${loanId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();

    const loan = result.data?.loan || null;

    if (!loan) {
      document.getElementById("loanDetail").innerHTML = "<p>Data peminjaman tidak ditemukan.</p>";
      return;
    }

    const book = loan.book || {};
    const title = book.title || "(judul tidak tersedia)";
    const author = book.author || "(penulis tidak tersedia)";
    const loanDate = loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : "-";
    const dueDate = loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "-";
    const returnDate = loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : "-";
    const status = loan.status || "-";

    document.getElementById("loanDetail").innerHTML = `
      <p><strong>Kode Peminjaman:</strong> ${loan.loanCode}</p>
      <p><strong>Judul Buku:</strong> ${title}</p>
      <p><strong>Penulis:</strong> ${author}</p>
      <p><strong>Tanggal Pinjam:</strong> ${loanDate}</p>
      <p><strong>Batas Pengembalian:</strong> ${dueDate}</p>
      <p><strong>Tanggal Dikembalikan:</strong> ${returnDate}</p>
      <p><strong>Status:</strong> ${status}</p>
    `;
  } catch (error) {
    console.error("Gagal mengambil detail peminjaman:", error);
    document.getElementById("loanDetail").innerHTML = "<p>Terjadi kesalahan saat memuat data peminjaman.</p>";
  }
}

async function returnThisBook() {
  try {
    const res = await fetch(`${API_URL}/loans/${loanId}/return`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    alert(result.message || "Buku berhasil dikembalikan!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Gagal mengembalikan buku:", error);
    alert("Terjadi kesalahan saat mengembalikan buku.");
  }
}

window.onload = loadLoanDetail;
