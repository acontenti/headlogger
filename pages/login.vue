<template>
	<v-card :elevation="10" :loading="loading" class="px-2 pt-4 pb-0" color="#333" max-width="500px">
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
					<v-col class="d-flex flex-row justify-center align-center">
						<v-btn :loading="loading" class="ma-1" color="primary" large @click="signInUser">Sign In</v-btn>
						<v-btn :loading="loading" class="ma-1" color="info" large @click="createUser">Register</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
	name: "login",
	layout: "access",
	head: {
		title: "Login"
	},
	data() {
		return {
			loading: false,
			email: "",
			password: ""
		};
	},
	computed: {
		...mapGetters(["isLoggedIn"])
	},
	methods: {
		async createUser() {
			this.loading = true;
			try {
				const credential = await this.$fireAuth.createUserWithEmailAndPassword(this.email, this.password);
				await this.$fireStore.collection("users").doc(credential.user.uid).set({});
				this.loading = false;
				await this.$router.push("/app");
			} catch (e) {
				alert(e);
				this.loading = false;
			}
		},
		async signInUser() {
			this.loading = true;
			try {
				await this.$fireAuth.signInWithEmailAndPassword(this.email, this.password);
				this.loading = false;
				await this.$router.push("/app");
			} catch (e) {
				alert(e);
				this.loading = false;
			}
		}
	},
	async mounted() {
		await this.$fireAuth.setPersistence(this.$fireAuthObj.Auth.Persistence.LOCAL);
		if (this.isLoggedIn) {
			await this.$router.push("app");
		}
	}
};
</script>

<style scoped>

</style>
