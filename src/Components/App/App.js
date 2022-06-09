import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

import React from 'react';

 Spotify.getAccessToken();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateSearchTerms = this.updateSearchTerms.bind(this);
  }
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    const playlistName = this.state.playlistName;
    await Spotify.savePlaylist(playlistName, trackURIs);
    alert('Playlist saved!');
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  async search() {
    const newResults = await Spotify.search(this.state.searchTerms);
    this.setState({
      searchResults: newResults
    });
  }

  updateSearchTerms(terms) {
    this.setState({
      searchTerms: terms
    });
  }
  
  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/> 
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} 
          onAdd={this.addTrack} />
          <Playlist playlistName={this.state.playlistName} 
          playlistTracks={this.state.playlistTracks}
          onRemove ={this.removeTrack} 
          onNameChange={this.updatePlaylistName}
          onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
};

export default App;