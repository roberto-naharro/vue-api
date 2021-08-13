import faker from 'faker';

import { shallowMount } from '@vue/test-utils';
import AlbumComponent from '@/components/album/Album.vue';
import { Album } from '@/components/album/Album.interface';

describe('Album.vue', () => {
  it('renders props.album title when passed', () => {
    const album: Album = {
      thumbnailUrl: faker.internet.url(),
      artistName: faker.company.companyName(),
      id: faker.datatype.number(),
      title: faker.company.catchPhrase(),
    };
    const wrapper = shallowMount(AlbumComponent, {
      props: { album },
    });
    expect(wrapper.text()).toEqual(album.title);
  });
});
