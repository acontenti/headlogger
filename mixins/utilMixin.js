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
