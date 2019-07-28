const { validationResult } = require('express-validator')
const { check } = require('express-validator/check')

module.exports = (app) => {

    app.get('/pagamentos', function (req, res) {
        console.log('Rota /pagamentos ativada')
        res.send(
            'OK'
        )
    })

    app.delete('/pagamentos/pagamento/:id', function (req, res) {

        var pagamento = {}

        const id = req.params.id

        pagamento.id = id
        pagamento.status = 'CANCELADO'

        const connection = app.persistencia.connectionFactory()
        const pagamentoDao = new app.persistencia.PagamentoDao(connection)

        pagamentoDao.atualiza(pagamento, function (erro) {
            if (erro) {
                res.status(500).send(erro)
                return
            }
            console.log('pagamento cancelado!')
            res.send(pagamento)
        })

    })

    app.put('/pagamentos/pagamento/:id', function (req, res) {

        var pagamento = {}

        const id = req.params.id

        pagamento.id = id
        pagamento.status = 'CONFIRMADO'

        const connection = app.persistencia.connectionFactory()
        const pagamentoDao = new app.persistencia.PagamentoDao(connection)

        pagamentoDao.atualiza(pagamento, function (erro) {
            if (erro) {
                res.status(500).send(erro)
                return
            }
            console.log('pagamento confirmado')
            res.status(204).send(pagamento)
        })

    })

    app.post('/pagamentos/pagamento', function (req, res) {

        const pagamento = req.body

        check('forma_de_pagamento').isLength({ min: 1 }).withMessage('Forma de pagamento obrigatória')
        check('valor').isLength({ min: 1 }).isFloat().withMessage('Valor obrigatório')
        check('moeda').isLength({ min: 3 }).withMessage('Moeda é obrigatória e deve ter 3 caracteres')

        const erros = validationResult(req)

        if (erros) {
            console.log('Erros de validacao encontrados ')
            res.status(400).send(erros)
            return
        }

        console.log('Processando req de pagamento')

        pagamento.status = 'CRIADO'
        pagamento.data = new Date
        res.json(pagamento)

        const connection = app.persistencia.connectionFactory()
        const pagamentoDao = new app.persistencia.PagamentoDao(connection)

        pagamentoDao.salva(pagamento, function (erro, resultado) {
            if (erro) {
                console.log(('Erro ao inserir no banco ').concat(erro))
                res.status(500).send(erro)
            } else {
                console.log('Pagamento criado ' + resultado)
                pagamento.id = resultado.insertId
                res.location('pagamentos/pagamento/' + pagamento.id)

                const response = {
                    dados_do_pagamento: pagamento,
                    links: [
                        {
                            href: 'http://localhost:3000/pagamentos/pagamento/'
                                + pagamento.id,
                            rel: 'confirmar',
                            method: 'PUT'

                        },
                        {
                            href: 'http://localhost:3000/pagamentos/pagamento/'
                                + pagamento.id,
                            rel: 'cancelar',
                            method: 'DELETE'
                        }
                    ]
                }

                res.status(201).json(response)
            }
        })

    })

}
