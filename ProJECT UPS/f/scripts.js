document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) {
      return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
      const text = e.target.result;
      displayCSV(text);
  };
  reader.readAsText(file);
});

function displayCSV(text) {
  const rows = text.trim().split('\n');
  const tableBody = document.querySelector('#upsTable tbody');
  const headers = rows.shift().split(','); // Get headers from the first row

  // Clear the table body
  tableBody.innerHTML = '';

  // Create table headers
  const thead = document.querySelector('#upsTable thead');
  thead.innerHTML = '';
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText.trim();
      headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Populate table rows with data
  rows.forEach(rowText => {
      const cells = rowText.split(',');
      const tr = document.createElement('tr');
      cells.forEach(cellText => {
          const td = document.createElement('td');
          td.textContent = cellText.trim();
          tr.appendChild(td);
      });
      tableBody.appendChild(tr);
  });
}
