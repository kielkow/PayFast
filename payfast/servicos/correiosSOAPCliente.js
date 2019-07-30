const soap = require('soap')

soap.createClient('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl',
    function (erro, cliente) {

        if (erro) {
            console.log(erro)
        }

        console.log('Cliente SOAP criado')

        cliente.CalcPrazo(
            {
                'nCdServico': '40010',
                'sCepOrigem': '04101300',
                'sCepDestino': '65000600'
            },

            function (erro, resultado) {
                console.log(JSON.stringfy(resultado))
            })
    }
)