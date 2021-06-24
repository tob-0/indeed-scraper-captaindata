const fs = require('fs')

/**
 * Removes <p></p> tags from an HTML string, putting a line-feed after.
 * 
 * @param {string} htmlString HTML string in which you want to remove <p> tags
 * @returns String, escaped of <p> tags
 */
function replaceParagraph(htmlString) {
    return htmlString.replace(/<\/p>/g,'\n').replace(/<p *>/g,'')
}

/**
 * Replaces <br> tags by a line-feed from an HTML string.
 * 
 * @param {string} htmlString HTML string in which you want to replace <br> tags
 * @returns String, escaped of <br> tags
 */
function replaceBRTags(htmlString) {
    return htmlString.replace(/<br>/g,'\n')
}

/**
 * Replaces inline formatting tags by either nothing, or its equivalent in Markdown.
 * 
 * @param {string} htmlString HTML string in which you want to remove or replace <i>/<b> tags by their MD equivalent (if 'markdown' is set to 'true')
 * @param {boolean} markdown Set to true for markdown conversion
 * @returns String, escaped of <i>/<b> tags
 */
function replaceInlineFormatting(htmlString,markdown) {
    return markdown ? htmlString.replace(/<\/?i *>/g,'*').replace(/<\/?b *>/g,'**') : htmlString.replace(/<\/?[ib] *>/g,'')
}

/**
 * Replaces lists to unordonned - lists
 * 
 * @param {string} htmlString HTML string in which you want to replace <li> tags by a dash
 * @returns String, escaped of <ol>/<ul> & <li> tags
 */
function replaceLists(htmlString) {
    return htmlString.replace(/<\/?[ou]l *>/g,'').replace(/<li *>/g,'- ' ).replace(/<\/li>/g,'\n') 
}

/**
 * Replaces '&nbsp;' by an actual space
 * 
 * @param {string} htmlString HTML string in which you want to replace '&nbsp;' by an actual space
 * @returns String, with replaced &nbsp;
 */
function replaceUnbreakableSpaces(htmlString) {
    return htmlString.replace(/&nbsp;/g,' ')
}

/**
 * Replaces <h1-6> tags to their equivalent in Markdown, or removes them
 * 
 * @param {string} htmlString HTML string in which you want to replace the header tags
 * @param {boolean} markdown Set to true for markdown conversion, instead of deletion
 * @returns String, with replaced headers by their markdown equivalent, or nothing if markdown=false
 */
function replaceHeaders(htmlString,markdown) {
    if (!markdown) htmlString=htmlString.replace(/<h[1-6]*>/g,'')
    else htmlString =  htmlString.replace(/<h[1-6]>/g, (tag)=>'#'.repeat(parseInt(tag.match(/[1-6]/)))+' ')
    return htmlString.replace(/<\/h[1-6]>/g,'\n\n')
}


/**
 * Removes all HTML tags
 * 
 * @param {string} htmlString HTML string in which you want to remove all tags
 * @returns String, escaped of (nearly) every tags
 */
function clearTags(htmlString) {
    return htmlString.replace(/(<([^>]+)>)/ig,'')
}

module.exports = {
    /**
     * Imports a JSON file as an object.
     * @param {string} path Path to the JSON file to import
     * @returns Object
     */
    importJSON: (path) => {
            try {
                return JSON.parse(fs.readFileSync(path,'utf8'))
            } catch (err) {
                console.log('An error occured while importing JSON: '+err.mesage)
            }
    },
    /**
     * Exports an object to a specified JSON file.
     * @param {Object} data Object to export as JSON
     * @param {string} path Path of the JSON file
     * @returns boolean
     */
    exportToJSON: (data,path) => {
        try {
        let jsonifiedData = JSON.stringify(data)
        fs.writeFile(path,jsonifiedData,'utf8',e=> {
            if (e) return e
        })
        return true
    } catch (err) {
        console.log('An error occured while exporting to CSV: '+ err.message)
        return false
    }
    },
    /**
     * Returns an Array containing the unique values after the concatenation of Array_0 and Array_1.
     * @param {Array} d0 Array_0
     * @param {Array} d1 Array_1
     * @returns {(Array|boolean)}
     */
    compareData:(d0,d1)=>{
        try {
            let concatData = d0.concat(d1)
            return concatData.filter((value,index,self)=>self.indexOf(value) === index)
        } catch (err) {
            console.log('An arror occured while comparing data: '+err.message)
            return false
        }
    },
    /**
     * Converts HTML to either markdown or plain text.
     * @param {string} html HTML string to convert
     * @param {boolean} markdown Set to true for Markdown conversion, false for Plain text
     * @returns string
     */
    convertHTML: (html, markdown)=>{
        return clearTags(
                replaceUnbreakableSpaces(
                replaceParagraph(
                    replaceBRTags(
                        replaceLists(
                            replaceInlineFormatting(
                                replaceHeaders(html,
                                    markdown)
                                , markdown)
                        )
                    )
                )
            )
        )
    },
    /**
     * Exports an object to a CSV file.
     * @param {Object} data Object to save as CSV 
     * @param {*} path Path of the CSV file
     * @returns boolean
     */
    exportToCSV: (data,path) => {
        try {
            let nullValueReplacer = (k,v)=>v===null?'N/A':v
            let header = Object.keys(data[0])
            let csv = [header.join(','),...data.map(row=>header.map(field=>JSON.stringify(row[field],nullValueReplacer)).join(','))].join('\r\n') //https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
            fs.writeFile(path,csv,'utf8',e=>e?e:'')
            return true
        } catch (err) {
            console.log('An error occured while exporting to CSV: '+ err.message)
            return false
        }
    }
}