<template>
  <div>
    <v-navigation-drawer
      v-model="getThemeMode.verticalCompactSidebarDrawer"
      :color="
        $vuetify.theme.dark ? 'dark' : getThemeMode.verticalSidebarDrawerColor
      "
      :dark="getThemeMode.verticalSidebarDrawerColor != 'white' ? true : false"
      width="300px"
      app
      mobile-breakpoint="1120"
      class="shadow-sm rounded-r-md"
      floating
      height="100vh"
      :right="$vuetify.rtl"
    >
      <v-row class="fill-height flex-row flex ma-0" no-gutters>
        <v-card
          class="shadow-sm rounded-r-sm"
          min-width="70"
          max-width="70"
          max-height="100%"
          color="dark"
          tile
          dark
        >
          <vue-perfect-scrollbar
            :settings="{
              suppressScrollX: true,
              wheelPropagation: false,
            }"
            class="
              h-100
              rtl-ps-none
              ps
              scroll
              grow
              d-flex
              flex-column
              align-center
              justify-space-between
            "
            style="height: 100%"
          >
            <div class="d-flex flex-column align-center">
              <v-list dense nav class="px-0">
                <v-list-item class="px-0 ma-0 mb-3">
                  <v-list-item-avatar class="px-0 ma-0">
                    <v-img src="@/assets/images/arctic-circle-logo.svg"></v-img>
                  </v-list-item-avatar>
                </v-list-item>
                <v-list-item
                  v-for="item in items.slice(0, 6)"
                  :key="item.title"
                  class="mb-3 px-0"
                >
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" icon>
                        <v-icon size="20">{{ item.iconTwo }}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ item.title }}</span>
                  </v-tooltip>
                </v-list-item>
              </v-list>
            </div>
            <!-- bottom -->
            <div class="d-flex flex-column justify-end align-center">
              <v-list dense nav class="px-0">
                <v-list-item class="mb-3 px-0">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        @click="userDrawer = !userDrawer"
                      >
                        <v-avatar size="30" class="ml-2">
                          <v-img src="@/assets/images/faces/1.jpg"></v-img>
                        </v-avatar>
                      </v-btn>
                    </template>
                    <span>User Settings</span>
                  </v-tooltip>
                </v-list-item>

                <v-list-item class="mb-3 px-0">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-badge
                        size="15"
                        bordered
                        overlap
                        content="3"
                        color="red"
                        offset-x="18"
                        offset-y="18"
                      >
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          icon
                          @click="notificationDrawer = !notificationDrawer"
                        >
                          <v-icon size="25">mdi-bell</v-icon>
                        </v-btn>
                      </v-badge>
                    </template>
                    <span>Notification</span>
                  </v-tooltip>
                </v-list-item>

                <v-list-item class="mb-3 px-0">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        @click="searchDrawer = !searchDrawer"
                      >
                        <v-icon size="20">mdi-magnify</v-icon>
                      </v-btn>
                    </template>
                    <span>Search</span>
                  </v-tooltip>
                </v-list-item>
              </v-list>
            </div>
          </vue-perfect-scrollbar>
        </v-card>

        <vue-perfect-scrollbar
          :settings="{ suppressScrollX: true, wheelPropagation: false }"
          class="h-100 rtl-ps-none ps scroll grow"
          style="height: 100%"
        >
          <v-list class="grow" max-width="230">
            <template v-for="(item, i) in computedItems">
              <base-item-group
                v-if="item.children"
                :key="`group-${i}`"
                :item="item"
              ></base-item-group>

              <base-item v-else :key="`item-${i}`" :item="item" />
            </template>
          </v-list>
        </vue-perfect-scrollbar>
      </v-row>
    </v-navigation-drawer>
    <!-- end of sidebar drawer -->

    <!-- userDrawer -->
    <v-navigation-drawer
      v-model="userDrawer"
      fixed
      left
      height="100%"
      temporary
      floating
      width="350"
    >
      <user-drawer>
        <template v-slot:userDrawerCloseButton>
          <v-btn icon color="" @click.stop="userDrawer = !userDrawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </user-drawer>

      <template v-slot:append>
        <div class="my-4 mx-4">
          <base-hover-button
            text="Logout"
            block
            bg-color="primary lighten-5 primary--text"
            icon-name="mdi-logout"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- notificationDrawer  -->
    <v-navigation-drawer
      v-model="notificationDrawer"
      fixed
      left
      height="100%"
      temporary
      floating
      width="350"
    >
      <notification-drawer>
        <template v-slot:notificationDrawerCloseButton>
          <v-btn
            icon
            color
            @click.stop="notificationDrawer = !notificationDrawer"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </notification-drawer>

      <template v-slot:append>
        <div class="my-4 mx-4">
          <base-hover-button
            text="View All Notifications"
            block
            bg-color="primary lighten-5 primary--text"
          />
        </div>
      </template>
    </v-navigation-drawer>
    <!-- searchDrawer -->
    <v-navigation-drawer
      v-model="searchDrawer"
      fixed
      left
      height="100%"
      temporary
      floating
      width="380"
    >
      <search-drawer>
        <template v-slot:searchDrawerCloseButton>
          <v-btn icon color @click.stop="searchDrawer = !searchDrawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </search-drawer>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { items } from "../../data/navigationTwo";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    UserDrawer: () => import("../common-drawer/UserDrawer.vue"),
    NotificationDrawer: () => import("../common-drawer/NotificationDrawer.vue"),
    SearchDrawer: () => import("../common-drawer/SearchDrawer.vue"),
  },
  data() {
    return {
      drawer: true,
      items: items,
      userDrawer: false,
      notificationDrawer: false,
      searchDrawer: false,
      items2: ["mdi-home", "mdi-play"],
      imtemsAside: ["mdi-play"],
    };
  },
  computed: {
    ...mapGetters(["getThemeMode"]),
    computedItems() {
      return this.items.map(this.mapItem);
    },
  },
  methods: {
    ...mapActions(["changeCompactVerticalSidebarDrawer"]),
    toggleSidebar() {
      this.changeCompactVerticalSidebarDrawer();
    },
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: item.title,
      };
    },
  },
};
</script>
