module.exports = (app) => {

    app.get('/pagamentos', function (req, res) {
        console.log('Rota /pagamentos ativada')
        res.send(
            'OK'
        )
    })

    app.post('/pagamentos/pagamento', function(req, res){
        
        const pagamento = req.body
        console.log('Processando req de pagamento')

        pagamento.status = 'CRIADO'
        pagamento.data = new Date
        
        const connection = app.persistencia.connectionFactory()
        const pagamentoDao = new app.persistencia.PagamentoDao(connection)

        pagamentoDao.salva(pagamento, function(erro, resultado){
            if(erro){
                console.log(erro)
            }
            console.log('Pagamento criado')
            res.json(pagamento)
        })

    })

}
