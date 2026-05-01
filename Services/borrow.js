// Ambil ID buku dari URL
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

async function loadBookDetail() {
  const book = await getBookById(bookId); 
  if (!book) {
    document.getElementById("bookDetail").innerHTML = "<p>Data buku tidak ditemukan.</p>";
    return;
  }

  document.getElementById("bookDetail").innerHTML = `
    <p><strong>Judul:</strong> ${book.title}</p>
    <p><strong>Penulis:</strong> ${book.author}</p>
    <p><strong>Kategori:</strong> ${book.category}</p>
    <p><strong>Penerbit:</strong> ${book.publisher}</p>
    <p><strong>Tahun Terbit:</strong> ${book.publishYear}</p>
    <p><strong>Deskripsi:</strong> ${book.description}</p>
    <p><strong>Lokasi Rak:</strong> ${book.location}</p>
    <p><strong>Jumlah Salinan Tersedia:</strong> ${book.availableCopies}</p>
  `;
}

async function borrowThisBook() {
  const res = await borrowBook(bookId);
  alert(res.message || "Peminjaman berhasil!");
  window.location.href = "index.html";
}

window.onload = loadBookDetail;
