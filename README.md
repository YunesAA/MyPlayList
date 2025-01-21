# User-Playlist-Manager
Technologies: JavaScript, HTML, Node.js, SQLite, iTunes API

## Overview
This application allows users to search for songs, add them to their favorites, and manage user accounts with different roles (guest or admin). Admin users have additional privileges, such as accessing the user management tab.

## Installation Instructions
1. Open the command prompt (CMD) in the folder where the application files are located.
2. Run the following command to install the necessary dependencies:
   ```
   npm install
   ```

## Launch Instructions
1. Start the server by running:
   ```
   node server.js
   ```

## Testing Instructions
1. Open a browser and go to:
   ```
   http://localhost:3000/auth
   ```
   
   or
   
   just hold left-ctrl and left-click the text in cmd (it should print out the url on its own)


3. Log in using an existing user account or create a new one.
   - If the username already exists, an error will be displayed.

### Default Login Details
| Username | Password | Role  |
|----------|----------|-------|
| user     | user     | guest |
| admin    | admin    | admin |

## Features

### Search for Songs
1. Navigate to the **Search** tab.
2. Enter the name of the song you want to search for.
3. Click on the song’s picture to add it to your favorites.

### View Favorite Songs
1. Navigate to the **Favorites** tab.
2. View all the songs you have added to your favorites.

### Admin Privileges
1. Log in with the **admin** account to access the **Users** tab.
2. The Users tab displays all registered users.

### Logout
1. Click on the **Logout** tab to return to the login/signup page.

## Code Overview

### Dependencies
- `url`: Used for parsing URLs.
- `sqlite3`: Database operations (verbose mode enabled for detailed stack traces).
- `http`: To handle HTTP requests.
- `path`: For handling and transforming file paths.

### Authentication Middleware
- Ensures users are authenticated before accessing certain routes.
- Redirects unauthenticated users to the login/signup page (`/auth`).

## Notes
- The application uses SQLite for user and favorites data storage.
- The iTunes API is utilized for song searches and details.
- Sessions are used to manage user authentication and roles.

