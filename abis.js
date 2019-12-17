'use strict'

const fs = require('fs')

// copy & save XRC21Issuer
let XRC21IssuerAbi = require('./build/contracts/XRC21Issuer.json')
let data = JSON.stringify(XRC21IssuerAbi, null, 2)
fs.writeFileSync('./abis/XRC21Issuer.json', data)

// copy & save xinfinxListing
let xinfinxListingAbi = require('./build/contracts/xinfinxListing.json')
data = JSON.stringify(xinfinxListingAbi, null, 2)
fs.writeFileSync('./abis/xinfinxListingAbi.json', data)

// copy & save Migrations
let MigrationsAbi = require('./build/contracts/Migrations.json')
data = JSON.stringify(MigrationsAbi, null, 2)
fs.writeFileSync('./abis/Migrations.json', data)

// copy & save SafeMath
let SafeMathAbi = require('./build/contracts/SafeMath.json')
data = JSON.stringify(SafeMathAbi, null, 2)
fs.writeFileSync('./abis/SafeMath.json', data)
