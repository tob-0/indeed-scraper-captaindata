const cards = require('./getLinks')
const jobs = require('./getJobsInfo')
const utils = require('./utils')
const { existsSync } = require('fs')
const { exit, argv } = require('process')

if (existsSync('bot-links.json')&& existsSync('bot-jobs.json')) run(argv)
else {
    console.log('The required JSON files do not exist, creating them.')
    if (utils.createJSONFiles()) run()
    else console.log('Cannot create JSON files, exiting.'); exit(-1)
}

async function run(args){
    console.log(args)
    if (args.includes('-h') === true && args.length > 2){
        console.log('Usage: node main.js <what> <where>')
        return 0
    } else if(args.length < 4){
        console.log('You must provide what you\'re looking for, and where you\'re looking for. (-h for help)')
        return -2
    } else {
        console.log(`Getting links for q=${args[2]} & l=${args[3]}`)
        cards.getLinks(args[2],args[3])
        let storedLinks = utils.importJSON('bot-links.json')
        await jobs.getInfo(storedLinks,true)
        return 0
    }
}