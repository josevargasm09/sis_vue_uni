<template>
  <div>
    <v-sheet class="header-backup"></v-sheet>
    <!-- CAMBIAR TAAMAÑO DE ANCHO  HEADER -->
    <v-app-bar
      :color="$vuetify.theme.dark ? 'dark' : getThemeMode.appBarColor"
      :dark="getThemeMode.appBarColor != 'white' ? true : false"
      app
      class="px-sm text-left shadow-sm ma-4 rounded-lg"
      flat
      height="75"   
    >
  
      <vue-navigation-bar class="mt-0" :options="navbarOptions" />
      <v-progress-linear
        :active="getThemeMode.isLoading"
        :indeterminate="getThemeMode.isLoading" 
        absolute
        bottom
        color="primary"
      />

      <!-- <v-toolbar-title>Egret Vue</v-toolbar-title> -->

      <v-spacer />

      <v-chip
        pill
        class="transparent rounded-pill py-6"
        @click="username = !username"
      >
      {{ currentUser.username }}
        <v-avatar class="ml-2">
          <v-img src="@/assets/images/faces/1.jpg"></v-img>
        </v-avatar>
      </v-chip>
    </v-app-bar>
    <!-- userDrawer -->
    <v-navigation-drawer
      v-model="username"
      fixed
      right
      height="30%"
      temporary
      floating
      width="350"
    >
      <user-drawer>
        <template v-slot:usernameCloseButton>
          <v-btn icon color @click.stop="username = !username">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </user-drawer>

      <template v-slot:append>
        <div class="my-4 mx-4">
          <!-- Cerrar sesión -->
          <base-hover-button
           
             @click.native="logOut"
            text="Cerrar sesión"
            block
            bg-color="primary lighten-5 primary--text"
            icon-name="mdi-logout"
          />
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "VerticallAppBar",
  components: {
    UserDrawer: () => import("../common-drawer/UserDrawer.vue"),
    NotificationDrawer: () => import("../common-drawer/NotificationDrawer.vue"),
    SearchDrawer: () => import("../common-drawer/SearchDrawer.vue"),
  },
  // muestra nombre de usuario en el appbar
  computed: {
    ...mapGetters(["getThemeMode"]),

    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  data() {
    return {
      username: false,
      notificationDrawer: false,
      searchDrawer: false,
      navbarOptions: {
        elementId: "main-navbar",
        isUsingVueRouter: true,
        mobileBreakpoint: 992,
        brandImagePath: "./",
        brandImageAltText: "brand-image",
        collapseButtonOpenColor: "#661c23",
        collapseButtonCloseColor: "#661c23",
        showBrandImageInMobilePopup: true,
        ariaLabelMainNav: "Main Navigation",
        tooltipAnimationType: "shift-away",
        menuOptionsLeft: [
  
        ],
      },
    };
  },
  methods: {
    ...mapActions([
      "changeVerticalSidebarDrawer",
      ,
      "changeVerticalSidebarMini",
      "signOut",
    ]),
    toggleVerticalSidebarDrawer() {
      this.changeVerticalSidebarDrawer();

      // this.$emit("update:mini-variant");
      // console.log("check");
    },

    // Funcion cerrar sesion 

    logOut() {
      this.$store.dispatch('auth/logout');
      // this.signOut();

      this.$router.push("/app/sessions/login");
    },
  },
};
</script>

<style lang="scss">
.header-backup {
  display: block;
  width: 100%;
  height: 102px;
  position: fixed;
  top: 0;
  z-index: 5;
  background: linear-gradient(
    180deg,
    hsla(0, 0%, 97.3%, 0.95) 44%,
    hsla(0, 0%, 97.3%, 0.46) 73%,
    hsla(0, 0%, 100%, 0)
  ) !important;
  left: 0;
  &.theme--dark {
    background: linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.95) 44%,
      rgba(0, 0, 0, 0.46) 3%,
      hsla(0, 0%, 100%, 0)
    ) !important;
  }
}
.tippy-box[data-theme~="light"] {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.vnb {
  background: transparent !important;
  &__menu-options {
    margin-top: 3px !important;
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        &:hover {
          color: #0081ff;
          .vnb__menu-options__option__arrow {
            fill: #0081ff;
          }
        }

        &__icon {
          svg {
            fill: #0081ff !important;
          }
        }
      }
    }
  }

  &__sub-menu-options {
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        color: #000 !important;
        &:hover {
          color: #0081ff !important;
        }
      }
    }
  }
}

.vnb__collapse-button {
  &:focus {
    border: 1px solid none;
    outline: none;
  }
  &:after {
    content: "\F035C";
    font-size: 25px;
    font-weight: 600;
    font-family: "Material Design Icons";
  }
  svg {
    display: none !important;
  }
}

.vnb__popup {
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll !important;
  .vnb__popup__top__close-button {
    &:focus {
      border: 1px solid none;
      outline: none;
    }
    top: 20px;
    right: -33px;
    svg {
      fill: #000 !important;
    }
  }
}
</style>
