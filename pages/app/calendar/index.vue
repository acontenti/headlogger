<template>
	<v-row align="center" justify="center">
		<v-col cols="12">
			<v-card>
				<v-toolbar flat>
					<v-spacer></v-spacer>
					<v-btn fab outlined small @click="prev">
						<v-icon small>
							mdi-chevron-left
						</v-icon>
					</v-btn>
					<v-toolbar-title v-if="$refs.calendar" class="mx-4">
						<v-btn outlined text @click="setToday">
							{{ $refs.calendar.title }}
						</v-btn>
					</v-toolbar-title>
					<v-btn fab outlined small @click="next">
						<v-icon small>
							mdi-chevron-right
						</v-icon>
					</v-btn>
					<v-spacer></v-spacer>
				</v-toolbar>
				<v-calendar ref="calendar" v-model="focus" :event-color="eventColour" :events="events" locale="it"/>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import utilMixin from "@/mixins/utilMixin";

export default {
	mixins: [utilMixin],
	data() {
		return {
			events: [],
			focus: ""
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
			this.events = snapshot.docs.map((doc) => {
				const data = doc.data();
				return ({
					id: doc.id,
					name: data.type,
					start: data.date,
					end: data.date,
					timed: false,
					intensity: data.intensity
				});
			});
		},
		eventColour(event) {
			return this.intensityColour(event.intensity);
		},
		setToday() {
			this.focus = "";
		},
		prev() {
			this.$refs.calendar.prev();
		},
		next() {
			this.$refs.calendar.next();
		}
	}
};
</script>
