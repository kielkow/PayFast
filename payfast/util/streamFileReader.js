const fs = require('fs')

const file = process.argv[2]

fs.createReadStream(file)
    .pipe(fs.createWriteStream('new-' + file))
    .on('finish', () => {
        console.log('file writed with stream')
    }) 