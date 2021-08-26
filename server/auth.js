var fs = require('fs')
const path = require('path')
var { google } = require('googleapis')
const e = require('express')
var OAuth2 = google.auth.OAuth2

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube']
var TOKEN_DIR = path.join(__dirname, '/credentials/')
var TOKEN_PATH = path.join(TOKEN_DIR, 'token.json')

function getCredentials() {
  return new Promise((resolve, reject) => {
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) reject('Error loading client secret file: ' + err)

      // Authorize a client with the loaded credentials, then call the YouTube API.
      // authorize(JSON.parse(content), getChannel)

      resolve(JSON.parse(content))
    })
  })
}

/**
 * Create an OAuth2 client with the given credentials
 * @param {Object} credentials 
 * @returns Promise that resolves an OAuth2 client or Error
 */
function newClient(credentials) {
  return new Promise((resolve, reject) => {
    try {
      let clientSecret = credentials.installed.client_secret
      let clientId = credentials.installed.client_id
      let redirectUrl = credentials.installed.redirect_uris[0]
      let oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
      let client = oauth2Client
      resolve(client)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get a stored Token 
 * @returns
 */
function getToken() {
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        console.log('Unable to Find Token: ' + TOKEN_PATH)
        resolve(null)
      } else {
        console.log('Found Token: ' + TOKEN_PATH)
        resolve(JSON.parse(token))
      }
    })
  })
}

/**
 * Generate an Authorization URL
 * @param {*} oauth2Client 
 * @returns 
 */
function getAuthUrl(oauth2Client) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url: ', authUrl)
  return authUrl
}


/**
 * Use auth code after prompting for user authorization to get new Token
 *
 * @param {string} code the code to convert to token
 * @param {google.auth.OAuth2} client The OAuth2 client to get token for.
 */
function getNewToken(code, client) {
  return new Promise((resolve, reject) => {
    client.getToken(code, async (err, token) => {
      if (err) {
        reject('Error while trying to retrieve access token', err)
        return
      }
      resolve(token)
    })
  })
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  return new Promise((resolve, reject) => {
    try {
      fs.mkdirSync(TOKEN_DIR)
    } catch (err) {
      if (err.code != 'EEXIST') {
        reject(err)
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) reject(err)
      console.log('Token stored to ' + TOKEN_PATH)
      resolve()
    })
  })

}



/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
  return new Promise((resolve, reject) => {
    var service = google.youtube('v3')
    service.channels.list({
      auth: auth,
      part: 'snippet,contentDetails,statistics',
      forUsername: 'GoogleDevelopers'
    }, function (err, response) {
      if (err) {
        reject('The API returned an error: ' + err)
      }
      var channels = response.data.items
      if (channels.length == 0) {
        reject('No channel found.')
      } else {
        let output = `This channel's ID is ${channels[0].id}. Its title is ${channels[0].snippet.title}', and it has ${channels[0].statistics.viewCount} views.`
        resolve(output)
      }
    })
  })
}

function addVideoToPlaylist(auth, playlistId, videoId, interval) {
  return new Promise((resolve, reject) => {
    if (!interval) interval = 500
    const service = google.youtube('v3')
    setTimeout(() => {
      service.playlistItems.insert({
        auth: auth,
        part: 'snippet',
        requestBody: {
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: videoId
            }
          }
        }
      }, err => {
        if (err) reject({ videoId, code: err.code, errors: err.errors })
        resolve(videoId + ' success')
      })
    }, interval)
  })
}

module.exports = { getCredentials, newClient, getToken, getAuthUrl, Authorize, getNewToken, storeToken, getChannel, addVideoToPlaylist }