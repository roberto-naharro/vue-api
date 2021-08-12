<template>
  <div class="albumGrid">
    <AlbumComponent
      v-for="item in albums"
      v-bind:album="item"
      v-bind:key="item.id"
    ></AlbumComponent>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue';
import AlbumComponent from './Album.vue';
export default {
  components: {
    AlbumComponent,
  },
  props: ['albums'],
} as Component;
</script>

<style>
.albumGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 210px);
}
.albumGrid .album {
  margin: 5px;
}
</style>
