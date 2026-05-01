const token = localStorage.getItem("token");

async function getBooks() {
  try {
    const res = await fetch(`${API_URL}/books`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    console.log("Books:", result);
    return result.data.books || [];
  } catch (error) {
    console.error("Gagal mengambil data buku:", error);
    return [];
  }
}

async function getBookById(bookId) {
  try {
    const res = await fetch(`${API_URL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    console.log("Detail buku:", result);
    // Pastikan ambil dari result.data.book atau result.data
    return result.data.book || result.data || null;
  } catch (error) {
    console.error("Gagal mengambil detail buku:", error);
    return null;
  }
}

async function borrowBook(bookId) {
  try {
    const res = await fetch(`${API_URL}/loans/borrow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bookId })
    });
    const result = await res.json();
    console.log("Pinjam buku:", result);
    return result;
  } catch (error) {
    console.error("Gagal meminjam buku:", error);
    return { message: "Terjadi kesalahan saat meminjam buku." };
  }
}

async function getLoans() {
  try {
    const res = await fetch(`${API_URL}/loans?timestamp=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    return result.data.loans || [];
  } catch (error) {
    console.error("Gagal mengambil daftar peminjaman:", error);
    return [];
  }
}
