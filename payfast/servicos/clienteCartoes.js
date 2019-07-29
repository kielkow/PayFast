const restify = require('restify')
const clients = require('restify-clients')

const cliente = clients.createJSONClient({
    url: 'http://localhost:3001',
    version: '~1.0'
})

cliente.post('/cartoes/autoriza', cartao,
    function (erro, req, res, retorno) {
        console.log('consumindo serviço de cartoes');
        console.log(retorno)
    }
)