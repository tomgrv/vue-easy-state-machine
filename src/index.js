export default {
	install(Vue) {
		// Component
		Vue.component('easy-state-machine', require('./easy-state-machine.vue').default);
	}
};
