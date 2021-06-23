const puppeteer = require('puppeteer');


(async () =>{
    const browser = await puppeteer.launch({headless: false,slowMo:1}) // For debugging, allows to see what's happening + Slow motion (delay by 250ms)
    const page = await browser.newPage()
    await page.goto('https://fr.indeed.com/jobs?q=Python&l=Paris%20(75)', {
        waitUntil: 'networkidle2',
    }) // Go to indeed's website

    /*
        Au final, je vais direct sur la page de la recherche, parce aue modifie l'attribut value de l'input n'a pas l'air de marcher
        J'aurais pu faire un 'keyboard.type' pour ecrire dedans, mais je trouvais pas ca tres elegant, 
            donc a la place ce sera une modf des params de l'URL 'q' & 'l'

    // WhatWhere Form handling
    await page.$eval('#text-input-what', what => what.value = 'Developpeur Python') // Set the "What"
    await page.$eval('#text-input-where', where => where.value = 'Paris (75)') // Set the "Where"
    await page.click('button.icl-WhatWhere-button') // Submit the search
    */
    try {
        await page.waitForSelector('div.jobsearch-SerpJobCard')
        const vjkDataAdvn = await page.$$eval('div.jobsearch-SerpJobCard', e =>e.map(x=>[x.getAttribute('data-jk'), x.getAttribute('data-empn')]))
    } catch (error) {
        console.log(error)
    }
    await browser.close()
})()