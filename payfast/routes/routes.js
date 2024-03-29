const { check, validationResult } = require('express-validator')
const logger = require('../logs/logger')

module.exports = (app) => {

    app.get('/pagamentos', function (req, res) {
        console.log('Rota /pagamentos ativada')
        res.send(
            'OK'
        )
    })

    app.get('/pagamentos/pagamento/:id', (req, res) => {

        const id = req.params.id
        console.log('consultando pagamento ' + id)

        logger.info('consultando pagamento ' + id)

        const memcachedClient = app.servicos.memcachedClient()

        memcachedClient.get('pagamento-' + id, (erro, retorno) => {

            if (erro || !retorno) {
                console.log('MISS - chave não encontrada')

                const connection = app.persistencia.connectionFactory()
                const pagamentoDao = new app.persistencia.PagamentoDao(connection)

                pagamentoDao.buscaPorId(id, (erro, resultado) => {

                    if (erro) {
                        console.log('Erro na busca por id')
                        res.status(404).send(erro)
                        return
                    }

                    console.log('pagamento encontrado ' + JSON.stringify(resultado))
                    res.json(resultado)
                    return
                })
            }
            else {
                console.log('HIT - valor: ' + JSON.stringify(retorno))
                res.json(retorno)
                return
            }
        })
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

    app.post('/pagamentos/pagamento',
        [
            check('pagamento.forma_de_pagamento').not().isEmpty().withMessage('Forma de pagamento obrigatória'),
            check('pagamento.valor').not().isEmpty().withMessage('Valor obrigatório'),
            check('pagamento.moeda').not().isEmpty().withMessage('Moeda é obrigatória e deve ter 3 caracteres')
        ],
        function (req, res) {

            const pagamento = req.body['pagamento']

            const erros = validationResult(req)

            if (erros) {
                console.log('Erros de validacao encontrados ')
                res.status(422).json({ erros: erros.array() });
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
                    console.log('Erro ao inserir no banco ' + erro)
                    res.status(500).send(erro)
                } else {
                    console.log('Pagamento criado ' + resultado)
                    pagamento.id = resultado.insertId

                    const memcachedClient = app.servicos.memcachedClient()

                    memcachedClient.set('pagamento-' + pagamento.id, pagamento, 60000, (erro) => {
                        console.log('nova chave adicionada ao cache: pagamento-' + pagamento.id)
                    })

                    if (pagamento.forma_de_pagamento == 'cartao') {
                        const cartao = req.body['cartao']
                        console.log(cartao)

                        const clienteCartoes = new app.servicos.clienteCartoes()
                        clienteCartoes.autoriza(cartao, function (exception, request, response, retorno) {

                            if (exception) {
                                console.log(exception)
                                res.status(400).send(exception)
                                return
                            }

                            console.log(retorno)

                            res.location('pagamentos/pagamento/' + pagamento.id)

                            response = {
                                dados_do_pagamento: pagamento,
                                cartao: retorno,
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
                            return
                        })
                    }
                    else {

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
                }
            })

        })

}
