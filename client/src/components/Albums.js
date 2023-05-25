import { useState } from "react";

const Albums = ({ albums, setSelectedPlaylist, isPlaylistSelected, selectedPlaylist }) => {
  return (
    <>
      <h2>Available Music</h2>
      {albums.map((album) => (
        <div key={album.folderId}>
          <Folder
            album={album}
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
            isPlaylistSelected={isPlaylistSelected}
          />
        </div>
      ))}
    </>
  );
};
const Folder = ({ album, selectedPlaylist, setSelectedPlaylist, isPlaylistSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { folderName, contentsOfFolder } = album;
  return (
    <>
      <div style={styles.names} onClick={() => setIsOpen(!isOpen)}>
        {folderName}
      </div>
      {isOpen && (
        <div style={{ marginleft: "10px" }}>
          {contentsOfFolder.map((subFolder) => {
            if (subFolder.folderId) {
              return (
                <div key={subFolder.folderId} style={{marginLeft:'10px'}}>
                  <Folder
                    album={subFolder}
                    selectedPlaylist={selectedPlaylist}
                    setSelectedPlaylist={setSelectedPlaylist}
                    isPlaylistSelected={isPlaylistSelected}
                  />
                </div>
              );
            }
            return (
              <div key={subFolder.songId}>
                <Song
                  song={subFolder}
                  selectedPlaylist={selectedPlaylist}
                  setSelectedPlaylist={setSelectedPlaylist}
                  isPlaylistSelected={isPlaylistSelected}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const Song = ({ song, selectedPlaylist, setSelectedPlaylist, isPlaylistSelected }) => {
  const { songTitle, songId } = song;

  const isButtonDisabled = (songId) => {
    const IDs = selectedPlaylist.includedSongs.map(obj=>obj.songId)
    return IDs.includes(songId);
  };

  return (
    <>
      <button
        style={styles.button}
        onClick={() => setSelectedPlaylist((prev) => ({ ...prev, includedSongs: [...prev.includedSongs, song] }))}
        disabled={!isPlaylistSelected || isButtonDisabled(songId)}
      >
        +
      </button>
      {songTitle}
    </>
  );
};
const styles = {
  button: {
    border: "none",
    background: "none",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
  names: {
    color: "#7393b3",
    cursor: "pointer",
    fontSize: "18px",
  },
};

export default Albums;
