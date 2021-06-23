const puppeteer = require('puppeteer')
const fs = require('fs')
const utils = require('./utils')

function urlFormatter(q,l,advn,vjk) {
    return advn===null ? encodeURI(`https://fr.indeed.com/jobs?q=${q}&l=${l}&vjk=${vjk}`) : encodeURI(`https://fr.indeed.com/jobs?q=${q}&l=${l}&advn=${advn}&vjk=${vjk}`)
}

function exportToJSON(data,path) {
    let jsonifiedData = JSON.stringify(data)
    fs.writeFile(path,jsonifiedData,'utf8',e=> {
        if (e) return e
    })
    return true
}


function compareData(d0,d1) {
    let concatData = d0.concat(d1)
    return concatData.filter((value,index,self)=>self.indexOf(value) === index)
}

(async () =>{
    const browser = await puppeteer.launch({headless: true,slowMo:1}) // For debugging, allows to see what's happening + Slow motion (delay by 250ms)
    const page = await browser.newPage()
    await page.goto('https://fr.indeed.com/jobs?q=Python&l=Paris%20(75)', {
        waitUntil: 'networkidle2',
    }) // Go to indeed's website

    /*
        Au final, je vais direct sur la page de la recherche, parce que modifier l'attribut value de l'input n'a pas l'air de marcher
        J'aurais pu faire un 'keyboard.type' pour ecrire dedans, mais je trouvais pas ca tres elegant, 
            donc a la place ce sera une modf des params de l'URL 'q' & 'l'

    // WhatWhere Form handling
    await page.$eval('#text-input-what', what => what.value = 'Developpeur Python') // Set the "What"
    await page.$eval('#text-input-where', where => where.value = 'Paris (75)') // Set the "Where"
    await page.click('button.icl-WhatWhere-button') // Submit the search
    */
    await page.waitForSelector('div.jobsearch-SerpJobCard')
    const jobsData = await page.$$eval('div.jobsearch-SerpJobCard', e =>e.map(x=>[x.getAttribute('data-empn'),x.getAttribute('data-jk')]))
    let jobsLinks = []
    jobsData.forEach(jobData=>jobsLinks.push(urlFormatter('Python','Paris%20(75)',jobData[0],jobData[1])))
    let storedData = utils.importJSON('bot-links.json')
    let jobsLinksUniq = compareData(storedData, jobsLinks)
    exportToJSON(jobsLinksUniq,'bot-links.json')
    console.log(jobsLinksUniq)
    await browser.close()
})()