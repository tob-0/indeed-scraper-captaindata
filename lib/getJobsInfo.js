const puppeteer = require('puppeteer')
const utils = require('./utils')
const fetch = require('node-fetch')

module.exports = {
    /**
     * Get the details of the job offers pointed to by 'links'.
     * 
     * @param {string[]} links An array of links, pointing to job offers
     * @param {boolean} CSVExport Set to 'true' if you want to export to csv
     */
    getInfo: async (links,CSVExport) =>{
        const browser = await puppeteer.launch({headless: true,slowMo:0})
        const page = await browser.newPage()
        let jobs = {
            count: 0,
            items:[]
        }
        for (const link of links) {
            let linkAPI = link[1]
            await page.goto(link[0], {
                waitUntil: 'networkidle2',
            })
            await page.waitForSelector('.jobsearch-JobInfoHeader-title')
            const jobTitle = await page.$eval('.jobsearch-JobInfoHeader-title', e => e.innerHTML)
            const jobDesc = await page.$eval('#jobDescriptionText', e => e.innerHTML)
            let data = await fetch(linkAPI).then(resp=>resp.json()).then(data=>data).catch(err=>console.log(err.message))

            let jobObject = {
                title: jobTitle,
                companyName: data.sicm.cmN,
                jobLocation: data.jobLocation,
                contractTypes: data.jtsT,
                salaryRange: data.ssT,
                salaryMin: data.sEx ? data.sEx.sRg.split(' - ')[0]:'Unknown',
                salaryMax: data.sEx ? data.sEx.sRg.split(' - ')[1]:'Unknown',
                desc_html: jobDesc,
                desc_md: utils.convertHTML(jobDesc,true),
                desc_text: utils.convertHTML(jobDesc,false),
                link: link[0]
            }
            
            jobs.items.push(jobObject)

    
        }
        await browser.close()
        jobs.count = jobs.items.length
        let storedData = utils.importJSON('bot-jobs.json')
        let uniqData = utils.compareData(storedData.items, jobs.items)
        jobs.items = uniqData
        utils.exportToJSON(jobs, 'bot-jobs.json')
    
        
        if (CSVExport) utils.exportToCSV(jobs.items,'bot-jobs.csv')
    
    }
}