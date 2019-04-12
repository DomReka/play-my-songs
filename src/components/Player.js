import React, { Component } from 'react'
import Playlist from './PlayerFunctions/Playlist'
import FakeData from '../assets/database';

String.prototype.toHHMMSS = function(){
  var sec_num = parseInt(this, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num - (hours * 3600) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if(seconds < 10){seconds = "0" + seconds}
  return (hours > 0 ? hours + ":" : "" )
}

class Player extends Component {
  constructor(){
    super();

    this.state = {
      PlaylistTracks: FakeData,
      currentTrackIndex: 1,
      trackId: null,
      trackTitle: '',
      trackURL: '',
      player: new Audio(),
      totalDuration: 0,
      currentTime: 0,
      progressBar: 0,
      loop: false,
      shuffle: false,
      sidebar: false,
      playing: false,
      volume: 0.5,
      trackLoaded: false,
      progressHandleActive: false,
      progressBarStart: "0%",
      progressBarEnd: "100%",
      volumeHandleActive: false,
      volumeDown: "0%",
      volumeUp: "100%",
      searchString: ""
    }
  }

  updateSearchString = (event) => {
    this.setState(
      {searchString: event.target.value}
    );
  }

  toggleSidebar = () => {
    this.setState({sidebar: !this.state.sidebar});
  }

  toggleLoop = () => {
    const player = this.state.player;
    player.loop = !this.state.loop;
    this.setState({player: player, loop: !this.state.loop});
  }

  toggleShuffle = () => {
    this.setState({shuffle: !this.state.shuffle})
  }

  playNext = () => {
    let currentTrackIndex = this.state.currentTrackIndex;
    if(!this.state.shuffle){
      currentTrackIndex += 1;
      if(currentTrackIndex >= this.state.PlaylistTracks.length){
        currentTrackIndex = 0
      }
    } else {
      currentTrackIndex = Math.floor((Math.random() * (this.state.PlaylistTracks.length)) + 0)
    }
    this.setState({currentTrackIndex: currentTrackIndex}, this.loadTrackIntoState)
  }

  playPrev = () => {
    let currentTrackIndex = this.state.currentTrackIndex;
    if(!this.state.shuffle){
      currentTrackIndex -= 1;
      if(currentTrackIndex < 0){
        currentTrackIndex = this.state.PlaylistTracks.length - 1
      }
    } else {
      currentTrackIndex = Math.floor((Math.random() * (this.state.PlaylistTracks.length)) + 0)
    }
  }

  selectTrack = (event, trackId) => {
    let currentTrackIndex = 0;
    this.state.PlaylistTracks.map((track, index) => {
      if(track.id === trackId){
        currentTrackIndex = index;
      }
      return track;
    })
    this.setState({currentTrackIndex: currentTrackIndex},() => {this.loadTrackIntoState()});
    return false;
  }

  updatePlayingInfo = () => {
    const player = this.state.player;
    const totalDuration = parseInt(player.duration, 10)
      .toString()
      .toHHMMSS();
    this.setState({
      totalDuration: totalDuration,
      currentTime: currentTime,
      progressBar: 
        !this.state.progressHandleActive ? currentTime : this.state.progressBar
    },
    () => {
      this.updateProgressBar()
    })
  }

  updateProgressBar = () => {
    const progressHandleCtrParent = document.getElementById("progressHandleCtr").parentElement;
    const progressHandleCtr = document.getElementById("progressHandleCtr");

    if(progressHandleCtrParent !== undefined && progressHandleCtr !== undefined){
      const progressHandleCtrParentWidth = parseFloat(window.getComputedStyle(progressHandleCtrParent, null).width);
      const totalTimePtg = 
        parseFloat(this.state.player.currentTime / this.state.player.duration) * parseFloat(progressHandleCtrParentWidth)
        this.setState({
          progressBarStart: 
            !this.state.progressHandleActive ? totalTimePtg + "px" : this.state.progressBarStart, 
          progressBarEnd: (progressHandleCtrParentWidth - totalTimePtg) + "px"
        });
    }
  }

  playPause = () => {
    if(this.state.playing){
      this.state.player.play();
    } else {
      this.state.player.pause();
    }
  }

  onPlayPauseClickHandler = () => {
    this.setState({playing: !this.state.playing},
      () => {
        this.playPause();
      });
  }

  touchPositionfst = 0;
  spannedTime = 0;
  volume = 0;

  progBarPickHandler = (event) => {
    if(event.type === 'mousedown'){
      this.touchPositionfst = event.pageX;
      document.addEventListener('mousemove', this.progBarMoveHandler);
      document.addEventListener('mouseup', this.progBarDropHandler)
    } else if (event.type === 'touchstart'){
      this.touchPositionfst = event.touches[0].pageX;
      event.target.addEventListener('touchmove', this.progBarMoveHandler)
      event.target.addEventListener('touchend', this.progBarDropHandler)
    }

    const handleCtr = document.getElementById('progressHandleCtr');
    const progressBarWidth = 
      parseFloat(window.getComputedStyle(handleCtr.parentElement, null).width);

    let handleCtrStart = 
      (this.touchPositionfst - handleCtr.parentElement.clientLeft - parseFloat(window.getComputedStyle(
        document.getElementsByClassName('player')[0], null).paddingLeft
      )) + "px";

    if(parseFloat(handleCtrStart) < 0){
      handleCtrStart = '0px'
    } else if(parseFloat(handleCtrStart) > progressBarWidth) {
      handleCtrStart = progressBarWidth +'px'
    }

    this.spannedTime =
      parseFloat(this.state.player.duration / progressBarWidth) * parseFloat(handleCtrStart);

    this.setState({
      progressHandleActive: true,
      progressBarStart: handleCtrStart,
      progressSpanTime: this.spannedTime.toString().toHHMMSS
    });
  }

  progBarMoveHandler = (event) => {
    let touchPositionSnd = 0;
    if(event.type === 'mousemove'){
      touchPositionSnd = event.pageX;
      document.addEventListener('mouseup', this.progBarDropHandler);
    } else if(event.type === 'touchmove'){
      touchPositionSnd = event.touches[0].pageX;
      event.target.addEventListener('touchend', this.progBarDropHandler);
    }

    const handleCtr = document.getElementById('progressHandleCtr');
    const progressBarWidth = 
      parseFloat(window.getComputedStyle(handleCtr.parentElement, null).width);
    
    let calcPos = touchPositionSnd - this.touchPositionfst;
    this.touchPositionfst = touchPositionSnd;

    let handleCtrStart = parseFloat(this.state.progressHandleCtrStart) + calcPos + 'px'

    if(parseFloat(handleCtrStart) < 0){
      handleCtrStart = '0px';
    } else if(parseFloat(handleCtrStart) > progressBarWidth){
      handleCtrStart = progressBarWidth + '0px'
    }

    this.spannedTime = 
      parseFloat(this.state.player.duration / progressBarWidth) * parseFloat(handleCtrStart);

    this.setState({
      progressHandleCtrStart: handleCtrStart,
      progressSpanTime: this.spannedTime.toString().toHHMMSS()
    });
  }

  progBarDropHandler = (event) => {
    const player = this.state.player;
    player.currentTime = this.spannedTime;
    this.setState({
      player: player,
      progressHandleActive: false,
      currentTime: this.spannedTime.toString().toHHMMSS(),
      progressSpanTime: this.spannedTime.toString().toHHMMSS()
    },
    () => {
      event.target.removeEventListener('touchmove', this.progBarMoveHandler);
      event.target.removeEventListener('touchend', this.progBarDropHandler);
      event.target.removeEventListener('mousemove', this.progBarMoveHandler);
      event.target.removeEventListener('mouseup', this.progBarDropHandler);
    })
  }

  volumeBarPickHandler = (event) => {
    if(event.type === 'mousedown'){
      this.touchPositionfst = event.pageX;
      document.addEventListener('mousemove', this.volumeBarMoveHandler);
      document.addEventListener('mouseup', this.volumeBarDropHandler);
    } else if (event.type === 'touchstart'){
      this.touchPositionfst = event.touches[0].pageX;
      event.target.addEventListener('touchmove', this.volumeBarMoveHandler);
      event.target.addEventListener('touchend', this.volumeBarDropHandler);
    }

    const volumeBarWidth = parseFloat(window.getComputedStyle(document.getElementById('volumeBarCtr'), null).width)

    let handleCtrStart = 
      parseFloat(this.touchPositionfst - ((window.innerWidth - volumeBarWidth) / 2)) + 'px'
    let volumeUp = (volumeBarWidth - parseFloat(handleCtrStart)) + 'px';

    if(parseFloat(volumeUp) < 0){
      volumeUp = '0px';
    } else if(parseFloat(handleCtrStart) > volumeBarWidth){
      handleCtrStart = volumeBarWidth + 'px';
    }

    if(parseFloat(volumeUp) < 0){
      volumeUp = '0px';
    } else if(parseFloat(volumeBarEnd) > volumeBarWidth){
      volumeUp = volumeBarWidth + 'px';
    }

    this.volume = 
      (parseFloat(1.0 / volumeBarWidth) * parseFloat(handleCtrStart)).toFixed(2);

    const player = this.state.player;
    player.volume = this.volume;
    this.setState({
      volumeHandleActive: true,
      player: player,
      volumeDown: handleCtrStart,
      volumeUp: volumeUp,
      volume: this.volume
    });
  }

  volumeBarMoveHandler = (event) => {
    let touchPositionSnd = 0;
    if(event.type === 'mousemove'){
      touchPositionSnd = event.pageX;
      document.addEventListener('mouseup', this.volumeBarDropHandler);
    } else if (event.type === 'touchmove'){
      touchPositionSnd = event.touches[0].pageX;
      event.target.addEventListener('touchend', this.volumeBarDropHandler);
    }
    
    const volumeBarWidth = 
      parseFloat(window.getComputedStyle(document.getElementById('volumeBarCtr'), null).width);

    let calcPos = touchPositionSnd - this.touchPositionfst;
    this.touchPositionfst = touchPositionSnd;

    let handleCtrStart = (parseFloat(this.state.volumeDown) + calcPos) + 'px';
    let volumeUp = (volumeBarWidth - (parseFloat(this.state.volumeDown) + calcPos)) + 'px';

    if(parseFloat(handleCtrStart) < 0){
      handleCtrStart = '0px';
    } else if(parseFloat(handleCtrStart) > volumeBarWidth){
      handleCtrStart = volumeBarWidth + 'px';
    }

    if(parseFloat(volumeUp) < 0){
      volumeUp = '0px';
    } else if(parseFloat(volumeUp) > volumeBarWidth){
      volumeUp = volumeBarWidth + 'px'
    }

    this.volume = 
      (parseFloat(1.0 / volumeBarWidth) * parseFloat(handleCtrStart)).toFixed(2);
    
    const player = this.state.player;
    player.volume = this.volume;
    this.setState({
      player: player,
      volumeDown: handleCtrStart,
      volumeUp: volumeUp,
      volume: this.volume
    });
  }

  volumeBarDropHandler = (event) => {
    this.setState({
      volumeHandleActive: false,
    },
    () => {
      event.target.addEventListener('touchmove', this.volumeBarMoveHandler);
      event.target.addEventListener('touchend', this.volumeBarDropHandler);
      event.target.addEventListener('mousemove', this.volumeBarMoveHandler);
      event.target.addEventListener('mouseup', this.volumeBarDropHandler);
    })
  }

  loadTrackIntoState = () => {
    const trackId = this.state.PlaylistTracks[this.state.currentTrackIndex].id;
    const trackURL = this.state.PlaylistTracks[this.state.currentTrackIndex].trackURL;
    const trackTitle = this.state.PlaylistTracks[this.state.currentTrackIndex].trackTitle;
    const player = this.state.player;
    // player.pause();
    player.src = player.src !== trackURL ? trackURL : player.src;
    player.currentTime = 0;
    player.volume = this.state.volume;
    player.loop = this.state.loop;
    player.preload = true;
    player.autoplay = true;

    this.setState({
      trackId: trackId,
      trackURL: trackURL,
      trackTitle: trackTitle,
      player: player,
      trackLoaded: false,
      playing: false,
      volume: player.volume,
      volumeDown: 
        (player.volume * parseFloat(window.getComputedStyle(document.getElementById('volumeBarCtr'), null).width)) + 'px',
      volumeUp:
        (parseFloat(
          window.getComputedStyle(document.getElementById('volumeBarCtr'), null).width) * parseFloat(window.getComputedStyle(document.getElementById('volumeBarCtr'), null).width)) + 'px',
    },
    () => {
      //this.playPause();
      if(!this.state.sidebar){
        this.scrollToActiveTrack();
      }
    });

    assignEventToPlayer = () => {
      this.state.player.addEventListener('canplay', () => {
        if(!this.state.trackLoaded){
          this.setState({trackLoaded: true, playing: true},
            () => {
              this.playPause();
            })
        }
      });

      this.state.player.addEventListener('ended', () => {
        if(this.state.loop){
          this.setState({playing: true}, () => this.playPause());
        } else {
          this.playNext();
        }
      });

      this.state.player.addEventListener('timeupdate', () => {
        if(this.state.trackLoaded){
          this.updatePlayingInfo();
        }
      });
    }

    scrollToActiveTrack = () => {
      window.setTimeout(() => {
        const trackListCtr = document.getElementById('trackListCtr');
        const activeTrack = document.getElementById('activeTrack');

        trackListCtr.scrollTo(
          0,
          activeTrack.offsetTop - (
            parseFloat(window.getComputedStyle(trackListCtr, null).height) / 2)
          );
      }, 200);
    }
  }

  componentDidMount = () => {
    this.assignEventToPlayer();
    this.loadTrackIntoState();
  }

  render(){
    return(
      <div className="Player">
        <Playlist 
          sidebar={this.state.sidebar}
          PlaylistTracks={this.state.PlaylistTracks}
          currentTrackIndex={this.state.currentTrackIndex}
          currentTrackId={this.state.trackId}
          searchString={this.state.searchString}
          updateSearchString={this.state.updateSearchString}
          toggleSidebar={this.state.toggleSidebar}
          selectTrack={this.selectTrack}
        />
        <div className="ctr1">
          <p className="playPauseText"><strong>{this.state.playing ? "Playing" : "Paused"}</strong></p>
          <span>{this.state.currentTime} / {this.state.totalDuration}</span>
        </div>
        <p className="track-title">{this.state.trackTitle}</p>
        <div className="bottom-ctr">
          <div 
            className="progress-container"
            onTouchStart={this.progBarPickHandler}
            onMouseDown={this.progBarPickHandler}
          >
            <div className="progress-bar">
              <div 
                className="done"
                id="doneProgressBar"
                style={{right: this.state.progressBarEnd}}
              ></div>
              <div
                className="handle-ctr"
                id="progressHandleCtr"
                style={{left: this.state.progressBarStart}}
              >
                <p className="time-span">
                  {!this.state.progressHandleActive ? this.state.currentTime : this.state.progressSpanTime}
                  <span></span>
                </p>
                <button
                  className="handle"
                  dangerouslySetInnerHTML={{__html: this.state.progressHandleActive ? `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 67 83" style="enable-background:new 0 0 67 83;" xml:space="preserve"><path d="M33.5,0.8C24,24.7,0.6,29.5,0.6,51.6c0,16.9,15.9,30.6,32.8,30.6c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0	c16.9,0,32.8-13.8,32.8-30.6C66.4,29.5,43,24.7,33.5,0.8z"/></svg>`
                                              : `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 67 83" style="enable-background:new 0 0 67 83;" xml:space="preserve"><path d="M33.5,9.8c4.4,7.4,10,12.9,15.1,17.8c7.7,7.5,13.9,13.5,13.9,23.9c0,14.2-13.5,26.6-28.8,26.6l-0.2,0l-0.1, 0C18,78.2,4.6,65.8,4.6,51.6c0-10.4,6.1-16.4,13.9-23.9C23.5,22.7,29.1,17.2,33.5,9.8 M33.5,0.8C24,24.7,0.6,29.5,0.6,51.6 c0,16.9,15.9,30.6,32.8,30.6c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c16.9,0,32.8-13.8,32.8-30.6C66.4,29.5,43,24.7,33.5,0.8L33.5,0.8z"/></svg>`}}
                ></button>
              </div>
              <div className="controller">
                <button 
                  className="previous"
                  dangerouslySetInnerHTML={{__html: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 70.7 70.7" style="enable-background:new 0 0 70.7 70.7;" xml:space="preserve"><g><rect x="3.2" y="20.5" width="8.9" height="29.7"/><polygon points="59.4,54.3 23,35.3 59.4,16.3"/></g></svg>`}}
                  onClick={this.playPrev}
                ></button>
                <button 
                  className="play-pause"
                  dangerouslySetInnerHTML={{__html: this.state.playing ? `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve"><g><rect x="15.7" y="9.2" width="19.2" height="61.7"/><rect x="45.2" y="9.2" width="19.2" height="61.7"/></g></svg>`
                  : `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 80 80" style="enable-background:new 0 0 80 80;" xml:space="preserve"><polygon points="17.5,70.8 76.5,40 17.5,9.2 "/></svg>`}}
                  onClick={this.playPause}
                ></button>
                <button 
                  className="next"
                  dangerouslySetInnerHTML={{__html: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 70.7 70.7" style="enable-background:new 0 0 70.7 70.7;" xml:space="preserve"><g><rect x="58.5" y="20.5" width="8.9" height="29.7"/><polygon points="11.3,54.3 47.7,35.3 11.3,16.3"/></g>`}}
                  onClick={this.playNext}
                ></button>
              </div>
              <div 
                className="volume-container"
                onTouchStart={this.volumeBarPickHandler}
                onMouseDown={this.volumeBarPickHandler}
              >
                <div className="volume-icon-ctr">
                  <button 
                    className="speaker-icon"
                    dangerouslySetInnerHTML={{__html: this.state.volume < 0.01 ? `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 44.1 38" style="enable-background:new 0 0 44.1 38;" xml:space="preserve"><path d="M6.5,13.9v10.3c0,1.7-1.3,3-3,3c-1.7,0-3-1.3-3-3V13.9c0-1.7,1.3-3,3-3C5.1,10.9,6.5,12.2,6.5,13.9z M23.6,1.6L10.7,13.7 c-0.7,0.7-1.1,1.6-1.1,2.5v5.5c0,1,0.4,1.9,1.1,2.5l12.9,12.1c2.2,2.1,5.8,0.5,5.8-2.5V4.1C29.4,1.1,25.8-0.4,23.6,1.6z"/></svg>`
                    : `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 44.1 38" style="enable-background:new 0 0 44.1 38;" xml:space="preserve"><path d="M6.5,13.9v10.3c0,1.7-1.3,3-3,3c-1.7,0-3-1.3-3-3V13.9c0-1.7,1.3-3,3-3C5.1,10.9,6.5,12.2,6.5,13.9z M23.6,1.6L10.7,13.7	c-0.7,0.7-1.1,1.6-1.1,2.5v5.5c0,1,0.4,1.9,1.1,2.5l12.9,12.1c2.2,2.1,5.8,0.5,5.8-2.5V4.1C29.4,1.1,25.8-0.4,23.6,1.6z M37.7,9.8	c-2-0.9-4.2,0.5-4.2,2.7v0.1c0,1.2,0.7,2.2,1.8,2.7c1.4,0.7,2.3,2.1,2.3,3.7s-0.9,3-2.3,3.7c-1.1,0.5-1.8,1.5-1.8,2.7v0.1 c0,2.2,2.3,3.6,4.2,2.7c3.5-1.6,5.9-5.1,5.9-9.2S41.2,11.4,37.7,9.8z"/></svg>`}}
                  ></button>
                </div>
                <div className="volume-bar-ctr" id="volumeBarCtr"
              </div>
            </div>
          </div>
        </div>

      </div>

    )
  }

}

export default Player;