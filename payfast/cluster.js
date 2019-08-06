const cluster = require('cluster')

console.log('executando cluster')

if(cluster.isMaster){
    console.log('is master')
    cluster.fork()
}
else{
    console.log('is slave')
}
