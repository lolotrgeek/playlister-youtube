var fs = require('fs')
const path = require('path')
var readline = require('readline')
var { google } = require('googleapis')
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

function getToken() {
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, function (err, token) {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(token))
      }
    })
  })
}

function getAuthUrl(oauth2Client, callback) {
  return new Promise((resolve, reject) => {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    console.log('Authorize this app by visiting this url: ', authUrl)
    resolve(authUrl)
  })

}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  return new Promise(async (resolve, reject) => {
    var clientSecret = credentials.installed.client_secret
    var clientId = credentials.installed.client_id
    var redirectUrl = credentials.installed.redirect_uris[0]
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
    let token = await getToken()
    if (token) {
      oauth2Client.credentials = token
      resolve({ auth: oauth2Client })

    } else {
      resolve({ auth: oauth2Client, url: getAuthUrl(oauth2Client) })
    }
  })
}



/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client) {
  return new Promise(async (resolve, reject) => {
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        reject('Error while trying to retrieve access token', err)
        return
      }
      oauth2Client.credentials = token
      await storeToken(token)
      resolve(oauth2Client)
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
        resolve('This channel\'s ID is %s. Its title is \'%s\', and ' +
          'it has %s views.',
          channels[0].id,
          channels[0].snippet.title,
          channels[0].statistics.viewCount)
      }
    })
  })
}

module.exports = { getCredentials, authorize, getNewToken, storeToken, getChannel }