const memcached = require('memcached')

function createMemcachedClient() {
    const cliente = memcached('localhost:11211', {
        retries: 10,
        retry: 10000,
        remove: true
    })

    return cliente
}

module.exports = () => {
    return createMemcachedClient()
}