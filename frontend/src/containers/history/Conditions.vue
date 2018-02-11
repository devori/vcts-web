<template>
    <v-expansion-panel class="elevation-2">
        <v-expansion-panel-content>
            <div slot="header">
                <div>
                    <span>{{ startDate }} ~ {{ endDate }}</span>
                </div>
                <div>
                    <span>Coins: {{ selectedCoins.length > 0 ? selectedCoins.join(', ') : 'ALL' }}</span>
                </div>
            </div>
            <v-card>
                <v-card-text class="grey lighten-4">
                    <v-menu transition="slide-y-transition">
                        <v-text-field
                            slot="activator"
                            label="Start Date"
                            v-model="startDate"
                            prepend-icon="event"
                            readonly
                        />
                        <v-date-picker v-model="startDate"
                                       no-title scrollable
                                       actions
                                       @input="onChangeDate"
                        >
                        </v-date-picker>
                    </v-menu>
                    <v-menu transition="slide-y-transition">
                        <v-text-field
                            slot="activator"
                            label="End Date"
                            v-model="endDate"
                            prepend-icon="event"
                            readonly
                        />
                        <v-date-picker v-model="endDate"
                                       no-title
                                       scrollable
                                       actions
                                       @input="onChangeDate"
                        >
                        </v-date-picker>
                    </v-menu>
                    <v-flex>
                        <v-select
                            label="Coins"
                            :items="coins"
                            v-model="selectedCoins"
                            multiple
                            chips
                            solo
                            @input="onChangeCoins"
                        >
                            <template slot="selection" slot-scope="data">
                                <v-chip
                                    close
                                    @input="onRemoveCoin(data.item)"
                                    :selected="data.selected"
                                >
                                    <span>{{ data.item }}</span>
                                </v-chip>
                            </template>
                        </v-select>
                    </v-flex>
                </v-card-text>
            </v-card>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>
<script>
    import moment from 'moment';

    export default {
        props: {
            coins: {
                type: Array,
                default: () => [],
            },
        },
        data () {
            const today = moment().format('YYYY-MM-DD');
            return {
                startDate: '2018-01-01',
                endDate: today,
                selectedCoins: [],
            };
        },
        methods: {
            onChangeDate () {
                this.$emit('change', 'date', this.startDate, this.endDate);
            },
            onChangeCoins () {
                this.$emit('change', 'coins', this.selectedCoins.slice(0));
            },
            onRemoveCoin (target) {
                this.selectedCoins = this.selectedCoins.filter((coin) => coin !== target);
                this.onChangeCoins();
            },
        },
    };
</script>
<style scoped lang="less">
</style>
