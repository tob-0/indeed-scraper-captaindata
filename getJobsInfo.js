const puppeteer = require('puppeteer')
const utils = require('./utils')

let storedData = utils.importJSON('bot-links.json')

;(async (links) =>{
    const browser = await puppeteer.launch({headless: true,slowMo:1}) // For debugging, allows to see what's happening + Slow motion (delay by 250ms)
    const page = await browser.newPage()
    for (const link of links) {
        await page.goto(link, {
            waitUntil: 'networkidle2',
        })
        
    }
})(storedData)