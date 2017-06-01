// ProfilePage is the class representing the model and implementing the controller
// functions for the "profile" page.
class ProfilePage {
    constructor() {
        this._user = g_app_user; // By default, make this page display the app User's profile
    }

    Init() { //When the user clicks on another user in the swipe page. Bug where clicking the first time.
       
    } 

    // LoadAndParseUser(...) loads profile data for the User who's ID is provided
    // and parses it into the page elements.
    LoadAndParseUser(id) {
        // Retrieve data for the provided User and populate a User object at
        // this._user with it
        if (isNaN(id) || id == null || id == g_app_user.id ) { // If the provided ID is for the app User
            // Cache the app User as the User whose profile the page is to display
            this._user = g_app_user;

            // Show the settings button for the app User's profile
            $("#SettingsButton").show();
        }
        else { // Otherwise, if the provided ID is for another user
            // Retrieve and cache the User
            this._user = g_user_cache.RetrieveUser(id);

            // Hid the settings button for non-app User's profiles
            $("#SettingsButton").hide();
        }
        console.log("Im getting called");
        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/me' + '?token=' + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                console.log(data);
                let pictures_string = "";
                pictures_string += "<div class=\"swiper-wrapper\" id=\"ProfilePictures\">";
                for (var i = 0; i < data.Data.images.length; i++) {
                    pictures_string += "\t<div class=\"swiper-slide\">";
                    pictures_string += "\t\t<img src=\"" + data.Data.images[i] + "\" id=\"ProfilePicture" + i.toString() + "\" class=\"swiper-lazy app-profile-picture\">";
                    pictures_string += "\t\t<div class=\"preloader\"></div>";
                    pictures_string += "\t</div>";
                }
                pictures_string += "</div>";
                pictures_string += "<div class=\"swiper-pagination\"></div>"
                $("#ProfilePicturesSwiper").html(pictures_string);
                myApp.swiper('#ProfilePicturesSwiper', {
                    preloadImages: false,
                    lazyLoading: true,
                    pagination: '.swiper-pagination',
                    speed: 400,
                    spaceBetween: 100
                });

                $("#ProfileName").html(data.Data.name + ", " + data.Data.age); // Set to ?? initialy incase the ajax call fails

                $("#ProfileLastActive").html("Seen " + data.Data.last_active);
                $("#ProfileBio").html(data.Data.bio);

                let interests_string = "";
                    $.each(data.Data.interests, function (k, v) {  // The contents inside stars
                        interests_string += "<div class=\"chip\">\n";
                        interests_string += "\t<div class=\"chip-media bg-gray\">" + v + "</div>\n";
                        interests_string += "\t<div class=\"chip-label\">" + k + "</div>\n";
                        interests_string += "</div>\n";
                    });
                    $("#ProfileInterests").html(interests_string);
                    console.log(data.Data);

                    let tags_string = "";
                    if (data.Data.tags) {
                    for (var i = 0; i < data.Data.tags.length; i++) {
                        if (data.Data.tags[i] == "friends_men" || data.Data.tags[i] == "friends_women") { // If the tag is a "friend" tag
                            tags_string += "<div class=\"chip bg-blue\">\n";
                            tags_string += "\t<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div>\n";
                            tags_string += "\t<div class=\"chip-label\">" + ((data.Data.tags[i] == "friends_men") ? "Men" : "Women") + "</div>\n";
                            tags_string += "</div>\n";
                        }
                        else if (data.Data.tags[i] == "dates_men" || data.Data.tags[i] == "dates_women") { // If the tag is a "date" tag
                            tags_string += "<div class=\"chip bg-red\">\n";
                            tags_string += "\t<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div>\n";
                            tags_string += "\t<div class=\"chip-label\">" + ((data.Data.tags[i] == "friends_men") ? "Men" : "Women") + "</div>\n";
                            tags_string += "</div>\n";
                        }
                    }
                }
                $("#ProfileTags").html(tags_string);

                var google_map_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + data.Data.latitude + "," + data.Data.longitude + "&zoom=13&size=400x200&maptype=roadmap&markers=color:black%7C" + data.Data.latitude + "," + data.Data.longitude + "&" + GOOGLE_STATIC_MAPS_API_KEY;
                $("#ProfileLocationMap").attr("src", google_map_url);
            }
        });

        
    }
}

// Instantiate a model/controller for the page
let profile_page = new ProfilePage();
// Perform necessary steps once the page is loaded.
myApp.onPageInit('profile', function (page) {
    // Retrieve any necessary query string values
    var user_id = page.query.id; // The ID of the User whose profile should be shown
    profile_page.Init()
    // Flag for Prof Clicked
    if (clickedProf == 1) {
        clickedProf = 0;
    } else {
        profile_page.LoadAndParseUser(user_id);
        console.log("Iran for somereason")
    }
    
});
