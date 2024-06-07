import Vuex from 'vuex'
import Vue from 'vue'
import largeSidebar from './modules/largeSidebar'
import compactSidebar from './modules/compactSidebar'
import chat from './modules/chat'
import themeConfig from './modules/themeConfig'
import authService from '../views/app/services/authService'
import invoice from './modules/invoice'
import cart from './modules/cart'
import verticalSidebar from './modules/verticalSidebar' 
import scrumboard from './modules/scrumboard'
import { auth } from '../views/app/store/auth.module';

// Load Vuex
Vue.use(Vuex)

// Create store
export default new Vuex.Store({
  modules: {
    largeSidebar,
    compactSidebar,
    chat,
    themeConfig,
    auth,
    authService,
    invoice,
    cart,
    auth,
    verticalSidebar,
    scrumboard,
  },
})
