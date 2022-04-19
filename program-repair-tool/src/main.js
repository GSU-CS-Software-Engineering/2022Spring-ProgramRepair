import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
//Bulma CSS is used in this project, as shown here.
import 'bulma/css/bulma.css';

import Toaster from "@meforma/vue-toaster";
createApp(App).use(Toaster).mount("#App");

const app = createApp(App);



/*
The following statement is a bit odd.
Apparently it's supposed to prevent an annoying message that's printed to the console stating the Vue is running in development mode, but this method of disabling it was removed in the transition from Vue2 to Vue3.
Therefore this code should not work.
Regardless of if it works or not, I do not see the message online as shown at: https://www.codetd.com/en/article/6809485
Most likely not worth figuring out, just writing this here in case it comes up later.
*/
app.config.productionTip = false;

app.use(router);

//The statement below mounts the app component at the element with id "app", which is in /public/index.html
app.mount('#app');