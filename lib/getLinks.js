const puppeteer = require('puppeteer')
const utils = require('./utils')


/**
 * Forge job URL from data
 * @param {string} q Query
 * @param {string} l location
 * @param {string} advn ?
 * @param {string} vjk JobKey
 * @returns string
 */
function urlFormatter(q,l,advn,vjk) {
    return advn===null ? encodeURI(`https://fr.indeed.com/jobs?q=${q}&l=${l}&vjk=${vjk}`) : encodeURI(`https://fr.indeed.com/jobs?q=${q}&l=${l}&advn=${advn}&vjk=${vjk}`)
}

/**
 * Forge API url for specific job
 * @param {string} jk jobkey
 * @returns string
 */
function urlFormatterAPI(jk) {
    return `https://fr.indeed.com/viewjob?jk=${jk}&vjs=1`
}

module.exports = {
    /**
     * Get links of the different job offers listed on Indeed for a specific search, and put them into 'bot-links.json'.
     * 
     * @param {string} q What you are looking for on Indeed
     * @param {string} l Where you are looking for it
     */
    getLinks: async (q,l) =>{
        const browser = await puppeteer.launch({headless: true,slowMo:1}) // For debugging, allows to see what's happening + Slow motion (delay by 250ms)
        const page = await browser.newPage()
        q = encodeURI(q),l=encodeURI(l)
        await page.goto(`https://fr.indeed.com/jobs?q=${q}&l=${l})`, {
            waitUntil: 'networkidle2',
        }) // Go to indeed's website

        await page.waitForSelector('div.jobsearch-SerpJobCard').catch(err=>console.log('An error occured while waiting for job cards (Captcha ?): '+err.message))
        const jobsData = await page.$$eval('div.jobsearch-SerpJobCard', e =>e.map(x=>[x.getAttribute('data-empn'),x.getAttribute('data-jk')]))
        await browser.close()

        let jobsLinks = []
        jobsData.forEach(jobData=>jobsLinks.push([urlFormatter(q,l,jobData[0],jobData[1]),urlFormatterAPI(jobData[1])]))
        let storedData = utils.importJSON('bot-links.json')
        let jobsLinksUniq = utils.compareData(storedData, jobsLinks)
        utils.exportToJSON(jobsLinksUniq,'bot-links.json')
    }
}