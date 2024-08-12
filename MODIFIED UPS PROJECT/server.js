const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON bodies
app.use(express.json());

// Route to upload CSV files
app.post('/upload', upload.array('files'), (req, res) => {
    const { startDate, endDate } = req.body;
    const results = [];
    let totalEntries = 0;
    let batteryModeEntries = 0;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Process each file
    const filePromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, 'uploads', file.filename);

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const date = new Date(row['Date']); // Adjust the column name accordingly
                    const inputVoltage = parseFloat(row['InputVolt1(V)']); // Adjust the column name accordingly

                    if (date >= start && date <= end) {
                        totalEntries++;
                        if (inputVoltage === 0) {
                            batteryModeEntries++;
                        }
                        results.push(row);
                    }
                })
                .on('end', () => {
                    fs.unlinkSync(filePath); // Remove the file after processing
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    });

    Promise.all(filePromises)
        .then(() => {
            res.json({
                totalEntries,
                batteryModeEntries,
                ratio: totalEntries > 0 ? (batteryModeEntries / totalEntries).toFixed(4) : 0,
                data: results
            });
        })
        .catch(error => {
            res.status(500).json({ error: 'An error occurred while processing the files' });
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
