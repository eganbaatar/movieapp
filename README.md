 This project contains small example movie database application based on MEAN Stack.
 Following functionalities are implemented

 - Sign up/ login page for user management
 - Add, delete movies
 - Users should be able to rate movies with comments (1-5 stars). A use can only be able rate a movie once.
 - Main Dashboard to show all movies which are stored in the databas with following information:
     - Name
     - Release date
     - Duration
     - Actors
     - Average user rating (x/5 stars)
     - Users own rating

 Logged in users get live feedback in notification window if another user performs an
 action regarding a movie.

# Installation
 Install required packages using 
 npm install

 Adjust database connection string in config.json

 Start nodejs server using
 npm run server.js
