document.getElementById('fileInput').addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length === 0) {
        return;
    }
    const promises = [];
    for (let i = 0; i < files.length; i++) {
        promises.push(readFile(files[i]));
    }
    Promise.all(promises).then(results => {
        // Process CSV data
        const { totalEntries, batteryModeEntries, filteredData } = processCSV(results);

        // Update HTML with results
        document.getElementById('totalEntries').textContent = totalEntries;
        document.getElementById('batteryEntries').textContent = batteryModeEntries;
        document.getElementById('ratio').textContent = (totalEntries > 0 ? (batteryModeEntries / totalEntries) : 0).toFixed(4);

        // Update the pie chart
        updateChart(totalEntries, batteryModeEntries);

        // Generate and download Excel file
        downloadExcel(filteredData);
    });
});

document.getElementById('processButton').addEventListener('click', function() {
    document.getElementById('fileInput').dispatchEvent(new Event('change'));
});


document.getElementById('exportButton').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const totalEntries = document.getElementById('totalEntries').textContent;
    const batteryModeEntries = document.getElementById('batteryEntries').textContent;
    const ratio = document.getElementById('ratio').textContent;

    doc.text('UPS Management Dashboard Report', 10, 10);
    doc.text(`Total Entries: ${totalEntries}`, 10, 20);
    doc.text(`Battery Mode Entries: ${batteryModeEntries}`, 10, 30);
    doc.text(`Ratio: ${ratio}`, 10, 40);

    doc.save('UPS_Dashboard_Report.pdf');
});

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsText(file);
    });
}

function processCSV(texts) {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    let totalEntries = 0;
    let batteryModeEntries = 0;
    let filteredData = [];
    let zeroVoltageData = []; // For entries with input voltage of 0
    let headers = [];

    texts.forEach(text => {
        const rows = text.trim().split('\n');
        if (rows.length > 0) {
            headers = rows.shift().split(',');
            filteredData.push(headers);

            rows.forEach(rowText => {
                const cells = rowText.split(',');
                const dateIndex = headers.indexOf('Date'); // Replace 'Date' with the actual date column name
                const inputVoltageIndex = headers.indexOf('InputVolt1(V)');

                if (dateIndex !== -1 && inputVoltageIndex !== -1) {
                    const date = new Date(cells[dateIndex].trim());
                    const inputVoltage = parseFloat(cells[inputVoltageIndex].trim());

                    if (date >= startDate && date <= endDate) {
                        totalEntries++;
                        if (inputVoltage === 0) {
                            batteryModeEntries++;
                            zeroVoltageData.push(cells);
                        }
                        filteredData.push(cells);
                    }
                }
            });
        }
    });

    return { totalEntries, batteryModeEntries, filteredData, zeroVoltageData };
}


    return { totalEntries, batteryModeEntries, filteredData };


function downloadExcel(data) {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UPS Data');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'UPS_Data.xlsx';
    link.click();
}

function updateChart(total, batteryMode) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    const data = {
        labels: ['Total Entries', 'Battery Mode Entries'],
        datasets: [{
            data: [total, batteryMode],
            backgroundColor: ['#36a2eb', '#ff6384']
        }]
    };

    if (window.myPieChart) {
        window.myPieChart.destroy();
    }

    window.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let label = tooltipItem.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += Math.round(tooltipItem.raw * 100 / (total + batteryMode)) + '%';
                            return label;
                        }
                    }
                }
            }
        }
    });
}
document.getElementById('fileInput').addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length === 0) {
        return;
    }
    const promises = [];
    for (let i = 0; i < files.length; i++) {
        promises.push(readFile(files[i]));
    }
    Promise.all(promises).then(results => {
        // Process CSV data
        const { totalEntries, batteryModeEntries, filteredData, zeroVoltageData } = processCSV(results);

        // Update HTML with results
        document.getElementById('totalEntries').textContent = totalEntries;
        document.getElementById('batteryEntries').textContent = batteryModeEntries;
        document.getElementById('ratio').textContent = (totalEntries > 0 ? (batteryModeEntries / totalEntries) : 0).toFixed(4);

        // Update the pie chart
        updateChart(totalEntries, batteryModeEntries);

        // Generate and download Excel file
        downloadExcel(filteredData);

        // Display zero voltage entries
        displayZeroVoltageEntries(zeroVoltageData);
    });
});

function displayZeroVoltageEntries(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    // Clear existing table content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="100%">No entries with input voltage 0.</td></tr>';
        return;
    }

    // Create table headers
    const headers = data[0]; // Assuming the first row is the header
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    // Create table rows
    data.forEach((row, index) => {
        if (index > 0) { // Skip header row
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        }
    });
}
