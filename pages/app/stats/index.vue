<template>
	<v-card class="overflow-hidden">
		<v-card-title>Cause</v-card-title>
		<ve-pie :data="causesChart.data" :extend="causesChart.extend" :settings="causesChart.settings"
				theme-name="dark" width="100%"/>
		<v-card-title>Trend</v-card-title>
		<ve-line :data="logChart.data" :extend="logChart.extend" :settings="logChart.settings"
				 :visual-map="logChart.visualMap" theme-name="dark" width="100%"/>
	</v-card>
</template>

<script>
import utilMixin from "@/mixins/utilMixin";

export default {
	mixins: [utilMixin],
	data() {
		return {
			log: [],
			causes: [],
			causesChart: {
				data: {
					columns: ["cause", "n"],
					rows: []
				},
				settings: {
					type: "pie",
					labelMap: {cause: "Causa", n: "n"}
				},
				extend: {
					legend: {
						type: "scroll"
					}
				}
			},
			logChart: {
				data: {
					columns: ["date", "intensity"],
					rows: []
				},
				settings: {
					type: "line",
					labelMap: {date: "Data", intensity: "Intensità"}
				},
				extend: {
					legend: {
						icon: "roundRect"
					},
					color: this.colors
				},
				visualMap: [
					{
						type: "piecewise",
						splitNumber: 9,
						min: 1,
						max: 10,
						show: false,
						color: this.colors
					}
				]
			}
		};
	},
	async fetch() {
		try {
			this.logCollection = this.$fireStore.collection("users").doc(this.$store.state.user.uid).collection("log");
			const snapshot = await this.logCollection.get();
			this.loadData(snapshot);
		} catch (e) {
			console.error(e);
		}
	},
	methods: {
		loadData(snapshot) {
			this.log = snapshot.docs.map((doc) => ({
				id: doc.id,
				data: doc.data()
			}));
			this.log.sort((a, b) => a.data.date.localeCompare(b.data.date) * 10 + (a.data.hour - b.data.hour));
			this.causes = this.log.flatMap(value => {
				const cause = value.data.cause;
				return (!cause || cause.length === 0) ? ["altro"] : cause;
			}).reduce((acc, cur) => Object.assign(acc, {[cur]: (acc[cur] | 0) + 1}), {});
			const entries = Object.entries(this.causes);
			entries.sort(([, a], [, b]) => b - a);
			this.causesChart.data.rows = entries.map(([key, value]) => ({cause: key, n: value}));
			this.logChart.data.rows = this.log.map(({data}) => ({
				date: this.formatDateTime(data.date, data.hour),
				intensity: data.intensity
			}));
		}
	}
};
</script>

<style scoped>

</style>
