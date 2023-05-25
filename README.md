# cmusplaylist
Create, Edit, Delete cmus playlists with the cick of your mouse!

## How this works?
Node/Express server will pull music from ~/Music and display on the left side. You will be able to add songs from ~Music and its subfolders to playlists from ~/.config/cmus/playlists that are displayed on the left. You can edit existing playlists, create new ones or delete existing ones. 

## How to get this to work?
1. Clone this repo
2. run `npm install` on both client and server
3. run the server with `node server.js` from /server and the frontend with `npm start` from /client. If your music album isn't ~/Music, change line #7 of /server/server.js (same with cmus playlist folder, if it's different)
4. The application will launch on you default browser on localhost:3000
5. Do your thang!

## What's next?
It wont be all that difficult to package this into a desktop application using NW.js or Electron. Let me know if anyone wants to do this!
