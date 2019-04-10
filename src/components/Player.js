import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Playlist } from './PlayerFunctions/Playlist';
import { Top } from './PlayerFunctions/Top';
import { fetchPlaylist, PlaylistContext } from './store/playlist'

export function Player() {
  const [playlist, setPlaylist] = useState([])
  const [currentTrack, setCurrentTrack] = useState(0)

  const handleChangeTrack = id => {
    setCurrentTrack(id);
  };

  const handleNextTrack = () => {
    if(currentTrack === playlist.length - 1) {
      setCurrentTrack(0);
      return;
    }
    setCurrentTrack(currentTrack + 1);
  }

  const handlePrevTrack = () => {
    if(currentTrack === 0) {
      setCurrentTrack(playlist.length - 1)
      return;
    }
    setCurrentTrack(currentTrack - 1);
  }

  const handleFetchData = async() => {
    const playlist = await fetchPlaylist();
    setPlaylist(playlist);
  }

  useEffect(() => {
    handleFetchData();
  }, []);

  if(playlist.length === 0){
    return(
      <div>
        <PlaylistContext.Provider value={{ handleNextTrack, handlePrevTrack}}>
          <Top track={playlist[currentTrack]} />
        </PlaylistContext.Provider>
      </div>
    )
  }
}