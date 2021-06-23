const fs = require('fs')

function replaceParagraph(htmlString) {
    return htmlString.replace(/<\/p>/g,'\n').replace(/<p *>/g,'')
}

function replaceBRTags(htmlString) {
    return htmlString.replace(/<br>/g,'\n')
}

function replaceInlineFormatting(htmlString,markdown) {
    return markdown ? htmlString.replace(/<\/?i *>/g,'*').replace(/<\/?b *>/g,'**') : htmlString.replace(/<\/?[ib] *>/g,'')
}

function replaceLists(htmlString) {
    return htmlString.replace(/<\/?[ou]l *>/g,'').replace(/<li *>/g,'- ' ).replace(/<\/li>/g,'\n') 
}

function replaceUnbreakableSpaces(htmlString) {
    return htmlString.replace(/&nbsp;/g,' ')
}

function replaceHeaders(htmlString,markdown) {
    if (!markdown) htmlString=htmlString.replace(/<h[1-6]*>/g,'')
    else htmlString =  htmlString.replace(/<h[1-6]>/g, (tag)=>'#'.repeat(parseInt(tag.match(/[1-6]/)))+' ')
    return htmlString.replace(/<\/h[1-6]>/g,'\n\n')
}

function clearTags(htmlString) {
    return htmlString.replace(/(<([^>]+)>)/ig,'')
}

module.exports = {
    importJSON: (path) => {
            try {
                return JSON.parse(fs.readFileSync(path,'utf8'))
            } catch (err) {
                console.error(err)
            }
    },
    exportToJSON: (data,path) => {
        let jsonifiedData = JSON.stringify(data)
        fs.writeFile(path,jsonifiedData,'utf8',e=> {
            if (e) return e
        })
        return true
    },  
    compareData:(d0,d1)=>{
        let concatData = d0.concat(d1)
        return concatData.filter((value,index,self)=>self.indexOf(value) === index)
    },
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
    }
}