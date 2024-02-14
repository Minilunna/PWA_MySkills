import { createApp } from 'vue'
import App from '@/App.vue'

import router from '@/router'
import store from '@/store'

//plugins
import { FontAwesomeIcon } from '@/plugins/font-awesome'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


//Create the app
createApp(App)
  .use(store)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app')
