var url = require('url')
var sqlite3 = require('sqlite3').verbose() //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/users.db')
const http = require('http')
const path = require('path')
const fetch = require('node-fetch')

//authenticate
exports.authenticate = function (request, response, next) {
    if (request.path === '/auth') {
        return next()
    }

    // Checks if user is already logged in
    if (request.session.user) {
        next()
    } else {
        // User is not logged in, redirect to signup/login page
        response.redirect('/auth')
    }
};



exports.index = function (request, response){
        // index.html
        response.render('index', { title: "Search" })
}


function parseURL(request, response){
	var parseQuery = true; //parseQueryStringIfTrue
    var slashHost = true; //slashDenoteHostIfTrue
    var urlObj = url.parse(request.url, parseQuery , slashHost );
    console.log('path:');
    console.log(urlObj.path);
    //console.log('query:');
    //console.log(urlObj.query);
    //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
	return urlObj;

}

//signupAndLogin page
exports.signupAndLogin = function(request, response) {
    response.render('signupAndLogin', { title: "Signup/Login" })
}


exports.signupPost = function(request, response) {
    const { username, password } = request.body
    const role = 'guest'; // Default role for new users

    db.run(`INSERT INTO users (user, password, role) VALUES (?, ?, ?)`, [username, password, role], function(err) {
        if (err) {
            console.error(err.message)
            //username already exists
            response.send("<h2>this username already exists</h2>")
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`)
            // username created
            response.redirect('/auth')
        }
    });
};

exports.loginPost = function(request, response) {
    const { username, password } = request.body

    // SQL to find the user with the given username and password
    const sql = "SELECT user, role FROM users WHERE user = ? AND password = ?"


    db.get(sql, [username, password], function(err, row) {
        if (err) {
            console.error('Database error', err)
            response.status(500).send('Server error 500')
            return
        }
        if (row) {
            // If the query returned a row, then we have a match
            request.session.isLoggedIn = true; // Mark the user as logged in
            request.session.user = { username: row.user, role: row.role }// Store user info in session
            //response.redirect('/index')
            
            //Login Success
            response.render('LoginSuccessful', { title: "Login Successful" , username: username});
        } else {
            response.render('LoginFailed', { title: "Login Failed" })
            //Login Failed
            //response.redirect('/auth');
        }
    });
};

exports.users = function(request, response){
    // Explicitly check the session for user role
    if (request.session.user && request.session.user.role === 'admin') {
        db.all("SELECT user, password, role FROM users", function(err, rows){
            if (err) {
                console.error('Database error', err)
                response.status(500).send('Server error 500')
                return
            }
            response.render('users', {title: 'Users', userEntries: rows});
        });
    } else {
        response.render('users', {title: 'Must be an Admin to access this page'});
    }
};

exports.find = async function(request, response) {
    console.log("===RUNNING FIND SONGS===");

    let songTitle = request.query.title;
    if (!songTitle) {
        console.log("No title provided");
        response.json({message: 'Please enter a song title'});
        return 
    }

    //add + to gaps/spaces
    let titleWithPlusSigns = songTitle.trim().replace(/\s/g, '+');
    console.log('titleWithPlusSigns:', titleWithPlusSigns);

    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=5`)
        const json = await res.json()
        response.json(json)
    }
    catch (err) {
        console.error(err)
        response.status(500).send('Server error 500')
    }
}


exports.song= async function(request,response){
console.log("===RUNNING SONGS DETAILS===");

    //variables
        // /song/235
    let urlObj = parseURL(request, response)
    let songID = urlObj.path
    songID = songID.substring(songID.lastIndexOf("/") + 1, songID.length)//235

    try {
        const res = await fetch(`https://itunes.apple.com/lookup?id=${songID}`)
        const json = await res.json()

        const song = json.results[0];
        console.log("  =====SONG=====")
        let songName = song.trackName;
        let artistName = song.artistName;
        let albumCover = song.artworkUrl100;

        //Display song details
        console.log("GET SONG NAME: " + songName);
        console.log("GET SONG ARTIST: " + artistName);
        console.log("GET SONG ID: " + songID);
        console.log("GET ALBUM COVER URL: " + albumCover);

        // Check if the song is already in favorites
        db.get("SELECT * FROM fav WHERE song = ? AND fav_id = ? AND artist_name = ?", [songName, songID, artistName], (err, row) => {
                if (row) {
                    return response.send("This song is already in your favorites");
                } else {
                    
                    // insert the new favorite since it doesnt exist
                    db.run("INSERT INTO fav (song, fav_id, artist_name, album_cover) VALUES (?, ?, ?, ?)", [songName, songID, artistName, albumCover], (err) => {
                        
                        console.log(  "+++Added to favorites+++");
                        console.log(  "favorites artist Name: "    +artistName)
                        console.log(  "favorites songName: "     + songName)
                        console.log(  "favorites songID: "      + songID)
                        response.render('addedToFavorites', {title: "Added to favorites",songName: songName,artistName: artistName})
                    });
                }
            })
    }
    
    catch (err) {
        console.error(err)
        response.status(404).send('Song not found')
    }
}


exports.favorites = function(request, response) {
    // Query to fetch all favorite songs
    db.all("SELECT * FROM fav", (err, rows) => {
        if (rows.length > 0) {
            // Render the 'songDetails' view, passing in the array of songs
            response.render('songDetails', {songs: rows});
        } else {
            // Handle case where no favorites are found
            response.send("No favorite songs found");
        }
    });
};
