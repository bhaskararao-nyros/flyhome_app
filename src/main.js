// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FullCalendar from 'vue-full-calendar'
import Notifications from 'vue-notification'
import Popover from 'vue-js-popover'
import BootstrapVue from 'bootstrap-vue'
import GSignInButton from 'vue-google-signin-button'
import VueGeolocation from 'vue-browser-geolocation'
import VueSocketio from 'vue-socket.io'
import VDateRange from 'vuetify-daterange-picker'

import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'fullcalendar-scheduler'
import 'fullcalendar/dist/fullcalendar.min.css'
import 'fullcalendar-scheduler/dist/scheduler.min.css'
import 'mdbvue/build/css/mdb.css'


Vue.use(VDateRange)
Vue.use(FullCalendar)
Vue.use(Notifications)
Vue.use(Popover)
Vue.use(BootstrapVue)
Vue.use(GSignInButton)
Vue.use(VueGeolocation)
Vue.use(VueSocketio, 'http://10.90.90.55:8081')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
