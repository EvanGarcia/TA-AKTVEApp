// Create a global User object for the app's user
let g_app_user;

let APIUserToken = "APIKEY";

let g_user_cache = new UserCache();

let MyId;

let NewMatchCount = 0;

let OldMatchCount = 0;

let NewMessageCount = 0;

let OldMessageCount = 0;


let MatchesIDs = [];
let MatchesParticipants = [];
let MessagesArray = [];
let MessagesID = [];
let MessagesAuthorID = [];
let MessagesMessage = [];
let MessagesDate = [];
let MatchesArray = [];

// When the "deviceready" event takes place, we know all plugins have loaded
// successfully.
$(document).on("deviceready", function () {
    //Facebook API Connection
    window.fbAsyncInit = function () {
        console.log("Facebook connection initializing...");

        // Facebook Login Callback
        function checkLoginState() {
            console.log("Facebook status change callback triggered...");

            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });

            //FB.AppEvents.logPageView();
        }

        // Subscribe to the event that gets fired whenever a user logs in/out
        FB.Event.subscribe('auth.statusChange', checkLoginState);

        // Initialize the connection to Facebook
        FB.init({
            appId: '394645667578932',
            cookie: true,
            xfbml: true,
            version: 'v2.8',
            status: true,
            statusChangeCallback: checkLoginState,
        });

         //Open login screen if we aren't already logged in
        FB.getLoginStatus(function (response) {
            if (response.status != "connected") {
                myApp.loginScreen("#LoginScreen", false);
            }
        });
    };

    // Load the Facebook SDK
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    
    
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
    console.log('Error code: ' + error.code + '\n' +
                'Error message: ' + error.message + '\n');
}

// EngineUpdateRegular() gets called very often and thus should be used to do
// things like attempt to update Matches and their associated conversations.
function EngineUpdateRegular() {
    // (TODO: Any necessary/realtime tasks and updates. For example, update
    // matches and conversations.)
    

   

    //Update the Cache with all matched users
    $.ajax({
        type: 'GET',
        url: 'https://api.aktve-app.com/me/matches?token=' + APIUserToken, //Change to actual facebook token
        dataType: 'json',
        context: this, // Make the callaback function's `this` variable point to this User object
        success: function (data) {
            //console.log(data);

            //If no matches, do not execute code

            if (data.Data.matches != null) {
               

                NewMatchCount = data.Data.matches.length;


                //If no new matches, do not execute code
                if (NewMatchCount != OldMatchCount) {

                    OldMatchCount = NewMatchCount;
                    console.log("show up");


                    //Put matches in cache, and get match data
                    for (var i = 0; i < data.Data.matches.length; i++) {
                        MatchesIDs[i] = data.Data.matches[i].id;
                        MatchesParticipants[i] = data.Data.matches[i].participants;
                        g_user_cache.RetrieveUser(data.Data.matches[i].participants[1]);
                        //console.log(MatchesIDs[i]);
                        //console.log(MatchesParticipants[i]);
                    }

                }

                    for (var i = 0; i < MatchesIDs.length; i++) {
                        $.ajax({
                            type: 'GET',
                            url: 'https://api.aktve-app.com/me/matches/' + MatchesIDs[i] + '/messages?token=' + APIUserToken, //Change to actual facebook token
                            dataType: 'json',
                            context: this, // Make the callaback function's `this` variable point to this User object
                            success: function (data) {
                                console.log(data);

                                //If no messages, don't execute code
                                if (data.Data.messages != null) {
                                    console.log(data.Data.messages);

                                    NewMessageCount = data.Data.messages.length;

                                    //If no new messages, don't execute code
                                    if (NewMessageCount != OldMessageCount) {

                                        OldMessageCount = NewMessageCount;
                                        MessagesArray[i] = [];

                                        //Get message data, and put messages into array for each match
                                        for (var j = 0; j < data.Data.messages.length; j++) {
                                            MessagesID[j] = data.Data.messages[j].id;
                                            MessagesAuthorID[j] = data.Data.messages[j].author_id;
                                            MessagesMessage[j] = data.Data.messages[j].message;
                                            MessagesDate[j] = data.Data.messages[j].date;
                                            console.log(MessagesID[j]);
                                            console.log(MessagesAuthorID[j]);
                                            console.log(MessagesMessage[j]);
                                            console.log(MessagesDate[j]);

                                            MessagesArray[i].push(new Message(MessagesID[j], MessagesAuthorID[j], decodeURIComponent(MessagesMessage[j]), MessagesDate[j], false));
                                            

                                        }

                                        //Clean messages each time we get a new message, need to fix this when finish final chat

                                        if (typeof chat_page != "undefined" && chat_page.messages != null) {
                                            chat_page.messages.clean();
                                        }
                                    }

                                }
                            },
                            async:false
                       
                        });

                    }

                   

                    // Add matches into array
                    for (var i = 0; i < data.Data.matches.length; i++) {


                        MatchesArray[i] = new Match(MatchesIDs[i], MatchesParticipants[i], MessagesArray[i]);

                        console.log(MatchesArray);
                    }

                    //Set user's matches
                    g_app_user._matches = MatchesArray;

                    //If the chat page has loaded yet, make sure it is showing the latest
                    //messages for the conversation it is currently responsible for
                    if (typeof chat_page != "undefined") {
                        chat_page.LoadAndParseMessages(chat_page.id, true);
                    }
                    
                    console.log(g_app_user.matches);
                
            }

        },
        async:false

    });


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
    //Update Cache with any new potential users
    if(APIUserToken == "APIKEY")
    {
        setTimeout(EngineUpdateIrregular, 60000);
        return;
    }

    //$.ajax({
    //    type: 'GET',
    //    url: 'https://api.aktve-app.com/potentials' + '?token=' + APIUserToken, //Change to actual facebook token
    //    dataType: 'json',
    //    context: this,
    //    success: function (data) {
    //      $.each(data.Data.potential_user_ids, function (key, value) { // First Level
                                   
    //            g_user_cache.RetrieveUser(value); // If any new potential users are not in the cache, put them there
                                          

    //            });
           
    //    }
    //});

    

    











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

//Called on App start up. Determines whether to go to the login page or swipe page.

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.

        var FBUserID = response.authResponse.userID;
        console.log(FBUserID);
        var fb_access_token = response.authResponse.accessToken;
        console.log(fb_access_token);
        var dataForPost = "fb_userid=" + FBUserID + "&fb_access_token=" + fb_access_token;
        console.log(dataForPost);

      //Log user into app
      $.ajax({
          type: 'POST',
          url: "https://api.aktve-app.com/login",
          data: dataForPost,
          dataType: "json",
          context: this,
          success: function (data) {

              console.log(data);

              APIUserToken = data.Data.token;
              console.log(APIUserToken);

              g_app_user = new User();

              var watchID = navigator.geolocation.watchPosition(onGeolocationChange, onGeolocationFail, { timeout: 30000 });
              console.log("navigator.geolocation is now watching the user's location");


              myApp.loginScreen("#LoginScreen", false);
              myApp.closeModal("#LoginScreen");
              mainView.router.loadPage("swipe.html");
             
          },
          async: false
      });
    
      

       
    } else { // OTHERWISE, LOGIN FAILED!
        // The person is not logged into your app or we are unable to tell.
        myApp.loginScreen("#LoginScreen", false);
    }
}



