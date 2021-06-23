const fs = require('fs')

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
    }
}