const fs = require('fs')

fs.readFile('node.png', (error, buffer) => {
    console.log('readed file')
    fs.writeFile('nodejs.png', buffer, (err) => {
        console.log('writed file')
    })
})