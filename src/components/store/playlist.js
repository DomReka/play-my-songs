import React from 'react';

const fetchedPlaylist = [
  {
    id: 0,
    title: '01 Lazy beat',
    author: 'Before Coffee Drummer',
    url: 'https://api.codebooyah.com/audio/track1.ogg',
    cover: 'https://via.placeholder.com/300/D4CBEB',
  },
  {
    id: 1,
    title: '02 Blasting beat',
    author: 'The ADHD Drummer',
    url: 'https://api.codebooyah.com/audio/track2.ogg',
    cover: 'https://via.placeholder.com/300/A89ACD',
  },
  {
    id: 2,
    title: '03 Lazy beat',
    author: 'Before Coffee Drummer',
    url: 'https://api.codebooyah.com/audio/track1.ogg',
    cover: 'https://via.placeholder.com/300/B6A2EB',
  },
  {
    id: 3,
    title: '04 Blasting beat',
    author: 'The ADHD Drummer',
    url: 'https://api.codebooyah.com/audio/track2.ogg',
    cover: 'https://via.placeholder.com/300/9A8CBE',
  },
];

// mock api request
export const fetchPlaylist = () => {
  return new Promise((res, rej) => {
    setTimeout(() => res(fetchedPlaylist), 1000);
  });
};

export const PlaylistContext = React.createContext();
