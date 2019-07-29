const restify = require('restify')
const clients = require('restify-clients')

function CartoesClient() {
    this._cliente = clients.createJSONClient({
        url: 'http://localhost:3001',
        version: '~1.0'
    })
}


CartoesClient.prototype.autoriza = (cartao, callback) => {
    this._cliente.post('/cartoes/autoriza', cartao, callback)
}

module.exports = () => {
    return CartoesClient
}