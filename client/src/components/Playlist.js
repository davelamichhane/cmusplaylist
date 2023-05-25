import { uuid } from "../utility/uuid";

const Playlist = ({ playlists, selectedPlaylist, setSelectedPlaylist, isPlaylistSelected, setIsPlaylistSelected }) => {
  // select playlist name just by clicking on the name (No submit button)
  const handleChange = (e) => {
    if (e.target.value === "new") {
      const newName = prompt("What do you want to call this new playlist? ");
      setSelectedPlaylist({ playlistName: newName, playlistId: uuid(), includedSongs: [] });
      setIsPlaylistSelected(true);
    } else {
      const selected = playlists.find((playlist) => playlist.playlistName === e.target.value);
      setSelectedPlaylist(selected);
      setIsPlaylistSelected(true);
    }
  };

  // Save Playlist
  const handleSubmit = async () => {
    try {
      const response = await fetch("/write-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPlaylist),
      });

      if (response.ok) {
        console.log("Data sent successfully!");
        setIsPlaylistSelected(false);
        setSelectedPlaylist();
      } else {
        console.log("Failed to send data!");
      }
    } catch (err) {
      console.log("Problemo: ", err);
    }
  };

  // Delete Playlist
  const handleDelete = async () => {
    try {
      const response = await fetch("/delete-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({playlistName:selectedPlaylist.playlistName})
      });

      if (response.ok) {
        console.log("Request sent successfully!");
        setIsPlaylistSelected(false);
        setSelectedPlaylist();
      } else {
        console.log("Failed to send request!");
      }
    } catch (err) {
      console.log("Problemo mucho: ", err);
    }
  };

  if (isPlaylistSelected) {
    const { playlistName, includedSongs } = selectedPlaylist;

    return (
      <div>
        <div style={styles.names}>Please Edit {playlistName} Playlist</div>
        <ul>
          {includedSongs.map((song) => {
            const { artist, songTitle, songId } = song;
            return (
              <li style={{ listStyleType: "none" }} key={songId}>
                <button
                  style={styles.button}
                  onClick={() =>
                    setSelectedPlaylist((prevObj) => ({
                      ...prevObj,
                      includedSongs: prevObj.includedSongs.filter((item) => item.songId !== songId),
                    }))
                  }
                >
                  x
                </button>
                {`${songTitle} by ${artist}`}
              </li>
            );
          })}
        </ul>
        <div style={{ display: "flex" }}>
          <button onClick={handleSubmit} style={{ flex: 1, margin: "20px" }}>
            Save this playlist
          </button>
          <button style={{ flex: 1, margin: "20px" }} onClick={handleDelete}>
            Delete this playlist
          </button>
          <button onClick={() => setIsPlaylistSelected(false)} style={{ flex: 1, margin: "20px" }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form>
        <label style={styles.names} htmlFor="playlists">
          Please Select Playlist{" "}
        </label>
        <select name="playlists" id="playlists" onChange={handleChange}>
          <option></option>
          {playlists.map((playlist) => {
            const { playlistName, playlistId } = playlist;
            return (
              <option key={playlistId} value={playlistName}>
                {playlistName}
              </option>
            );
          })}
          <option value="new">Create New Playlist</option>
        </select>
      </form>
    </div>
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

export default Playlist;
