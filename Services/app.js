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