// Create a global User object for the app's user
let g_app_user = new User();

let APITestToken = 'a1b2c3d4e5f6g7h8i9j';

let g_user_cache = new UserCache();


// When the "deviceready" event takes place, we know all plugins have loaded
// successfully.
$(document).on("deviceready", function() {
    // Start watching the user's location
    var watchID = navigator.geolocation.watchPosition(onGeolocationChange, onGeolocationFail, { timeout: 30000 });
    console.log("navigator.geolocation is now watching the user's location");

    // Pop open the login screen
    // (TODO: Only do this when necessary.)
    myApp.loginScreen("#LoginScreen", false);

    // Begin the engine
    EngineUpdateRegular();
    EngineUpdateSemiregular();
    EngineUpdateIrregular();
})

// A callback for whenever the User's location changes.
function onGeolocationChange(position) {
    // Update the User's model to the current location
    // (TODO: Push this updated information back up to the server.)
    g_app_user.latitude = position.coords.latitude;
    g_app_user.longitude = position.coords.longitude;

    // If our index page's object has loaded yet, tell it we want it to update
    // its map
    if (typeof index_page != "undefined") {
        index_page.updateMap();
    }
}

// An error callback for failed attempts to get the User's location.
function onGeolocationFail(error) {
    console.log('Error code: '    + error.code    + '\n' +
                'Error message: ' + error.message + '\n');
}

// EngineUpdateRegular() gets called very often and thus should be used to do
// things like attempt to update Matches and their associated conversations.
function EngineUpdateRegular() {
    // (TODO: Any necessary/realtime tasks and updates. For example, update
    // matches and conversations.)

    // If the chat page has loaded yet, make sure it is showing the latest
    // messages for the conversation it is currently responsible for
    if (typeof chat_page != "undefined") {
        chat_page.LoadAndParseMessages(chat_page.id, true);
    }

    // Debug output and call this function again in 1 second
    console.log("Engine updated (regular).");
    setTimeout(EngineUpdateRegular, 1000);
}

// EngineUpdateSemiregular() gets called often and should be used to update data
// that can technically go stagnant and not affect the quality of the User's
// experience.
function EngineUpdateSemiregular() {
    // (TODO: Any semi-regular tasks and updates.)

   
    

  

    // Debug output and call this function again in 30 seconds
    console.log("Engine updated (semi-regular).");
    setTimeout(EngineUpdateSemiregular, 30000);
}

// EngineUpdateIrregular() gets called very irregularly and thus should only be
// used to perform tasks that almost don't matter.
function EngineUpdateIrregular() {
    // (TODO: Any irregular tasks and updates.)

    //Update Cache with any new potential users
    $.ajax({
        type: 'GET',
        url: 'https://api.aktve-app.com/potentials' + '?token=' + APITestToken, //Change to actual facebook token
        dataType: 'json',
        context: this, // Make the callaback function's `this` variable point to this User object
        success: function (data) {
            console.log(data);


            $.each(data.Data.potential_user_ids, function (key, value) { // First Level
                                   
                g_user_cache.RetrieveUser(value); // If any new potential users are not in the cache, put them there
                                          

                });
           
        }


    });

    // Trigger a UserCache update so that we get an updated representation of
    // all User's that we have cached
    g_user_cache.Update();

    // If the following pages have loaded yet, make sure they are updated to
    // show the latest data
    if (typeof matches_page != "undefined") {
        matches_page.PopulateMatchesList();
    }

    // Debug output and call this function again in 60 seconds
    console.log("Engine updated (irregular).");
    setTimeout(EngineUpdateIrregular, 60000);
}


