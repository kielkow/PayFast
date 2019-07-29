const { validationResult, check } = require('express-validator')

module.exports = function (app) {
    app.post("/cartoes/autoriza",
        [
            check('numero').not().isEmpty().withMessage('Número é obrigatório e deve ter 16 caracteres.'),
            check('bandeira').not().isEmpty().withMessage('Bandeira do cartão é obrigatória.'),
            check('ano_de_expiracao').not().isEmpty().withMessage('Ano de expiração é obrigatório e deve ter 4 caracteres.'),
            check('mes_de_expiracao').not().isEmpty().withMessage('Mês de expiração é obrigatório e deve ter 2 caracteres'),
            check('cvv').not().isEmpty().withMessage('CVV é obrigatório e deve ter 3 caracteres')
        ],
        function (req, res) {
            console.log('processando pagamento com cartão');

            var cartao = req.body;

            var errors = validationResult(req)

            if (errors) {
                console.log("Erros de validação encontrados");

                res.status(422).json({ errors: errors.array() });
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