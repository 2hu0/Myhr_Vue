import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router/router';
import store from './store';
import { initMenu } from './utils/menu';
import 'font-awesome/css/font-awesome.min.css';

import { postRequest } from './utils/api';
import { getRequest } from './utils/api';
import { deleteRequest } from './utils/api';
import { putRequest } from './utils/api';
import { postKeyValueRequest } from './utils/api';

Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;

Vue.config.productionTip = false

Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    next();
  } else {
    //如果登录的话
    if (window.sessionStorage.getItem("user")) {
      initMenu(router,store);
      next();
    } else{
      next('/?redirect='+to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
