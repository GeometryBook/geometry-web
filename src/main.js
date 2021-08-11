// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import mathConfig from './js/mathConfig'

Vue.use(VueQuillEditor)
Vue.use(ElementUI)
Vue.prototype.mathConfig = mathConfig
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // 直接使用render函数加载App组件提高效率
  render: h => h(App)
})
