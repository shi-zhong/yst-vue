<script lang="ts">
import { RouterLink } from 'vue-router';

export default {
  beforeRouteEnter(to, from, next) {
    next(() => {
      console.log('before Rout enter next');
    });
    console.log('before route enter');
  },
  beforeRouteUpdate(to, from) {
    console.log('before route update');
  },
  beforeRouteLeave(to, from) {
    console.log('before route leave');
  },
  beforeCreate() {
    console.log('before create');
  },
  created() {
    console.log('create');
  },
  mounted() {
    console.log('mount');
    console.log(this.$router.currentRoute.value === this.$route)
  },
  updated() {
    console.log('update');
  },
  unmounted() {
    console.log('unmount');
  }
};


</script>

<template>
  <RouterLink to="/test/red">red</RouterLink>
  <br />
  <RouterLink to="/test/blue">blue</RouterLink>
  <br />
  <RouterLink to="/test2/red">red2</RouterLink>
  <br />
  <RouterLink to="/test2/blue">blue2</RouterLink>
</template>

<style scope lang="less"></style>
