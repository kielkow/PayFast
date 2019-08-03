const fs = require('fs')

const file = process.argv[2]

fs.readFile(file, (error, buffer) => {
    console.log('readed file')

    fs.writeFile('new-' + file, buffer, (err) => {
        console.log('writed file')
    })

})