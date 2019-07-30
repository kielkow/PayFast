module.exports = (app) => {

    app.post('/correios/calculo-prazo', function(req, res){

        const dadosDaEntrega = req.body

        const correiosSOAPClient = new app.servicos.correiosSOAPClient()
        correiosSOAPClient.calculaPrazo(dadosDaEntrega, function(erro, resultado){
            
            if(erro){
                res.status(500).send(erro)
                return
            }

            console.log('Prazo calculado')
            res.json(resultado)

        })

    })
}