const puppeteer = require('puppeteer')
const utils = require('./utils')

let storedData = utils.importJSON('bot-links.json')

;(async (links) =>{
    const browser = await puppeteer.launch({headless: true,slowMo:0})
    const page = await browser.newPage()
    let jobObjects = []
    for (const link of links) {
        await page.goto(link, {
            waitUntil: 'networkidle2',
        })
        await page.waitForSelector('.jobsearch-JobInfoHeader-title')
        const jobTitle = await page.$eval('.jobsearch-JobInfoHeader-title', e => e.innerHTML)
        const jobDesc = await page.$eval('#jobDescriptionText', e => e.innerHTML)
        console.log(jobTitle)
        console.log(jobDesc)
        jobObjects.push({
            title: jobTitle,
            desc: jobDesc
        })

    }
    await browser.close()
})(storedData)