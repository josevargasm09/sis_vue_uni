<template>
    <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{currentUser.username}}</strong> Profile
      </h3>
    </header>
    <p v-if="currentUser.accessToken">
      <strong>Token:</strong>
      {{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}
    </p>
    <p v-else>
      <strong>Token:</strong> No token available
    </p>
    <p>
      <strong>Id:</strong>
      {{currentUser.id}}
    </p>
    <p>
      <strong>Email:</strong>
      {{currentUser.email}}
    </p>
    <strong>Authorities:</strong>
    <ul>
      <li v-for="(role,index) in currentUser.roles" :key="index">{{role}}</li>
    </ul>
  </div>
</template>
<script>
import analyticOneCard from "@/components/card/AnalyticCardVersionOne";
import analyticTwoCard from "@/components/card/AnalyticCardVersionTwo";
import {
  analyticOne,
  analyticTwo,
  analyticThree,
  analyticFour,
  analyticFive,
} from "@/data/analytic2";
export default {
  name: "Analytic",
  metaInfo: {
    // title will be injected into parent titleTemplate
    title: "Analytic",
  },
// agragado recientemente
  computed: {
    currentUser() {
 
      return this.$store.state.auth.user;
    }
  },

  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },

  components: {
    "analytic-one-card": analyticOneCard,
    "analytic-two-card": analyticTwoCard,
  },
  data() {
    return {
      analyticOne,
      analyticTwo,
      analyticThree,
      analyticFour,
      analyticFive,
    };
  },
};
</script>
