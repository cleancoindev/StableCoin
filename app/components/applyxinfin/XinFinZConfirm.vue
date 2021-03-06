<template>
    <xdc-z-applied
        v-if="isAppliedZ"
        :address="address" />
    <div
        v-else
        class="container container-small">
        <div class="confirm-table">
            <div class="info-header text-center">
                <p><i class="stablecoin-icon-xinfinz"/></p>
                <h2 class="tmp-title-large">XinFInZ Protocol Application</h2>
            </div>
            <div class="tmp-table-three">
                <table>
                    <tr>
                        <td>From</td>
                        <td>
                            <b-link
                                :title="account"
                                :href="config.xinfinscanUrl + '/address/' + account"
                                target="_blank">
                                {{ account }}
                            </b-link>
                            <span>Owner address</span>
                        </td>
                    </tr>
                    <tr>
                        <td>To</td>
                        <td>
                            <b-link
                                :title="address"
                                :href="config.xinfinscanUrl + '/address/' + address"
                                target="_blank">
                                {{ address }}
                            </b-link>
                            <span>{{ token.name }} SmartContract</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Deposit amount</td>
                        <td>{{ formatNumber(depositeFee) }} XDC</td>
                    </tr>
                </table>
            </div>
            <div class="btn-box">
                <b-button
                    :to="'/xinfinzapplication/' + address"
                    class="tmp-btn-boder-violet btn-min">
                    Back
                </b-button>
                <b-button
                    class="tmp-btn-violet"
                    @click="applyXinFinZ">
                    Apply to XinFInZ protocol
                </b-button>
            </div>
            <b-modal
                id="applyXinFinZ"
                ref="applyXinFinZ"
                size="md"
                hide-header
                hide-footer
                no-close-on-esc
                no-close-on-backdrop
                centered>
                <div class="xdc-modal-default icon-violet">
                    <div class="msg-txt">
                        <i class="stablecoin-icon-checkmark-outline"/>
                        <h4>Successful</h4>
                        <p>{{ token.name }} token successfully applied to XinFInZ</p>
                        <p>
                            Transaction hash:
                            <a
                                :href="config.xinfinscanUrl + '/tx/' +
                                transactionHash.toLowerCase()"
                                :title="transactionHash"
                                target="_blank">
                                {{ truncate(transactionHash, 26) }}
                            </a>
                        </p>
                    </div>
                    <div class="btn-box">
                        <router-link
                            :to="{ path: `/token/${address}` }"
                            class="btn tmp-btn-boder-violet btn-secondary">Token detail
                        </router-link>
                        <router-link
                            :to="{ path: `/edittransactionsfee/${address}` }"
                            class="btn tmp-btn-violet btn-secondary">Edit Tx fee
                        </router-link>
                    </div>
                </div>
            </b-modal>
        </div>
        <div
            :class="(loading ? 'xdc-loading' : '')"/>
    </div>
</template>

<script>
import store from 'store'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import XinFinZApplied from './XinFinZApplied.vue'
export default {
    name: 'XinFinZConfirm',
    components: {
        XinFinZApplied
    },
    data () {
        return {
            address: this.$route.params.address.toLowerCase(),
            account: '',
            token: {},
            depositeFee: this.$route.params.depositFee,
            config: {},
            transactionHash: '',
            isAppliedZ: false,
            gasPrice: '',
            loading: false
        }
    },
    async updated () {},
    destroyed () { },
    created: async function () {
        const self = this
        self.account = store.get('address') ||
            self.$store.state.address || await self.getAccount()
        if (!self.account) {
            self.$router.push({ path: '/login' })
        }
        self.checkAppliedZ()

        self.config = store.get('configIssuer') || await self.appConfig()
        await this.getData()

        self.web3.eth.getGasPrice().then(result => {
            self.gasPrice = result
        }).catch(error => {
            console.log(error)
            self.$toasted.show(error, { type: 'error' })
        })
    },
    methods: {
        async getData () {
            const self = this
            const vuexStore = self.$store.state
            if (vuexStore.token) {
                self.token = vuexStore.token
            } else {
                const { data } = await axios.get(`/api/token/${self.address}`)
                self.token = data
            }
        },
        checkAppliedZ () {
            const contract = this.XRC21Issuer
            contract.methods.tokens.call()
                .then(result => {
                    if (result && result.length > 0) {
                        const lowerCaseArr = result.map(m => m.toLowerCase())
                        if (lowerCaseArr.indexOf(this.address) > -1) {
                            this.isAppliedZ = true
                        }
                    }
                }).catch(error => {
                    console.log(error)
                    this.$toasted.show(error, { type: 'error' })
                })
        },
        async applyXinFinZ () {
            try {
                if (!this.isAppliedZ) {
                    this.loading = true
                    this.account = await this.getAccount()
                    const chainConfig = this.config.blockchain
                    const contract = this.XRC21Issuer
                    const txParams = {
                        from: (await this.getAccount()).toLowerCase(),
                        value: this.web3.utils.toHex(new BigNumber(this.depositeFee)
                            .multipliedBy(10 ** 18).toString(10)),
                        gasPrice: this.web3.utils.toHex(this.gasPrice),
                        gas: this.web3.utils.toHex(chainConfig.gas),
                        gasLimit: this.web3.utils.toHex(chainConfig.gas)
                    }
                    const provider = this.NetworkProvider
                    if (provider === 'ledger' || provider === 'trezor') {
                        let data = await contract.methods.apply(
                            this.address
                        ).encodeABI()

                        const dataTx = {
                            data,
                            to: chainConfig.issuerAddress
                        }
                        let nonce = await this.web3.eth.getTransactionCount(this.account)
                        Object.assign(
                            dataTx,
                            dataTx,
                            txParams,
                            {
                                nonce: this.web3.utils.toHex(nonce)
                            }
                        )
                        let signature = await this.signTransaction(dataTx)
                        const txHash = await this.sendSignedTransaction(dataTx, signature)
                        if (txHash) {
                            this.transactionHash = txHash
                            let check = true
                            while (check) {
                                const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                if (receipt) {
                                    self.loading = false
                                    check = false
                                    self.isAppliedZ = true
                                    this.$refs.applyXinFinZ.show()
                                }
                            }
                        }
                    } else {
                        await contract.methods.apply(this.address).send(txParams)
                            .on('transactionHash', async (txHash) => {
                                this.transactionHash = txHash
                                let check = true
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt) {
                                        self.loading = false
                                        check = false
                                        self.isAppliedZ = true
                                        this.$refs.applyXinFinZ.show()
                                    }
                                }
                            })
                            .catch(error => {
                                this.loading = false
                                console.log(error)
                                this.$toasted.show(error, { type: 'error' })
                            })
                    }
                }
            } catch (error) {
                this.loading = false
                console.log(error)
                this.$toasted.show(error, { type: 'error' })
            }
        }
    }
}
</script>
