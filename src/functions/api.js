/* eslint-disable */

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

  var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/youtube';
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient); 
  }

  function initClient() {
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({ 
        'apiKey': 'AIzaSyCB3p3A2mcCaI1lVvB0H9HRzY529sH9lzI',
        'clientId': '638260735569-crj2nbi8t3uimh1g7lcaefrc597gqg2u.apps.googleusercontent.com',
        'discoveryDocs': [discoveryUrl],
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance(); 

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#sign-in-or-out-button').click(function() { 
        handleAuthClick();
      });
      $('#revoke-access-button').click(function() { 
        revokeAccess();
      });
    });
  }

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked "Sign out" button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      $('#sign-in-or-out-button').html('Sign out'); 
      $('#revoke-access-button').css('display', 'inline-block');
      $('#auth-status').html('You are currently signed in and have granted ' +
          'access to this app.');
    } else {
      $('#sign-in-or-out-button').html('Sign In/Authorize');
      $('#revoke-access-button').css('display', 'none');
      $('#auth-status').html('You have not authorized this app or you are ' +
          'signed out.');
    }
  }

  function updateSigninStatus() {
    setSigninStatus();
  }