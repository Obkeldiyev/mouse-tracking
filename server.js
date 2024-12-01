const express = require('express');
const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Create a folder for storing screenshots if it doesn't exist
const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
}

// API to take a full-screen screenshot
app.get('/take-screenshot', async (req, res) => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = path.join(screenshotDir, `screenshot-${timestamp}.png`);
        await screenshot({ filename: screenshotPath });
        res.json({ message: 'Screenshot taken', path: screenshotPath });
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({ message: 'Failed to take screenshot', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