//Logout user. Need to add this as a button in settings page.

function fbLogoutUser() {
    FB.getLoginStatus(function (response) {
        if (response && response.status === 'connected') {
            FB.logout(function (response) {
                document.location.reload();
            });
        }
    });
}


//Check the Login state. Used in index.html to navigate to swipe page after login.

function checkLoginState()
{
    FB.getLoginStatus(function (response) {
        if (response && response.status === 'connected') {

            myApp.closeModal("#LoginScreen");
            mainView.router.loadPage("swipe.html");
           
            return true;
        }

    });

    return false;

}



//Populate App User with Facebook Profile Info

//function PopulateUser() {
    
//    if(checkLoginState() === true)
//    {

//        console.log(APIUserToken);

//        $.ajax({
//            type: 'GET',
//            url: 'https://api.aktve-app.com/me?token=' + APIUserToken, //Change to actual facebook token
//            dataType: 'json',
//            context: this, // Make the callback function's `this` variable point to this User object
//            success: function (data) {
//                console.log(data);
//                this._id = data.Data.user.id;
//                this._name = data.Data.user.name;
//                this._age = data.Data.user.age;
//                this._latitude = data.Data.user.latitude;
//                this._longitude = data.Data.user.longitude;
//                this._last_active = new Date(data.Data.user.last_active);

//                this._bio = data.Data.user.bio;

//                var interestsArray = [];
//                $.each(data.Data, function (key, value) {
//                    $.each(value.interests, function (k, v) {
//                        interestsArray.push(new PersonalInterest(k, v));
//                    });
//                });

//                this._interests = interestsArray;


//                var tagsArray = [];
//                $.each(data.Data, function (key, value) {
//                    $.each(value.tags, function (k, v) {
//                        tagsArray.push(v);
//                    });
//                });

//                this._tags = tagsArray;


//                var imagesArray = [];
//                $.each(data.Data, function (key, value) {
//                    $.each(value.images, function (k, v) {
//                        imagesArray.push(v);
//                    });
//                });

//                this._images = imagesArray;




//                g_app_user = new User(response.id, response.name, response.age, [], [], "", imagesArray, [], 0, 0, new Date(response.last_active));


//            }

//        });


 
//    }

//}
