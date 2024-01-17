import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Theme: "dark", // theme can be light or dark
    LayoutType: "full-sidebar", // this can be full-sidebar, mini-sidebar
    Sidebar_drawer: false,
    Customizer_drawer: false,
    SidebarColor: "dark", //Change sidebar Color || 'white', | "#2b2b2b" | "rgb(44, 59, 164)" | "rgb(96, 44, 164)" | "rgb(151, 210, 219)" | "rgb(77, 86, 100)"
    navbarColor: "gradient-info", //Change navbar Color || 'white', | "gradient-info" | "gradient-success" | "gradient-primary" | "gradient-danger" | "gradient-dark"
    logoColor: "dark", //Change Logo Color || 'white', | "#2b2b2b" | "rgb(44, 59, 164)" | "rgb(96, 44, 164)" | "rgb(151, 210, 219)" | "rgb(77, 86, 100)"
    setHorizontalLayout: false, // Horizontal layout
    Direction: "ltr", // possible value  rtl / ltr
    // Calendar Events
    calendarEvents: [
      {
        title: "test",
        allDay: true,
        start: moment(),
        end: moment().add(1, "d"),
      },
    ],
  },
  mutations: {
    SET_THEME(state, payload) {
      state.Theme = payload;
    },
    SET_LAYOUT_TYPE(state, payload) {
      state.LayoutType = payload;
    },
    SET_SIDEBAR_DRAWER(state, payload) {
      state.Sidebar_drawer = payload;
    },
    SET_CUSTOMIZER_DRAWER(state, payload) {
      state.Customizer_drawer = payload;
    },
    SET_SIDEBAR_COLOR(state, payload) {
      state.SidebarColor = payload;
    },
    SET_NAVBAR_COLOR(state, payload) {
      state.navbarColor = payload;
    },
    SET_LOGO_COLOR(state, payload) {
      state.logoColor = payload;
    },
    SET_LAYOUT(state, payload) {
      state.setHorizontalLayout = payload;
    },
    SET_DIRECTION(state, payload) {
      state.Direction = payload;
    },
    // Add Calendar event
    ADD_CALENDAR_EVENT(state, event) {
      const newEvent = Object.assign({}, event);
      state.calendarEvents.push(newEvent);
    },
  },
  actions: {
    setLayoutType({ commit }, width) {
      commit("SET_LAYOUT_TYPE", width);
    },
    //Calendar Action
    addCalendarEvent({ commit }, event) {
      commit("ADD_CALENDAR_EVENT", event);
    },
  },
  getters: {},
});
