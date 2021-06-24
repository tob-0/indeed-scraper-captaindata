const puppeteer = require('puppeteer')
const utils = require('./utils')

let storedLinks = utils.importJSON('bot-links.json')

;(async (links,CSVExport) =>{
    CSVExport
    const browser = await puppeteer.launch({headless: true,slowMo:0})
    const page = await browser.newPage()
    let jobs = {
        count: 0,
        items:[]
    }
    for (const link of links) {
        await page.goto(link, {
            waitUntil: 'networkidle2',
        })
        await page.waitForSelector('.jobsearch-JobInfoHeader-title')
        const jobTitle = await page.$eval('.jobsearch-JobInfoHeader-title', e => e.innerHTML)
        const jobDesc = await page.$eval('#jobDescriptionText', e => e.innerHTML)
        jobs.items.push({
            title: jobTitle,
            desc_html: jobDesc,
            desc_md: utils.convertHTML(jobDesc,true),
            desc_text: utils.convertHTML(jobDesc,false),
            link: link
        })

    }
    await browser.close()
    jobs.count = jobs.items.length
    let storedData = utils.importJSON('bot-jobs.json')
    let uniqData = utils.compareData(storedData.items, jobs.items)
    jobs.items = uniqData
    utils.exportToJSON(jobs, 'bot-jobs.json')

    
    if (CSVExport) utils.exportToCSV(uniqData.items,'bot-jobs.csv') // Ne fonctionne pas, je suis pas sur de pourquoi mais j'ai pas trop le temps de debug

})(storedLinks,true)