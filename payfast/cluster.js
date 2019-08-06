const cluster = require('cluster')
const os = require('os')

const cpus = os.cpus()
//console.log(cpus)

if (cluster.isMaster) {
    console.log('thread master')

    cpus.forEach(() => {
        cluster.fork()
    })
}

else {
    console.log('thread slave')
    require('./index')
}
