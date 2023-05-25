const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
const PORT = process.env.PORT || 6969
const homeDir = require("os").homedir()
const musicPath = path.join(homeDir, "Music")
const playlistPath = path.join(homeDir, ".config/cmus/playlists")

// to Generate Id
const uuid = () => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let returnVal = ""
  for (let i = 0; i < 4; i++) {
    returnVal += characters[Math.floor(Math.random() * 36)]
  }
  return returnVal
}

// Function to extract Music and metadata to display
const extractFilesAndFolders = (pathToFolder) => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToFolder, (err, fileOrFolder) => {
      if (err) {
        reject(err)
      } else {
        const promises = fileOrFolder.map((item) => {
          const fileOrFolderPath = path.join(pathToFolder, item)
          const isDir = fs.statSync(fileOrFolderPath).isDirectory()

          if (isDir) {
            return extractFilesAndFolders(fileOrFolderPath)
              .then((content) => {
                return {
                  folderId: uuid(),
                  folderName: item,
                  pathToFolder: fileOrFolderPath,
                  contentsOfFolder: content,
                }
              })
              .catch(reject)
          } else {
            const extension = path.extname(fileOrFolderPath).toLowerCase()
            if ([".mp3", ".wav", ".ogg", ".flac"].includes(extension)) {
              return import("music-metadata").then((module) => {
                return module.parseFile(fileOrFolderPath).then((metadata) => ({
                  songId: uuid(),
                  songTitle: metadata.common.title,
                  artist: metadata.common.artist,
                  pathToSong: fileOrFolderPath,
                }))
              })
            } else {
              return null // Ignore non-audio files
            }
          }
        })

        Promise.all(promises)
          .then((results) => {
            const filteredResults = results.filter((result) => result !== null)
            resolve(filteredResults)
          })
          .catch(reject)
      }
    })
  })
}

// Function to extract playlist info
const extractPlaylists = (pathToPlaylistFolder) => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToPlaylistFolder, (err, arrayOfFiles) => {
      if (err) {
        reject(err)
      } else {
        const arrayOfPromises = arrayOfFiles.map((file) => {
          return fs.promises
            .readFile(path.join(pathToPlaylistFolder, file), "utf-8")
            .then((data) => {
              const lines = data.split("\n").filter((item) => item !== "")
              const arrayOfInnerPromises = [file]
              lines.forEach((line) => {
                arrayOfInnerPromises.push(
                  import("music-metadata").then((module) => {
                    return module.parseFile(line).then((metadata) => {
                      const { artist, title } = metadata.common
                      return {
                        songId: uuid(),
                        artist,
                        songTitle: title,
                        pathToSong: line,
                      }
                    })
                  })
                )
              })

              return Promise.all(arrayOfInnerPromises)
            })
            .catch((err) => reject(err))
        })
        resolve(
          Promise.all(arrayOfPromises).then((sub) =>
            sub.map((item) => ({
              playlistName: item[0],
              playlistId: uuid(),
              includedSongs: item.slice(1),
            }))
          )
        )
      }
    })
  })
}

// Create Music API
extractFilesAndFolders(musicPath)
  .then((result) => {
    app.get("/music", (req, res) => {
      res.json(result)
    })
  })
  .catch((err) => {
    console.error(err)
  })

// Create Playlist API
extractPlaylists(playlistPath)
  .then((result) => {
    app.get("/playlists", (req, res) => {
      res.json(result)
    })
  })
  .catch((err) => console.error(err))

// Not Sure why i need this tho
app.use(express.json())

// Get info from frontend to write in local machine
app.post("/write-playlist", (req, res) => {
  const data = req.body
  const filePath = path.join(playlistPath, data.playlistName)
  const playlist = data.includedSongs.map((song) => song.pathToSong).join("\n")

  fs.writeFile(filePath, playlist, "utf-8", (err) => {
    if (err) {
      console.error(err)
      res.status(500).send("Error writing data to file")
    } else {
      res.status(200).send("Data written to file successufully!")
    }
  })
})

// Delete Playlist
app.post("/delete-playlist", (req, res) => {
  const data = req.body
  const filePath = path.join(playlistPath, data.playlistName)

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).send("Error Error Error")
    } else {
      res.status(200).send("Great Success. Sexy Time")
    }
  })
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
