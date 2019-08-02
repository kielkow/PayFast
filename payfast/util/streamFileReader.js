const fs = require('fs')

fs.createReadStream('node.png')
    .pipe(fs.createWriteStream('node-stream.png'))
    .on('finish', () => {
        console.log('file writed with stream')
    }) 