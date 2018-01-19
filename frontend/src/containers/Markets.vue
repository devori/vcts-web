<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex
                xs12 sm6 md4 lg3
                v-for="market in markets"
                :key="market.name"
            >
                <v-card>
                    <v-card-title primary-title>
                        <div class="headline">{{ market.name }}</div>
                        <div></div>
                    </v-card-title>
                    <v-card-actions class="white">
                        <v-spacer></v-spacer>
                        <v-btn icon @click="moveTo(`markets/${market.name.toLowerCase()}/assets`)">
                            <v-icon>attach_money</v-icon>
                        </v-btn>
                        <v-btn icon @click="moveTo(`markets/${market.name.toLowerCase()}/histories`)">
                            <v-icon>history</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <div></div>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        data () {
            return {
                markets: [
                    {name: 'Poloniex'},
                    {name: 'Binance'},
                ],
            };
        },
        computed: {},
        methods: {
            moveTo (path) {
                this.$router.push(path);
            },
        },
    };
</script>
<style scoped lang="less">
</style>
