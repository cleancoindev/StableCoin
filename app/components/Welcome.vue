<template>
    <div class="page-welcome">
        <div class="container">
            <!-- <div class="animation_bg">
                <span id="blue-circle-container"/>
                <span id="green-rectangle"/>
                <span id="grey-oval"/>
                <span id="grey-rounded-rectangle"/>
                <span id="red-triangle"/>
                <span id="yellow-dots"/>
                <span id="yellow-semicircle"/>
            </div> -->
            <div class="step-login">
                <b-img
                    src="../app/assets/images/logo.png"
                    alt="logo stablecoin"
                    class="mb-5 xdc-logo"/>
                <h2 class="tmp-title-big">Issue Your Own StableCoin in Minutes!</h2>
                <p class="custom-welcome-title">
                    Deploy StableCoin on Below network
                </p>
                <div class="btn-box">
                    <b-button
                        class="tmp-btn-blue"
                        @click="redirectTo('createToken')">
                        XinFin Main Network
                    </b-button>
                    <b-button
                        class="tmp-btn-boder-blue"
                        href="https://st.mycontract.co">
                        XinFin Apothem Network
                    </b-button>
                </div>
                <div
                    class="link-login">
                    <span>Already have your token?</span>
                    <b-link
                        to="/login">
                        Log in
                    </b-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from 'store'

export default {
    name: 'App',
    components: {
    },
    mixins: [],
    data () {
        return {}
    },
    validations: {},
    computed: {},
    watch: {},
    updated () {},
    beforeDestroy () {},
    created: async function () {},
    mounted () {},
    methods: {
        redirectTo (page) {
            store.set('redirectTo', page)
            this.$router.push({
                path: '/login'
            })
        }
    }
}
</script>
