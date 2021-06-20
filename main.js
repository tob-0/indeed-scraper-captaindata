const puppeteer = require('puppeteer')

run = async _ => {
    const browser = await puppeteer.launch({headless: false,slowMo:250}) // For debugging, allows to see what's happening + Slow motion (delay by 250ms)
    const page = await browser.newPage()

    await page.goto('https://fr.indeed.com/', {
        waitUntil: 'networkidle2',
    }) // Go to indeed's website


    // WhatWhere Form handling
    await page.$eval('#text-input-what', what => what.value = 'Developpeur Python') // Set the "What"
    await page.$eval('#text-input-where', where => where.value = 'Paris (75)') // Set the "Where"
    await page.click('button.icl-WhatWhere-button') // Submit the search

    await browser.close()
}

run()