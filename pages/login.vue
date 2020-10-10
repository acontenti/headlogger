<template>
	<v-dialog v-model="dialog" max-width="500px" persistent>
		<v-card :loading="loading" class="px-2 pt-4" color="#333">
			<v-card-title class="justify-center">
				<h2>HeadLogger</h2>
			</v-card-title>
			<v-card-text>
				<v-form>
					<v-row>
						<v-col cols="12">
							<v-text-field v-model="email" label="E-mail" prepend-icon="mdi-email" required
										  type="email"></v-text-field>
						</v-col>
						<v-col cols="12">
							<v-text-field v-model="password" clearable label="Password" prepend-icon="mdi-lock" required
										  type="password"></v-text-field>
						</v-col>
						<v-col class="d-flex flex-column justify-center align-center">
							<v-btn class="ma-1" color="primary" large @click="signInUser">Sign In</v-btn>
							<v-btn class="ma-1" color="info" large @click="createUser">Register</v-btn>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>

export default {
	name: "login",
	layout: "access",
	middleware: "autoLogin",
	head: {
		title: "Login"
	},
	data() {
		return {
			dialog: true,
			loading: false,
			email: "",
			password: ""
		};
	},
	methods: {
		async createUser() {
			this.loading = true;
			try {
				const credential = await this.$fireAuth.createUserWithEmailAndPassword(this.email, this.password);
				await this.$fireStore.collection("users").doc(credential.user.uid).set({});
				await this.$router.push("app");
			} catch (e) {
				alert(e);
			}
			this.loading = false;
		},
		async signInUser() {
			this.loading = true;
			try {
				await this.$fireAuth.signInWithEmailAndPassword(this.email, this.password);
				await this.$router.push("app");
			} catch (e) {
				alert(e);
			}
			this.loading = false;
		}
	},
	async mounted() {
		await this.$fireAuth.setPersistence(this.$fireAuthObj.Auth.Persistence.LOCAL);
	}
};
</script>

<style scoped>

</style>
