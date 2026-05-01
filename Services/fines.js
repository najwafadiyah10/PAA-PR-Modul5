async function loadFines() {
  const res = await fetch(`${API_URL}/fines`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const result = await res.json();
  const fines = result.data?.fines || [];

  let html = "<table><tr><th>Loan ID</th><th>Jumlah</th><th>Alasan</th><th>Catatan</th><th>Aksi</th></tr>";
  if (fines.length > 0) {
    fines.forEach(fine => {
      html += `<tr>
        <td>${fine.loanId}</td>
        <td>${fine.amount}</td>
        <td>${fine.reason}</td>
        <td>${fine.notes || "-"}</td>
        <td>
          <button onclick="editFine('${fine._id}')">Edit</button>
          <button onclick="deleteFine('${fine._id}')">Hapus</button>
        </td>
      </tr>`;
    });
  } else {
    html += `<tr><td colspan="5">Belum ada denda.</td></tr>`;
  }
  html += "</table>";
  document.getElementById("fineList").innerHTML = html;
}

async function createFine(event) {
  event.preventDefault();
  const loanId = document.getElementById("loanId").value;
  const amount = parseInt(document.getElementById("fineAmount").value, 10);
  const reason = document.getElementById("fineReason").value;
  const notes = document.getElementById("fineNotes").value;

  const res = await fetch(`${API_URL}/fines`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ loanId, amount, reason, notes })
  });
  const result = await res.json();
  alert(result.message || "Denda berhasil ditambahkan!");
  loadFines();
}

window.onload = loadFines;
