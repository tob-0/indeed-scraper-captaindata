const puppeteer = require('puppeteer')

run = async _ => {
    const browser = await puppeteer.launch({headless: false}) // For debugging, allows to see what's happening 
    const page = await browser.newPage()

    await page.goto('https://fr.indeed.com/', {
        waitUntil: 'networkidle2',
    }) // Go to indeed's website
    // do sumthing
    await browser.close()
}

run()