const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    const { url, viewport, await: awaitTime, fullPage } = req.query;

    const viewportArray = viewport.split('x').map(Number);
    const viewportWidth = viewportArray[0];
    const viewportHeight = viewportArray[1];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight
    });
    await page.goto(url, { waitUntil: 'networkidle2' });

    if (awaitTime) {
      await new Promise(resolve => setTimeout(resolve, Number(awaitTime)));
    }

    const screenshotOptions = {
      type: 'png',
      fullPage: fullPage === 'true'
    };

    const screenshotBuffer = await page.screenshot(screenshotOptions);

    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
