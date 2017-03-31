// Create a global User object for the app's user
let g_app_user = new User();

// Create some global demo Users
let g_demo_user_one = new User(3, "Titus", 2, [new PersonalInterest("Hiking", 2), new PersonalInterest("Lifting", 4)], ["friends_men", "friends_women", "dates_women"], "I'm a really cool dude.", ["img/samples/evan1.jpg"], [], 47.6062, -122.3321, new Date("3/28/2017"));
let g_demo_user_two = new User(7, "Annie", 22, [new PersonalInterest("Climbing", 2), new PersonalInterest("Snorkeling", 4)], ["friends_men", "friends_women", "dates_men"], "I'm a really cool girl.", ["http://lorempixel.com/output/people-q-c-100-100-9.jpg"], [], 47.6062, -122.3321, new Date("3/28/2017"));

// Create a global User cache so that we don't have to hit the server every
// single time we need to lookup data for a user
let g_user_cache = new UserCache();
g_user_cache.AddUser(g_demo_user_one);
g_user_cache.AddUser(g_demo_user_two);

// When the "deviceready" event takes place, we know all plugins have loaded
// successfully.
$(document).on("deviceready", function() {
    // Start watching the user's location
    var watchID = navigator.geolocation.watchPosition(onGeolocationChange, onGeolocationFail, { timeout: 30000 });
    console.log("navigator.geolocation is now watching the user's location");

    // Pop open the login screen
    // (TODO: Only do this when necessary.)
    myApp.loginScreen("#LoginScreen", false);
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
