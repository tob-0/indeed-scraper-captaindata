const cards = require('./getLinks')
const jobs = require('./getJobsInfo')
const utils = require('./utils')

cards.getLinks('Python','Paris (75)')

let storedLinks = utils.importJSON('bot-links.json')

jobs.getInfo(storedLinks,true)