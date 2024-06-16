<template>
  <v-app>
    <NotificationSnackbar />
    <router-view />
  </v-app>
</template>

<script>

import NotificationSnackbar from './components/NotificationSnackbar.vue';
export default {
  name: "App",
  metaInfo() {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "Octavia-Admin",
      // all titles will be injected into this template
      titleTemplate:
        "%s | Octavia Admin - Vuejs & VuetifyJs Admin Dashboard Template "
    };
  },

  components: {
    NotificationSnackbar
  },
  methods: {
    getRouterParams() {
      // console.log(this.$router.currentRoute.query);
    }
  },
  created() {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", e => {
      console.log(mq);
      this.$vuetify.theme.dark = e.matches;
    });
    this.getRouterParams();
  }
};
</script>
