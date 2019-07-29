const { validationResult, check } = require('express-validator')

module.exports = function (app) {
    app.post("/cartoes/autoriza", function (req, res) {
        console.log('processando pagamento com cartão');

        var cartao = req.body;

        check('numero').isLength({ min: 16 }).withMessage('Número é obrigatório e deve ter 16 caracteres.')
        check('bandeira').isLength({ min: 1 }).withMessage('Bandeira do cartão é obrigatória.')
        check('ano_de_expiracao').isLength({ min: 4 }).withMessage('Ano de expiração é obrigatório e deve ter 4 caracteres.')
        check('mes_de_expiracao').isLength({ min: 2 }).withMessage('Mês de expiração é obrigatório e deve ter 2 caracteres')
        check('cvv').isLength({ min: 3 }).withMessage('CVV é obrigatório e deve ter 3 caracteres')

        var errors = validationResult(req)

        if (errors) {
            console.log("Erros de validação encontrados");

            res.status(400).send(errors);
            return;
        }
        cartao.status = 'AUTORIZADO';

        var response = {
            dados_do_cartao: cartao,
        }

        res.status(201).json(response);
        return;
    });
}