<template>
	<v-row align="center" justify="center">
		<v-col cols="12">
			<v-card>
				<v-card-title>
					<span class="subtitle-1">Benvenuto, {{ user.email }}</span>
				</v-card-title>
			</v-card>
		</v-col>
		<v-col v-if="log.length > 0" cols="12">
			<v-card>
				<v-list>
					<v-subheader>Ultimi eventi</v-subheader>
					<v-list-item v-for="item in log" :key="item.id">
						<v-list-item-avatar :color="intensityColour(item.data.intensity)">
							<span>{{ item.data.intensity }}</span>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title>
								{{ formatDate(item.data.date) }} -
								{{ (availableHours.find(value => value.value === item.data.hour) || {}).text }}
							</v-list-item-title>
							<v-list-item-subtitle>
								{{ item.data.type }} - {{ (item.data.cause || []).join(", ") || '?'}}
							</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-action>
							<v-btn icon @click="editItem(item.id)">
								<v-icon>mdi-pencil</v-icon>
							</v-btn>
						</v-list-item-action>
						<v-list-item-action>
							<v-btn icon @click="deleteItem(item.id)">
								<v-icon>mdi-delete</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item>
				</v-list>
			</v-card>
		</v-col>
		<v-btn bottom color="primary" fab fixed right @click="newItem">
			<v-icon>mdi-plus</v-icon>
		</v-btn>
		<v-dialog v-model="dialog" max-width="500px">
			<v-card :loading="dialogLoading">
				<v-card-title>
					<h3>{{ dialogTitle }}</h3>
				</v-card-title>
				<v-card-text>
					<v-form ref="form">
						<v-menu v-model="datePicker" :close-on-content-click="false">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field v-model="editingDateFormatted" v-bind="attrs" v-on="on" label="Data *"
											  prepend-icon="mdi-calendar" readonly></v-text-field>
							</template>
							<v-date-picker v-model="editing.date" :max="new Date().toISOString().substr(0, 10)" light
										   no-title @input="datePicker = false"></v-date-picker>
						</v-menu>
						<v-select v-model="editing.hour" :items="availableHours" :rules="[input=>input!==undefined]"
								  item-text="text" item-value="value" label="Orario *" prepend-icon="mdi-clock"/>
						<v-combobox v-model="editing.type" :items="availableTypes" :rules="[input=>input!==undefined]"
									label="Tipologia *" prepend-icon="mdi-shape"/>
						<v-combobox v-model="editingCauses" :delimiters="[',']" :items="availableCauses" chips
									deletable-chips
									label="Cause" multiple prepend-icon="mdi-lightning-bolt"/>
						<v-slider v-model="editing.intensity" hide-details
								  label="Intensità *" max="10" min="1" prepend-icon="mdi-chart-timeline-variant"
								  step="1" thumb-label tick-size="4" ticks="always"/>
						<v-text-field v-model="editing.notes" label="Note" prepend-icon="mdi-note"/>
					</v-form>
				</v-card-text>
				<v-card-actions class="justify-center">
					<v-btn @click="dialog = false">Annulla</v-btn>
					<v-btn color="primary" @click="saveItem">Salva</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import {mapState} from "vuex";
import utilMixin from "@/mixins/utilMixin";

export default {
	head: {
		title: "Home"
	},
	mixins: [utilMixin],
	data() {
		return {
			logCollection: null,
			log: [],
			datePicker: false,
			dialog: false,
			dialogLoading: false,
			dialogTitle: "Modifica elemento",
			currentEditing: null,
			editing: {},
			availableTypes: ["Mal di testa", "Altro"],
			availableHours: [
				{text: "Notte (0-6)", value: 0},
				{text: "Mattina (7-12)", value: 1},
				{text: "Pomeriggio (13-18)", value: 2},
				{text: "Sera (19-23)", value: 3}
			],
			availableCauses: []
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
		editingDateFormatted() {
			return this.formatDate(this.editing.date);
		},
		editingCauses: {
			get() {
				return this.editing.cause;
			},
			set(value) {
				this.editing.cause = !value || value.length > 0 ? value : null;
			}
		},
		...mapState(["user"])
	},
	methods: {
		loadData(snapshot) {
			this.log = snapshot.docs.map((doc) => ({
				id: doc.id,
				data: doc.data()
			}));
			this.log.sort((a, b) => b.data.date.localeCompare(a.data.date) * 10 + (b.data.hour - a.data.hour));
			this.availableCauses = this.log.flatMap(value => value.data.cause || []);
		},
		newItem() {
			this.currentEditing = null;
			this.dialogTitle = "Nuovo elemento";
			if (this.$refs.form) {
				this.$refs.form.resetValidation();
			}
			this.editing = {
				date: new Date().toISOString().substr(0, 10),
				type: this.availableTypes[0],
				intensity: 5
			};
			this.dialog = true;
		},
		editItem(id) {
			this.currentEditing = id;
			this.dialogTitle = "Modifica elemento";
			this.editing = {};
			if (this.$refs.form) {
				this.$refs.form.resetValidation();
			}
			this.editing = Object.assign({}, (this.log.find(value => value.id === id) || {}).data);
			this.dialog = true;
		},
		deleteItem(id) {
			try {
				this.$fireStore.collection("users").doc(this.user.uid)
					.collection("log").doc(id)
					.delete();
			} catch (e) {
				alert(e);
			}
		},
		async saveItem() {
			if (this.$refs.form.validate()) {
				this.dialogLoading = true;
				try {
					let doc;
					if (this.currentEditing) {
						doc = this.$fireStore.collection("users").doc(this.user.uid).collection("log").doc(this.currentEditing);
					} else {
						doc = this.$fireStore.collection("users").doc(this.user.uid).collection("log").doc();
					}
					await doc.set(this.editing);
				} catch (e) {
					alert(e);
				}
				this.dialogLoading = false;
				this.dialog = false;
			}
		}
	},
	mounted() {
		this.logCollection.onSnapshot(this.loadData);
	}
};
</script>
