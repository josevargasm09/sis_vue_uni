<template>
  <div>
    <v-subheader v-if="item.divider" class="text-12 mt-8 text-uppercase">{{
      item.divider
    }}</v-subheader>

    <v-list-item
      :to="{ name: item.to }"
      :active-class="` ${isDark ? 'primary--text ' : 'primary--text'}`"
      :height="48"
      class="text-18 base-item mb-2"
      v-ripple="{ class: 'primary--text' }"
    >
      <v-list-item-icon
        v-if="text"
        class="v-list-item__icon--text"
        v-text="computedText"
      />

      <v-list-item-icon class="min-w-0" v-else-if="item.icon">
        <v-icon class="text-16 vertical-sidebar-icon" v-text="item.icon" />
      </v-list-item-icon>

      <v-list-item-content
        class="pa-0 text-13 vertical-sidebar-text"
        v-if="item.title || item.subtitle"
      >
        <v-list-item-title class="ma-0 text-13" v-text="item.title" />

        <v-list-item-subtitle v-text="item.subtitle" />
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import Themeable from "vuetify/lib/mixins/themeable";

export default {
  name: "ItemTwo",

  mixins: [Themeable],

  props: {
    item: {
      type: Object,
      default: () => ({
        href: undefined,
        icon: undefined,
        subtitle: undefined,
        title: undefined,
        to: undefined,
      }),
    },
    text: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    computedText() {
      if (!this.item || !this.item.title) return "";

      let text = "";

      this.item.title.split(" ").forEach((val) => {
        text += val.substring(0, 1);
      });

      return text;
    },
    href() {
      return this.item.href || (!this.item.to ? "#" : undefined);
    },
  },
};
</script>
<style lang="scss">
// .base-item {
//   .v-list-item__icon {
//     margin-right: 0.9375rem !important;
//     min-width: 0;
//   }
// }
</style>
