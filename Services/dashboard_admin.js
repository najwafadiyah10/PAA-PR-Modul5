let editMode = false;
let editId = null;

// ================= LOAD DATA =================
async function loadBooks() {
  try {
    const books = await getBooks();

    let html = `<div class="book-grid">`;

    if (Array.isArray(books) && books.length > 0) {
      books.forEach(book => {
        html += `
          <div class="book-card">
            <h4>${book.title}</h4>
            <p><strong>Penulis:</strong> ${book.author}</p>
            <p><strong>Kategori:</strong> ${book.category}</p>
            <p><strong>Jumlah:</strong> ${book.totalCopies}</p>

            <div class="card-actions">
              <button class="btn btn-warning" onclick="editBook('${book._id}')">Edit</button>
              <button class="btn btn-danger" onclick="deleteBook('${book._id}')">Hapus</button>
            </div>
          </div>
        `;
      });
    } else {
      html += `<p>Tidak ada data buku.</p>`;
    }

    html += `</div>`;
    document.getElementById("bookList").innerHTML = html;

  } catch (error) {
    console.error("Gagal load buku:", error);
  }
}

// ================= DELETE =================
async function deleteBook(id) {
  if (!confirm("Yakin mau hapus buku ini?")) return;

  try {
    await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    loadBooks();
  } catch (error) {
    console.error("Gagal hapus:", error);
  }
}

// ================= EDIT =================
async function editBook(id) {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    const book = result.data.book;

    // isi form popup
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("publisher").value = book.publisher;
    document.getElementById("publishYear").value = book.publishYear;
    document.getElementById("category").value = book.category;
    document.getElementById("description").value = book.description;
    document.getElementById("totalCopies").value = book.totalCopies;
    document.getElementById("location").value = book.location;

    editMode = true;
    editId = id;

    document.getElementById("popupTitle").innerText = "Edit Buku";
    openPopup();

  } catch (error) {
    console.error("Gagal ambil data buku:", error);
  }
}

// ================= TAMBAH / UPDATE =================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addBookForm");

  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();

      const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        isbn: document.getElementById("isbn").value,
        publisher: document.getElementById("publisher").value,
        publishYear: parseInt(document.getElementById("publishYear").value),
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        totalCopies: parseInt(document.getElementById("totalCopies").value),
        location: document.getElementById("location").value
      };

      try {
        if (editMode) {
          // UPDATE
          await fetch(`${API_URL}/books/${editId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
          });
        } else {
          // CREATE
          await fetch(`${API_URL}/books`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
          });
        }

        closePopup();
        loadBooks();

      } catch (error) {
        console.error("Gagal simpan:", error);
      }
    });
  }
});

// ================= POPUP =================
function openPopup() {
  document.getElementById("popupForm").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closePopup() {
  document.getElementById("popupForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";

  document.getElementById("addBookForm").reset();
  document.getElementById("popupTitle").innerText = "Tambah Buku";

  editMode = false;
  editId = null;
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ================= INIT =================
window.onload = loadBooks;