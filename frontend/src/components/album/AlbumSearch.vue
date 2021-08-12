<template>
  <div class="search">
    <div class="bar">
      <input
        type="text"
        placeholder="Search albums by artist name"
        name="artist"
        v-on:keyup="updateAlbums"
      />
    </div>
    <div class="results">
      <AlbumGridComponent v-bind:albums="albums"></AlbumGridComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, ref } from 'vue';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  auditTime,
  switchMap,
  bufferTime,
  tap,
  map,
} from 'rxjs/operators';

import { Config } from '../../interfaces/Config.interface';
import { getAlbumService } from './album.service';
import AlbumGridComponent from './AlbumGrid.vue';
import { Album } from './Album.interface';

const artistNameSubject = new Subject<string>();

const artistNameQuery = (config: Config) =>
  artistNameSubject.pipe(
    // Remove white spaces
    map((input: string) => input.trim()),
    //Ignore repeated entries
    distinctUntilChanged(),
    //do a little delay to avoid multiple request
    auditTime(config.musicAPIRequestDelay),
  );

export default {
  props: ['config'],
  components: {
    AlbumGridComponent,
  },
  setup: (props) => {
    const config: Config = props.config;
    const albumService = getAlbumService(config);
    const albums = ref<Album[]>([]);

    // listen to changes in the input and send a request
    artistNameQuery(config)
      .pipe(
        //reset result on new input
        tap(() => {
          albums.value = [];
        }),
        // do the petition when we have the name
        switchMap((artistName: string) =>
          albumService.getAlbumsFromArtist(artistName),
        ),
        //group the values in an array
        bufferTime(config.musicAPIRequestDelay),
      )
      .subscribe({
        next: (response: Album[]) => {
          albums.value = [...albums.value, ...response];
        },
        error: (err) => {
          console.error(err);
        },
      });

    return {
      albums,
    };
  },
  methods: {
    updateAlbums(event: KeyboardEvent) {
      if ((event?.target as HTMLInputElement)?.value) {
        artistNameSubject.next((event?.target as HTMLInputElement)?.value);
      }
    },
  },
} as Component;
</script>

<style>
.search {
  display: block;
  width: 100%;
  padding: 10px;
}
.bar {
  text-align: center;
}
.bar input {
  width: 80%;
  padding: 7px;
  font-size: 18px;
  border-width: 1px;
  border-color: #cccccc;
  background-color: #ffffff;
  color: #000000;
  border-style: solid;
  border-radius: 17px;
  box-shadow: 0px 0px 5px rgba(66, 66, 66, 0.75);
}
.bar input:focus {
  outline: none;
}
</style>
