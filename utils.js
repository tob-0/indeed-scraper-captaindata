module.exports = {
    importJSON: (path) => {
            try {
                return JSON.parse(fs.readFileSync(path,'utf8'))
            } catch (err) {
                console.error(err)
            }
        }
}