import Vue from "vue";
import VCharts from "v-charts";
import echarts from "echarts/lib/echarts";
import dark from "@/assets/dark.json";

echarts.registerTheme("dark", dark);
Vue.use(VCharts);
