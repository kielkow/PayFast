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
                res.location('pagamentos/pagamento/' + resultado.insertId)
                pagamento.id = resultado.insertId
                res.status(201).json(pagamento)
            }
        })

    })

}
