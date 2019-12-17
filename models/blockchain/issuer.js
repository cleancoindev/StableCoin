const issuer = require('../../build/contracts/XRC21Issuer')
const config = require('config')

function Issuer (web3) {
    const contract = new web3.eth.Contract(issuer.abi, config.get('blockchain.issuerAddress'))
    return contract
}
module.exports = Issuer
