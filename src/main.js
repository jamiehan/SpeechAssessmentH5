import Vue from 'vue'
import App from './App.vue'
import 'vant/lib/index.css';
import { router } from './router';
import less from 'less'

Vue.config.productionTip = false

new Vue({
  router,
  less,
  render: h => h(App),
}).$mount('#app')
