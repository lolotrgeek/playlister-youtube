// let playlistId = 'PLGZwtzUnUPvi49duFUJApamEUzz2HnSg7'
// let videoId = 'dRe_rS19E04'

var GoogleAuth
var SCOPE = 'https://www.googleapis.com/auth/youtube'
function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load('client:auth2', initClient)
}

function authorizeClient() {
  GoogleAuth = gapi.auth2.getAuthInstance()

  // Listen for sign-in state changes.
  GoogleAuth.isSignedIn.listen(updateSigninStatus)

  // Handle initial sign-in state. (Determine if user is already signed in.)
  var user = GoogleAuth.currentUser.get()
  setSigninStatus()

  addButtons()
}

function addButtons() {
  // Call handleAuthClick function when user clicks on
  //      "Sign In/Authorize" button.
  $('#sign-in-or-out-button').click(function () {
    handleAuthClick()
  })
  $('#revoke-access-button').click(function () {
    revokeAccess()
  })
}

function showForm() {
  $("#add").css('display', 'inline-block')
  let videoIds = $('#videos').val()
  let playlistId = $('#playlist').val()
  $('#submit').click(async () => await AddVideos(parseVideoIds(videoIds), playlistId))
}

async function initClient() {
  try {
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    await gapi.client.init({
      'apiKey': 'AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI',
      'clientId': '638260735569-crj2nbi8t3uimh1g7lcaefrc597gqg2u.apps.googleusercontent.com',
      'discoveryDocs': [discoveryUrl],
      'scope': SCOPE
    })

    await authorizeClient()
    showForm()

  } catch (error) {
    console.log('Error: ', error)
  }
}

async function insertVideoToPlaylist(videoId, playlistId) {
  return gapi.client.youtube.playlistItems.insert(
    {
      "part": [
        "snippet"
      ],
      "resource": {
        "snippet": {
          "playlistId": playlistId,
          "resourceId": {
            "kind": "youtube#video",
            "videoId": videoId
          }
        }
      }
    }
  )
  // return { result: null }
}

const parseVideoIds = videos => {
  return videos.replace(/(\r\n|\n|\r)/gm, "").split(',').filter(videoId => typeof videoId === 'string' && videoId.length > 0).map(videoId => videoId.trim())
}

const backoff = () => {
  if (iteration > ramp) {
    iteration = 0
    console.log(' Backing off timeout:', timeout)
    return timeout * 2
  }
  return timeout
}

function createBackOffTable(videoIds) {
  const ramp = 3 // amount by which to ramp timeout when threshold is reached
  let threshold = 3 // index at which to begin ramp
  let timeout = 100
  let max = 6400 // amount at which to cap ramp, set to -1 for infinite ramp

  return videoIds.map((videoId, i) => {
    if (max > 0 && timeout === max) return timeout
    if (i === threshold) {
      threshold += ramp
      timeout = timeout * 2
    }
    return timeout
  })
}

// function timeout(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }
// async function sleep(fn, ms, ...args) {
//   await timeout(ms)
//   return fn(...args)
// }

function backOffInsertVideoToPlaylist(videoId, playlistId, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (iteration >= ramp) {
        iteration = 0
        timeout = timeout * 2
        console.log(' Backing off timeout:', timeout)
      }
      insertVideoToPlaylist(videoId, playlistId).then(result => {
        results.push({ id: videoId, status: "fulfilled", result })
        resolve(results)
      }).catch(err => {
        results.push({ id: videoId, status: "rejected", reason: err })
        resolve(results)
      })
      iteration++
    }, ms)
  })
}

function AddVideos(videoIds, playlistId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(videoIds)) reject('Invalid videoIds:' + videoIds)
      if (typeof playlistId !== "string") reject('Invalid PlaylistId:' + playlistId)
      // console.log(videoIds)

      // let videosToAdd = videoIds.map(videoId => backOffInsertVideoToPlaylist(videoId, playlistId))
      // let results = await Promise.allSettled(videosToAdd)
      // results = results.map((result, i) => ({ id: videoIds[i], status: result.status, reason: result.reason }))
      
      let succeeded = results.filter(result => result.status === "fulfilled")
      let failed = results.filter(result => result.status === "rejected")
      console.log(`[PLAYLIST] added: ${succeeded.length}/${videoIds.length}`)
      console.log(results)
      resolve(results)
    } catch (err) {
      console.log(err)
    }
  })

}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked "Sign out" button.
    GoogleAuth.signOut()
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn()
  }
}

function revokeAccess() {
  GoogleAuth.disconnect()
}

function setSigninStatus() {
  var user = GoogleAuth.currentUser.get()
  var isAuthorized = user.hasGrantedScopes(SCOPE)
  if (isAuthorized) authState()
  else noAuthState()
}

function authState() {
  $('#sign-in-or-out-button').html('Sign out')
  $('#revoke-access-button').css('display', 'inline-block')
  $('#auth-status').html('You are currently signed in and have granted ' +
    'access to this app.')
}

function noAuthState() {
  $('#sign-in-or-out-button').html('Sign In/Authorize')
  $('#revoke-access-button').css('display', 'none')
  $('#auth-status').html('You have not authorized this app or you are ' +
    'signed out.')
}

function updateSigninStatus() {
  setSigninStatus()
}