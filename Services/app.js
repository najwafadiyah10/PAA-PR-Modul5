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

async function addBook(bookData) {
  try {
    const res = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });
    const result = await res.json();
    console.log("Tambah buku:", result);
    return result;
  } catch (error) {
    console.error("Gagal menambah buku:", error);
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

async function updateBook(bookId, bookData) {
  try {
    const res = await fetch(`${API_URL}/books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });
    const result = await res.json();
    console.log("Update buku:", result);
    return result;
  } catch (error) {
    console.error("Gagal mengupdate buku:", error);
  }
}

async function deleteBookAPI(bookId) {
  try {
    const res = await fetch(`${API_URL}/books/${bookId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    console.log("Hapus buku:", result);
    return result;
  } catch (error) {
    console.error("Gagal menghapus buku:", error);
    return { message: "Terjadi kesalahan saat menghapus buku." };
  }
}


function renderBooks(books) {
  const role = localStorage.getItem("role");
  let html = "<table border='1'><tr><th>Judul</th><th>Penulis</th><th>Aksi</th></tr>";

  if (Array.isArray(books) && books.length > 0) {
    books.forEach(book => {
      html += `<tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>`;
      if (role === "member") {
        html += `<button onclick="borrowBook('${book._id}')">Pinjam</button>`;
      }
      if (role === "admin") {
        html += `<button onclick="editBook('${book._id}')">Edit</button>
                 <button onclick="deleteBook('${book._id}')">Hapus</button>`;
      }
      html += `</td></tr>`;
    });
  } else {
    html += `<tr><td colspan="3">Tidak ada data buku.</td></tr>`;
  }

  html += "</table>";
  if (role === "admin") {
    html += `<br><button onclick="openPopup()">Tambah Buku</button>`;
  }

  document.getElementById("bookList").innerHTML = html;
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


async function returnBook(borrowingId) {
  try {
    const res = await fetch(`${API_URL}/borrowings/${borrowingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const result = await res.json();
    console.log("Kembalikan buku:", result);
    alert(result.message || "Buku berhasil dikembalikan!");
    return result;
  } catch (error) {
    console.error("Gagal mengembalikan buku:", error);
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


async function getFines() {
  try {
    const res = await fetch(`${API_URL}/fines`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    console.log("Denda:", result);
    return result.data || [];
  } catch (error) {
    console.error("Gagal mengambil data denda:", error);
    return [];
  }
}