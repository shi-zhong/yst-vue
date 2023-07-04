<script setup lang="ts">
import { useRoute } from 'vue-router';
import Index from './index.vue';


console.log(useRoute().meta)

</script>

<template>
  <Index />
</template>

<style scope lang="less"></style>
