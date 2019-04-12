import React from 'react';
import Axios from 'axios';

// Using Axios in future database
// This playlist is hard coded, so fuck it.

const Playlist = (props) => {
  let tracklist = props.tracklist;
  const tracks = tracklist.map((track, index) => {
    return (
      <li
        key={track.id}
        index={index}
        trackId={track.id}
        className={trackId === props.currentTrackId ? "active" : ""}
        id={track.id === props.currentTrackId ? "activeTrack" : ""}
        onClick={(ev) => props.selectThisTrack(ev, track.id)}
        >
          <span>
            <strong>{track.id === props.currentTrackId ? '>' : ""}</strong>
            {track.title}
          </span>
        </li> // Songs list is in this map method.
    )
  })
// Returning the playlist, and adding a search-bar.
  return (
    <div className="Playlist">
      <div className="trackList-ctr" id="trackListCtr">
        {props.searchStrings === "" ? 
          <div className="upperElem">
            <p>{"Playlist"}</p>
          </div> : null }
          <ul>
            {tracks}
          </ul> 
      </div>
      <div className="bottom">
        <div className="search">
          <input 
            className="search-bar" 
            placeholder="Search" 
            value={props.searchStrings} 
            onInput={props.updateSearchStrings}
          />
        </div>
      </div>
    </div>
  ) 
}

export default Playlist;