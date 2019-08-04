const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const logger = require('../logs/logger')

module.exports = () => {

    const app = express()

    app.use(morgan('common', {
        stream: {
            write: function (mensagem) {
                logger.info(mensagem)
            }
        }
    }))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    consign()
        .include('routes')
        .then('persistencia')
        .then('servicos')
        .into(app)

    return app

}