<template>
	<div>
		<v-card>
			<v-card-title class="pb-0">Ultimi eventi</v-card-title>
			<v-card-text class="pa-0">
				<v-list>
					<transition-group name="list" tag="div">
						<v-list-item v-for="item in log" :key="item.id" ripple @click="viewing = item.data">
							<v-list-item-avatar :color="intensityColour(item.data.intensity)" left rounded>
								<span class="font-weight-bold subtitle-1">{{ item.data.intensity }}</span>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title>
									{{ formatDate(item.data.date) }} -
									{{ (availableHours.find(value => value.value === item.data.hour) || {}).text }}
								</v-list-item-title>
								<v-list-item-subtitle>
									{{ item.data.type }} - {{ (item.data.cause || []).join(", ") || "?" }}
								</v-list-item-subtitle>
							</v-list-item-content>
							<v-list-item-action>
								<v-btn icon @click.stop="editItem(item.id)">
									<v-icon>mdi-pencil</v-icon>
								</v-btn>
							</v-list-item-action>
							<v-list-item-action>
								<v-btn icon @click.stop="deleteItem(item.id)">
									<v-icon>mdi-delete</v-icon>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
						<v-list-item v-if="log.length === 0" class="pa-4">
							<v-list-item-content>
								<v-list-item-title class="text-center">
									<v-icon color="#888" x-large>mdi-bookshelf</v-icon>
								</v-list-item-title>
								<v-list-item-subtitle class="text-center text-uppercase font-weight-medium">
									Ancora nessun evento
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</transition-group>
				</v-list>
			</v-card-text>
		</v-card>
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
		<v-dialog :value="!!viewing" max-width="500px" @input="viewing = undefined">
			<v-card>
				<v-card-text>
					<v-list v-if="viewing">
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-calendar</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-subtitle>Data</v-list-item-subtitle>
								<v-list-item-title>{{ formatDate(viewing.date) }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-clock</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-subtitle>Orario</v-list-item-subtitle>
								<v-list-item-title>{{
										availableHours.find(({value}) => value === viewing.hour).text
									}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-shape</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-subtitle>Tipologia</v-list-item-subtitle>
								<v-list-item-title>{{ viewing.type }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-lightning-bolt</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-subtitle>Cause</v-list-item-subtitle>
								<v-list-item-title>{{ (viewing.causes || ["altro"]).join(", ") }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-chart-timeline-variant</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-subtitle>Intensità</v-list-item-subtitle>
								<v-list-item-title>
									<v-slider :value="viewing.intensity" hide-details max="10" min="1" readonly step="1"
											  tick-size="4" ticks="always"/>
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-note</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-subtitle>Note</v-list-item-subtitle>
								<v-list-item-title>{{ viewing.notes }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card-text>
				<v-card-actions class="justify-center">
					<v-btn @click="viewing = undefined">Chiudi</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import {mapState} from "vuex";
import utilMixin from "@/mixins/utilMixin";
import vcolors from "vuetify/es5/util/colors";

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
			viewing: undefined,
			dialog: false,
			dialogLoading: false,
			dialogTitle: "Modifica elemento",
			currentEditing: null,
			editing: {},
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
		async deleteItem(id) {
			if (!await this.$dialog.warning({
				type: "error",
				text: "Sicuro di voler eliminare questo elemeto?",
				title: "Attenzione",
				persistent: true,
				showClose: false,
				actions: {
					false: {
						text: "Annulla"
					},
					true: {
						text: "Elimina", color: vcolors.red.base
					}
				}
			})) {
				return;
			}
			try {
				await this.$fireStore.collection("users").doc(this.user.uid)
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
<style lang="scss">
.list-enter-active, .list-leave-active {
	transition: all 1s;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
{
	opacity: 0;
}
</style>
