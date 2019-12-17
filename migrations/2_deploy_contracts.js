const XRC21Issuer = artifacts.require('./XRC21Issuer')
const xinfinxListing = artifacts.require('./xinfinxListing')
const MyXRC21 = artifacts.require('./MyXRC21')
const MyXRC21Mintable = artifacts.require('./MyXRC21Mintable')
const BigNumber = require('bignumber.js')

const config = require('config');

module.exports = function(deployer) {
    return deployer.deploy(xinfinxListing).then(() => {
        return deployer.deploy(XRC21Issuer, (new BigNumber(config.get('truffle.minCapacity')).multipliedBy(1e+18)).toString(10)).then(() => {
            return deployer.deploy(MyXRC21, 'MyXRC21',
                'MyXRC21', 18, (new BigNumber(10000000).multipliedBy(1e+18)).toString(10),
                (new BigNumber(1).multipliedBy(1e+18)).toString(10)).then(() => {
                    return deployer.deploy(MyXRC21Mintable, 'MyXRC21Mintable',
                        'MyXRC21Mintable', 18, (new BigNumber(10000000).multipliedBy(1e+18)).toString(10),
                        (new BigNumber(1).multipliedBy(1e+18)).toString(10)).then(() => {
                            return true
                        })
                })
        })
    })
};
