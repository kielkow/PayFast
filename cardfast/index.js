const app = require('./config/custom-express')()

app.listen(3001, () => {
    console.log('Servidor CardFast rodando na porta 3001')
})