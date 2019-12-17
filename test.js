const web3 = require('./models/blockchain/web3')
const xrc21Abi = require('./XRC21.json')
const config = require('config')

let a2 = '0xc6facca85f1bbb17a5aa4f2062740e36e10cd4c2'
let a2pk = 'xxx'

let account = web3.eth.accounts.privateKeyToAccount(a2pk)
web3.eth.accounts.wallet.add(account)
account = web3.eth.accounts.privateKeyToAccount('0x' + config.get('truffle.privateKey'))
web3.eth.accounts.wallet.add(account)
web3.eth.defaultAccount = account.address

let xrc21 = new web3.eth.Contract(xrc21Abi, '0x387C7E5f3f2AF37d5A1AfA4C16Ca88e40796234a', {
    defaultAccount: account.address,
    defaultGasPrice: '20000000000'
})

xrc21.methods.transfer(a2, '99999999999999000000')
    .send({ from: account.address, gas: 2000000 })
    .then(receipt => {
        console.log(receipt)
        return xrc21.methods.transfer('0x6941379ccc4731fc20abfa087e43cb7b0f63e38e', '2000000000')
            .send({ from: a2, gas: 2000000, gasPrice: 250000000 })
            .then(receipt => {
                console.log(receipt)
            })
    }).catch(e => console.log(e))
