const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const csvFolderPath = 'csv.file';

// Enable CORS for all requests (simplest way for development purposes)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Endpoint to get folders (assuming subfolders in the CSV folder)
app.get('/api/getFolders', (req, res) => {
    fs.readdir(csvFolderPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Failed to read directory' });
        }
        const folders = files.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
        res.json({ folders });
    });
});

// Endpoint to get files in a specific folder
app.get('/api/getFiles', (req, res) => {
    const { folder } = req.query;
    const folderPath = path.join(csvFolderPath, folder);
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Failed to read directory' });
        }
        const csvFiles = files.filter(file => path.extname(file) === '.csv');
        res.json({ files: csvFiles });
    });
});

// Endpoint to get data from a specific file
app.get('/api/getFileData', (req, res) => {
    const { folder, file } = req.query;
    const filePath = path.join(csvFolderPath, folder, file);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        // Assuming the CSV file is comma-separated and the first row is the header
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => {
            const values = line.split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            return row;
        });
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
