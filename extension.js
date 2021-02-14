
module.exports = {
    file: () => {
        var fs = require('fs')
        fs.readFile('huge.crx', 'base64', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            crx('data')
        })
        // module.exports={
        crx: (data) => {
            console.log(data)
            return data
        }
        // }
    },
}