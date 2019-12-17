<template>
    <div class="container container-small flex-content-center">
        <div class="xdc-apply">
            <div class="info-header text-center">
                <p><i class="stablecoin-icon-xinfinz"/></p>
                <h2 class="tmp-title-large">XinFInZ Protocol Application</h2>
            </div>
            <b-form
                class="tmp-form-one"
                novalidate
                @submit.prevent="validate()">
                <h2 class="tmp-title-medium text-center">This token is already applied to XinFInZ</h2>
                <div class="btn-box">
                    <b-button
                        :to="'/token/' + address"
                        class="tmp-btn-boder-violet btn-min">
                        Back
                    </b-button>
                </div>
            </b-form>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        address: { type: String, default: '', required: true }
    },
    data () {
        return {}
    },
    created: async function () {}
}
</script>
