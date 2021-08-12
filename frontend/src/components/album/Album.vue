<template>
  <div class="album">
    <h1 class="title">{{ album.title }}</h1>
    <img v-bind:src="album.thumbnailUrl" alt="Album image" class="cover" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue';
export default {
  props: ['album'],
} as Component;
</script>

<style>
.album {
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
}

.album .title {
  font-size: 14px;
}

.album .cover {
  width: 100%;
  object-fit: contain;
}
</style>
