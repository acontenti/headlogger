<template>
	<v-row>
		<v-col cols="12">
			<v-card>
				<v-card-title>Cause</v-card-title>
				<v-card-text>
					<v-sparkline :gradient="colors"
								 :labels="causesLabels"
								 :value="causesValues"
								 auto-line-width gradient-direction="bottom" show-labels type="bar">
					</v-sparkline>
				</v-card-text>
			</v-card>
			<v-card>
				<v-card-title>Trend</v-card-title>
				<v-card-text>
					<v-sparkline :gradient="colors"
								 :labels="log.map(item=>formatDate(item.data.date))"
								 :value="log.map(item=>item.data.intensity)"
								 color="white"
								 gradient-direction="bottom"
								 line-width="2"
								 padding="25"
								 show-labels smooth>
					</v-sparkline>
				</v-card-text>
			</v-card>
		</v-col>
		<v-col cols="12">

		</v-col>
		<v-col cols="12">

		</v-col>
	</v-row>
</template>

<script>
import utilMixin from "@/mixins/utilMixin";

export default {
	mixins: [utilMixin],
	data() {
		return {
			log: [],
			causes: []
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
	computed: {
		causesLabels() {
			const entries = this.getCauses();
			return entries.map(([k, v]) => k + ": " + v);
		},
		causesValues() {
			const entries = this.getCauses();
			return entries.map(([, v]) => v);
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
		},
		getCauses() {
			const entries = Object.entries(this.causes);
			entries.sort(([, a], [, b]) => b - a);
			return entries;
		}
	}
};
</script>

<style scoped>

</style>
