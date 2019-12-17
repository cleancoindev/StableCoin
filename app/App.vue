<template>
    <div id="app">
        <div class="page-layout">
            <b-navbar
                v-if="display"
                toggleable="lg"
                type="light"
                class="xdc-header"
                variant="white">
                <section class="container container-xdposchain">
                    <b-navbar-brand to="/">
                        <b-img
                            src="../app/assets/images/logo.png"
                            alt="logo stablecoin"/>
                    </b-navbar-brand>
                    <!-- button menu SP -->
                    <b-navbar-toggle
                        v-if="isxdposnet"
                        target="nav-collapse"
                        class="btn-menu-sp"/>
                    <!-- /button menu SP -->
                    <b-collapse
                        id="nav-collapse"
                        is-nav>
                        <b-navbar-nav class="ml-auto navbar-buttons">
                            <b-nav-item
                                v-if="isxdposnet"
                                class="tmp-btn-blue"
                                to="/createToken">
                                <i
                                    class="stablecoin-icon-plus text-center"/>
                                <div
                                    class="text-center issue-text"
                                    style="margin-right:11px">Issue new StableCoin</div>
                            </b-nav-item>
                            <b-nav-item-dropdown
                                v-if="isxdposnet"
                                class="tmp-btn-transparent xdc-wallet"
                                offset="25"
                                right>
                                <template
                                    slot="button-content"
                                    class="tmp-btn-transparent">
                                    <i class="stablecoin-icon-wallet"/>
                                    {{ truncate('xdc'+ account.substring(2), 16) }}
                                </template>
                                <b-dropdown-text
                                    class="flex_box">
                                    <span>Balance:</span>
                                    <strong>{{ balance }} XDC</strong>
                                </b-dropdown-text>
                                <b-dropdown-divider />
                                <b-dropdown-item
                                    v-if="!mobileCheck"
                                    class="sign_out"
                                    href="/"
                                    @click="signOut">
                                    Sign out
                                </b-dropdown-item>
                            </b-nav-item-dropdown>
                        </b-navbar-nav>
                    </b-collapse>
                </section>
            </b-navbar>
            <div
                :class="`${display === true ? 'common-main-content' : 'welcom-stablecoin'}`">
                <router-view/>
            </div>
            <footer
                class="xdc-footer footer">
                <div class="container container-xdposchain">
                    <div class="row">
                        <div class="col-md-7 col-lg-8">
                            <div class="xdc-meta-links">
                                <ul>
                                    <li>
                                        <a
                                            href="/api-docs"
                                            target="_blank">API Documentation</a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://wallet.xinfin.network/"
                                            target="_blank">Web Wallet</a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://chrome.google.com/webstore/detail/xinpay/bocpokimicclpaiekenaeelehdjllofo"
                                            target="_blank">XinPay</a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://play.google.com/store/apps/details?id=com.xdcwallet"
                                            target="_blank">Mobile Wallet</a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://howto.xinfin.org/"
                                            target="_blank">Resource</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import store from 'store'
import BigNumber from 'bignumber.js'
import pkg from '../package.json'

export default {
    name: 'App',
    components: {
    },
    data () {
        return {
            isReady: !!this.web3,
            isxdposnet: false,
            account: '',
            version: pkg.version,
            balance: '',
            display: false
        }
    },
    computed: {
        mobileCheck: () => {
            if (window.web3 && window.web3.currentProvider &&
                window.web3.currentProvider.isxdcwallet) {
                return true
            } else return false
        }
    },
    async updated () {
        await this.checkNetworkAndLogin()
    },
    destroyed () { },
    created: async function () {
        try {
            const self = this
            if (!self.isReady && self.NetworkProvider === 'metamask') {
                throw Error('Web3 is not properly detected. Have you installed MetaMask extension?')
            }
            self.$bus.$on('logged', async () => {
                await self.checkNetworkAndLogin()
            })
        } catch (error) {
            console.log(error)
        }
    },
    methods: {
        async checkNetworkAndLogin () {
            let self = this
            setTimeout(async () => {
                try {
                    self.account = store.get('address') ||
                        self.$store.state.address || await self.getAccount()
                    // let newvar = store.get('address') ||
                    //     self.$store.state.address || await self.getAccount()
                    // if (store.get('address')) {
                    //     self.account = .toLowerCase()
                    // } else {
                    //     self.account = this.$store.state.walletLoggedIn
                    //         ? this.$store.state.walletLoggedIn : await self.getAccount()
                    // }
                    if (self.account) {
                        self.isxdposnet = true
                    }

                    if (self.isxdposnet) {
                        self.display = true
                        if (self.web3) {
                            self.web3.eth.getBalance(self.account).then(result => {
                                let balance = new BigNumber(result)
                                self.balance = balance.div(10 ** 18).toNumber().toFixed(4)
                            }).catch(error => {
                                console.log(error)
                            })
                        }
                    } else if (self.$route.path === '/login') {
                        self.display = true
                    } else {
                        self.display = false
                    }
                    // self.account = 'xdc' + newvar(2)
                    // if (newvar.substring(0, 2) === '0x') {
                    // self.account = 'xdc' + newvar.substring(2)
                    // }
                } catch (error) {
                    console.log(error)
                    self.$toasted.show(error, { type: 'error' })
                }
            }, 0)
        },
        signOut () {
            store.clearAll()
            this.$store.state.address = null
            this.$store.state.token = null

            this.$router.go({
                path: '/'
            })
        }
    }
}
</script>
