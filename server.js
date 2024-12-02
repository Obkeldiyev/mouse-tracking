const express = require('express');
const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/screenshots', express.static(screenshotDir));

app.get('/screenshots', (req, res) => {
    fs.readdir(screenshotDir, (err, files) => {
        if (err) {
            console.error('Error reading screenshot directory:', err);
            res.status(500).json({ message: 'Failed to load screenshots' });
        } else {
            const screenshots = files.map(file => `/screenshots/${file}`);
            res.json(screenshots);
        }
    });
});

const startScreenshotTask = () => {
    setInterval(async () => {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = path.join(screenshotDir, `screenshot-${timestamp}.png`);
            await screenshot({ filename: screenshotPath });
        } catch (error) {
            console.error('Error taking screenshot:', error);
        }
    }, 6000);
};

startScreenshotTask();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
