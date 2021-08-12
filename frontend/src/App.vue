<template>
  <AlbumSearch v-bind:config="config" />
</template>

<script lang="ts">
import AlbumSearch from './components/album/AlbumSearch.vue';
import { Component } from 'vue';
import { config } from './config';

export default {
  components: {
    AlbumSearch,
  },
  data: () => {
    return {
      config,
    };
  },
} as Component;
</script>
