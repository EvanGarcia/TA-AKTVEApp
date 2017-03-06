// Create a user object for the app's user
let app_user = new User();
app_user.is_me = true;

// When the "deviceready" event takes place, we know all plugins have loaded
// successfully.
$(document).on("deviceready", function() {
    // Start watching the user's location
    console.log("navigator.geolocation is now watching the user's location");
    var watchID = navigator.geolocation.watchPosition(onGeolocationChange, onGeolocationFail, { timeout: 30000 });
})

// A callback for whenever the user's location changes.
function onGeolocationChange(position) {
    // Update the user's model to the current location
    app_user.latitude = position.coords.latitude;
    app_user.longitude = position.coords.longitude;

    // If our index page's object has loaded yet, tell it we want it to update
    // its map
    if (typeof index_page != "undefined") {
        index_page.updateMap();
    }
}

// An error callback for failed attempts to get the user's location.
function onGeolocationFail(error) {
    console.log('Error code: '    + error.code    + '\n' +
                'Error message: ' + error.message + '\n');
}
