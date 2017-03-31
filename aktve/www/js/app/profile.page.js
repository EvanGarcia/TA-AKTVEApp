// ProfilePage is the class representing the model and implementing the controller
// functions for the "profile" page.
class ProfilePage {
    constructor() {
        this._user = g_app_user; // By default, make this page display the app User's profile
    }

    // LoadAndParseUser() loads profile data for the User who's ID is provided
    // and parses it into the page elements.
    // (NOTE: You can call this function without passing it a new User ID, as
    // long as it has already been called once with the proper User ID. This is
    // useful, for example, with an asynchronous Ajax callback where we know the
    // the User ID the whole time, but need to trigger an Ajax request the first
    // time around which will then call this function again when it completed.)
    LoadAndParseUser(user_id=this._user_id) {
        // Retrieve data for the provided User and populate a User object at
        // this._user with it
        if (isNaN(user_id) || user_id == null || user_id == g_app_user.id) { // If the provided ID is for the app User
            // Cache the app User as the User whose profile the page is to display
            this._user = g_app_user;

            // Show the settings button for the app User's profile
            $("#SettingsButton").show();
        }
        else { // Otherwise, if the provided ID is for another user
            // (TODO: Load in other User's data from server and populate a User
            // object to be stored in this._user, which will be used below to
            // actually parse the page.)

            // Hid the settings button for non-app User's profiles
            $("#SettingsButton").hide();
        }

        // Parse the User's images into the page
        let pictures_string = "";
        pictures_string += "<div class=\"swiper-wrapper\" id=\"ProfilePictures\">";
        for (var i = 0; i < this._user.images.length; i++) {
            pictures_string += "\t<div class=\"swiper-slide\">";
            pictures_string += "\t\t<img src=\"" + this._user.images[i] + "\" id=\"ProfilePicture" + i.toString() + "\" class=\"swiper-lazy app-profile-picture\">";
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

        // Parse the User's basic data into the page
        // (TODO: We need to actually determine the distance based on the user's
        // latitude and longitude and the current latitude and longitude. This could
        // probably end up being a class function or a global function.)
        $("#ProfileName").html(this._user.name + ", " + this._user.age);
        $("#ProfileDistance").html("??" + " Miles Away"); // (TODO: See above.)
        $("#ProfileLastActive").html("Seen " + this._user.last_active);
        $("#ProfileBio").html(this._user.bio);

        // Parse the User's interests into the page
        let interests_string = "";
        for (var i = 0; i < this._user.interests.length; i++) {
            interests_string += "<div class=\"chip\">\n";
            interests_string += "\t<div class=\"chip-media bg-gray\">" + this._user.interests[i].experience + "</div>\n";
            interests_string += "\t<div class=\"chip-label\">" + this._user.interests[i].name + "</div>\n";
            interests_string += "</div>\n";
        }
        $("#ProfileInterests").html(interests_string);

        // Parse the User's tags into the page
        let tags_string = "";
        for (var i = 0; i < this._user.tags.length; i++) {
            if (this._user.tags[i] == "friends_men" || this._user.tags[i] == "friends_women") { // If the tag is a "friend" tag
                tags_string += "<div class=\"chip bg-blue\">\n";
                tags_string += "\t<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div>\n";
                tags_string += "\t<div class=\"chip-label\">" + ((this._user.tags[i] == "friends_men") ? "Men" : "Women") + "</div>\n";
                tags_string += "</div>\n";
            }
            else if (this._user.tags[i] == "dates_men" || this._user.tags[i] == "dates_women") { // If the tag is a "date" tag
                tags_string += "<div class=\"chip bg-red\">\n";
                tags_string += "\t<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div>\n";
                tags_string += "\t<div class=\"chip-label\">" + ((this._user.tags[i] == "friends_men") ? "Men" : "Women") + "</div>\n";
                tags_string += "</div>\n";
            }
        }
        $("#ProfileTags").html(tags_string);

        // Parse a map of the User's location into the page
        var google_map_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + this._user.latitude + "," + this._user.longitude + "&zoom=13&size=400x200&maptype=roadmap&markers=color:black%7C" + this._user.latitude + "," + this._user.longitude + "&" + GOOGLE_STATIC_MAPS_API_KEY;
        $("#ProfileLocationMap").attr("src", google_map_url);
    }
}

// Instantiate a model/controller for the page
let profile_page = new ProfilePage();

// Perform necessary steps once the page is loaded.
myApp.onPageInit('profile', function (page) {
    // Retrieve any necessary query string values
    var user_id = page.query.id; // The ID of the User whose profile should be shown

    profile_page.LoadAndParseUser(user_id); // Retrieve the User's info and display it on the page
});
