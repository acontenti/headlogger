import Vue from "vue";
import vcolors from "vuetify/es5/util/colors";

export default Vue.mixin({
	data() {
		return {
			colors: [
				vcolors.amber.accent4,
				vcolors.yellow.darken4,
				vcolors.deepOrange.darken4,
				vcolors.red.darken4
			],
			availableTypes: ["Mal di testa", "Altro"],
			availableHours: [
				{text: "Notte (1-6)", value: 0, hour: 3},
				{text: "Mattina (7-12)", value: 1, hour: 9},
				{text: "Pomeriggio (13-18)", value: 2, hour: 15},
				{text: "Sera (19-24)", value: 3, hour: 21}
			]
		};
	},
	methods: {
		formatDate(date) {
			if (!date) {
				return "";
			}
			if (!(date instanceof Date)) {
				date = new Date(date);
			}
			return date.toLocaleDateString("it-IT");
		},
		formatDateTime(date, hour) {
			if (!date) {
				return "";
			}
			if (!(date instanceof Date)) {
				date = new Date(date);
			}
			const hourText = this.availableHours.find(({value}) => value === hour).text;
			return date.toLocaleDateString("it-IT") + " " + hourText;
		},
		intensityColour(intensity) {
			if (intensity <= 3) {
				return this.colors[0];
			}
			if (intensity <= 6) {
				return this.colors[1];
			}
			if (intensity <= 9) {
				return this.colors[2];
			} else {
				return this.colors[3];
			}
		}
	}
});
