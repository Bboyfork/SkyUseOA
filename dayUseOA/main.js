import Vue from 'vue'
import App from './App'
import store from './common/js/store.js'
import global from './common/js/global.js'
Vue.config.productionTip = false

Vue.prototype.$global = global;

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
 
app.$mount()
