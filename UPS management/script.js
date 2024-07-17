document.getElementById('trackingButton').addEventListener('click', function() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('tracking').classList.remove('hidden');
    document.getElementById('services').classList.add('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('signup').classList.add('hidden');
});

document.getElementById('homeButton').addEventListener('click', function() {
    document.getElementById('tracking').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('services').classList.add('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('signup').classList.add('hidden');
});

document.getElementById('servicesButton').addEventListener('click', function() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('tracking').classList.add('hidden');
    document.getElementById('services').classList.remove('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('signup').classList.add('hidden');
});

document.getElementById('loginButton').addEventListener('click', function() {
    document.getElementById('tracking').classList.add('hidden');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('services').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('signup').classList.add('hidden');
});

document.getElementById('signupLink').addEventListener('click', function() {
    document.getElementById('tracking').classList.add('hidden');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('services').classList.add('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('signup').classList.remove('hidden');
});

document.getElementById('loginLink').addEventListener('click', function() {
    document.getElementById('tracking').classList.add('hidden');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('services').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('signup').classList.add('hidden');
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csv = e.target.result;
            const data = parseCSV(csv);
            displayTable(data);
        };
        reader.readAsText(file);
    }
});

function parseCSV(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

function displayTable(data) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';

    if (data.length === 0) return;

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    data.forEach(row => {
        const tr = document.createElement('tr');

        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    alert(`Logged in with email: ${email}`);
});

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    alert(`Signed up with email: ${email}`);
});
