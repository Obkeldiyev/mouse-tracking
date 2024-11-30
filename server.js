const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API to take a screenshot
app.get('/screenshot', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle2' });
    const timestamp = Date.now();
    const screenshotPath = `screenshots/screenshot-${timestamp}.png`;

    await page.screenshot({ path: screenshotPath });
    await browser.close();

    res.json({ message: 'Screenshot taken', path: screenshotPath });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
