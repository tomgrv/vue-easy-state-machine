// Vendor code
import Vue from "vue";

// Plugin
import VueEasyStateMachine from "../../src";
Vue.use(VueEasyStateMachine);

// Main Vue
import App from "./app.vue";

// Start main application
new Vue({
  render: h => h(App)
}).$mount("#app");
