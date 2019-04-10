import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Icon } from 'react-icons-kit';
import { 
  ic_play_arrow,
  ic_pause,
  ic_stop,
  ic_skip_next,
  ic_skip_preview,
} from 'react-icons-kit/md';

import { ProgressBar } from './ProgressBar'
import { PlaylistContext } from '../store/playlist';

const secondsToMinSec = time => {
  if(time === 0){
    return '0:00'
  }
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:0${seconds}`;
};

export function Audio(props){
  let audioPlayer

  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);
  const [currentTrackMoment, setCurrentTrackMoment] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState (0);
  const [isPlaying, setIsPlaying] = useState(false);

  const initPlayer = () => {
    audioPlayer = document.getElementById('audioPlayer');
  };

  const handleStop = () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0.0;
    setIsPlaying(false);
    setCurrentTrackMoment(0)
  };

  const handlePlay = () => {
    if(audioPlayer.paused || audioPlayer.ended){
      audioPlayer.play();
      setIsPlaying(true);
    } else {
      audioPlayer.pause();
      setIsPlaying(false)
    }
  };

  handleMetaData = () => {
    
  }
}