<template>
    <div class="container container-small flex-content-center apply-xdc-x">
        <div class="xdc-body-fullw">
            <div class="info-header">
                <h2 class="tmp-title-large">XinFinX Listing</h2>
            </div>
            <div class="about-xinfinz">
                <p>
                    XinFinX and its liquidity network provide your business and tokens
                    the most advantages to attract potential investors, trafaders and Dapp users.
                </p>
            </div>
            <b-row class=" text-center mb-5 mt-5">
                <b-col class="box-step col-12 col-md-4">
                    <i class="stablecoin-icon-xinfinx3"/>
                    <p class="mt-3 tmp-title-small weightbold xinfinx-font">
                        Apply your tokens to XinFinX(Fee: 100 XDC)
                    </p>
                </b-col>
                <b-col class="box-step col-12 col-md-4">
                    <i class="stablecoin-icon-xinfinx2" />
                    <p class="mt-3 tmp-title-small weightbold xinfinx-font">
                        Your applied tokens will be shown to potential relayers
                    </p>
                </b-col>
                <b-col class="box-step col-12 col-md-4">
                    <i class="stablecoin-icon-xinfinx1"/>
                    <p class="mt-3 tmp-title-small weightbold xinfinx-font">
                        Relayers choose to list your tokens for trading
                    </p>
                </b-col>
            </b-row>
            <div class="btn-box">
                <b-button
                    class="tmp-btn-boder-blue btn-min"
                    @click="back">
                    Back
                </b-button>
                <b-button
                    :to="'/xinfinxconfirm/' + address"
                    class="tmp-btn-blue">
                    Next to application
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
import store from 'store'
import axios from 'axios'
export default {
    name: 'ApplyXinFinX',
    components: { },
    data () {
        return {
            address: this.$route.params.address.toLowerCase(),
            account: '',
            token: {}
        }
    },
    async updated () {
    },
    destroyed () { },
    created: async function () {
        const self = this
        self.account = store.get('address') ||
            self.$store.state.address || await self.getAccount()
        if (!self.account) {
            self.$router.push({ path: '/login' })
        }
        self.getData()
    },
    methods: {
        getData () {
            const self = this
            const vuexStore = self.$store.state
            if (vuexStore.token) {
                self.token = vuexStore.token
            } else {
                axios.get(`/api/token/${self.address}`).then(response => {
                    self.token = response.data
                }).catch(error => {
                    console.log(error)
                    self.$toasted.show(error, { type: 'error' })
                })
            }
        },
        back () {
            this.$router.go(-1)
        }
    }
}
</script>
