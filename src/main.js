import Vue from 'vue'
import App from './App.vue'
import 'vant/lib/index.css';
import { router } from './router';
import request from './components/lib/request'
import less from 'less'
import VConsole from 'vconsole'

Vue.config.productionTip = false
Vue.prototype.request = request

new VConsole()

new Vue({
  router,
  less,
  render: h => h(App),
}).$mount('#app')
