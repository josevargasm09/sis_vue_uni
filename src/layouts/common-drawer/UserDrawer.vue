<template>
    <vue-perfect-scrollbar
        :settings="{suppressScrollX: true, wheelPropagation: false}"
        class="h-100 rtl-ps-none ps scroll"
        style="height: 100%;"
    >
        <div class="pa-5 relative">
            <v-app-bar
                :color="$vuetify.theme.dark ? 'dark' : 'grey lighten-4'"
                :dark="$vuetify.theme.dark"
                class="pt-1"
                fixed
                flat
            >
                <div class="d-flex justify-space-between align-center w-full">
                    <h6 class="ma-0">CUENTA</h6>
                    <slot name="userDrawerCloseButton"></slot> 
                </div>
            </v-app-bar>
        </div>

        <div class="pa-5 mt-10">
            <div class="heading-label pa-0 mb-4">Perfil</div>
            <div class="d-flex align-center mb-10">
                <v-avatar size="56" class="mr-2">
                    <img
                        width="50"
                        height="50"
                        src="@/assets/images/faces/1.jpg"
                        alt=""
                    />
                </v-avatar>
                <div>
                    <a href="#" class="link-alt">
                        <!-- <p class="font-weight-medium ma-0 "> {{ currentUser.username }}</p> -->
                    </a>
                    <p class="body-2 text--disabled mb-2">
                    <!-- <span v-for="(role,index) in currentUser.roles" :key="index">{{role}}</span> -->
                    </p>
                </div>
            </div>
        </div>
    </vue-perfect-scrollbar>
</template>

<script>
export default {
    name: 'UserDrawer',
    props: {},
    data() {
        return {
            items: [
                 
            ]
        }
    },
    // computed: {
    //     currentUser() {
    //   return this.$store.state.auth.user;
    // },
    // },
    methods: {}
}
</script>

<style scoped></style>
