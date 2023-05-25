import { useEffect, useState } from "react";
import Albums from "./components/Albums";
import Playlist from "./components/Playlist";

function App() {
  const [albums, setAlbums] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState();
  const [selectedPlaylist, setSelectedPlaylist] = useState(); //editing the contents of selected playlist
  const [isPlaylistSelected, setIsPlaylistSelected] = useState(false);

  const fetchData = async () => {
    try {
      const albumsResponse = await fetch("/music");
      const albumsData = await albumsResponse.json();
      setAlbums(albumsData);

      const playlistsResponse = await fetch("/playlists");
      const playlistsData = await playlistsResponse.json();
      setPlaylists(playlistsData);

      setIsLoading(false);
    } catch (err) {
      console.log("Problemo: ", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <h2>...Loading!</h2>;

  return (
    <>
      <div style={{ marginTop: "20px", marginLeft: "10px", display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Albums
            albums={albums}
            isPlaylistSelected={isPlaylistSelected}
            setSelectedPlaylist={setSelectedPlaylist}
            selectedPlaylist={selectedPlaylist}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Playlist
            playlists={playlists}
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
            isPlaylistSelected={isPlaylistSelected}
            setIsPlaylistSelected={setIsPlaylistSelected}
          />
        </div>
      </div>
    </>
  );
}

export default App;
