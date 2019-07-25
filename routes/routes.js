const { validationResult } = require('express-validator')
const { check } = require('express-validator/check')

module.exports = (app) => {

    app.get('/pagamentos', function (req, res) {
        console.log('Rota /pagamentos ativada')
        res.send(
            'OK'
        )
    })

    app.post('/pagamentos/pagamento', function (req, res) {

        check('forma_de_pagamento').isLength({ min: 1 }).withMessage('Forma de pagamento obrigatória')
        check('valor').isLength({ min: 1 }).isFloat().withMessage('Valor obrigatório')

        const erros = validationResult(req)

        if (erros) {
            console.log('Erros de validacao encontrados ')
            res.status(400).send(erros)
            return
        }

        const pagamento = req.body
        console.log('Processando req de pagamento')

        pagamento.status = 'CRIADO'
        pagamento.data = new Date

        const connection = app.persistencia.connectionFactory()
        const pagamentoDao = new app.persistencia.PagamentoDao(connection)

        pagamentoDao.salva(pagamento, function (erro, resultado) {
            if (erro) {
                console.log(('Erro ao inserir no banco ').concat(erro))
                res.status(500).send(erro)
            } else {
                console.log('Pagamento criado')
                res.location('pagamentos/pagamento/' + resultado.insertId)
                res.status(201).json(pagamento)
            }
        })

    })

}
