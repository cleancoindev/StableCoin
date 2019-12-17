'use strict'
const express = require('express')
const config = require('config')
const router = express.Router()

router.get('/', async function (req, res, next) {
    let appConfig = {}
    appConfig.blockchain = config.get('blockchain')
    let xinfinscanUrl = config.get('xinfinscanUrl')
    if (xinfinscanUrl[xinfinscanUrl.length - 1] === '/') {
        xinfinscanUrl = xinfinscanUrl.substr(0, xinfinscanUrl.length - 1)
    }
    appConfig.xinfinscanUrl = xinfinscanUrl
    let xdcwallet = config.get('xdcwalletUrl')
    if (xdcwallet[xdcwallet.length - 1] === '/') {
        xdcwallet = xdcwallet.substr(0, xdcwallet.length - 1)
    }
    appConfig.xdcwalletUrl = xdcwallet

    let xdcrelayerAPI = config.get('xdcrelayerAPI')
    if (xdcrelayerAPI[xdcrelayerAPI.length - 1] === '/') {
        xdcrelayerAPI = xdcrelayerAPI.substr(0, xdcrelayerAPI.length - 1)
    }
    appConfig.xdcrelayerAPI = xdcrelayerAPI

    let tokenListAPI = config.get('tokenListAPI')
    if (tokenListAPI[tokenListAPI.length - 1] === '/') {
        tokenListAPI = tokenListAPI.substr(0, tokenListAPI.length - 1)
    }
    appConfig.tokenListAPI = tokenListAPI
    return res.json(appConfig)
})

module.exports = router
