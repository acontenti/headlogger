<template>
	<v-app dark>
		<v-app-bar app clipped-left>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
			<v-toolbar-title>HeadLogger</v-toolbar-title>
			<v-spacer/>
			<span v-if="user" class="mx-md-4 mx-2 subtitle-2">{{ user.email }}</span>
			<v-tooltip bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn v-bind="attrs" v-on="on" icon @click="logout">
						<v-icon>mdi-logout</v-icon>
					</v-btn>
				</template>
				<span>Logout</span>
			</v-tooltip>
		</v-app-bar>
		<v-navigation-drawer v-model="drawer" app clipped>
			<v-list>
				<v-list-item v-for="(item, i) in items" :key="i" :to="item.to" exact router>
					<v-list-item-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title v-text="item.title"/>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-main>
			<v-container class="d-flex flex-fill flex-column">
				<nuxt/>
			</v-container>
		</v-main>
		<v-footer app>
			<span>Copyright &copy; {{ new Date().getFullYear() }}, Alessandro Contenti</span>
		</v-footer>
	</v-app>
</template>

<script>
import {mapState} from "vuex";

export default {
	middleware: "authenticated",
	data() {
		return {
			drawer: !this.$vuetify.breakpoint.mobile,
			items: [
				{
					icon: "mdi-apps",
					title: "Home",
					to: "/app"
				},
				{
					icon: "mdi-calendar",
					title: "Calendario",
					to: "/app/calendar"
				},
				{
					icon: "mdi-chart-bar",
					title: "Statistiche",
					to: "/app/stats"
				}
			]
		};
	},
	computed: {
		...mapState(["user"])
	},
	methods: {
		async logout() {
			try {
				await this.$fireAuth.signOut();
				await this.$router.push("/login");
			} catch (e) {
				alert(e);
			}
		}
	}
};
</script>
