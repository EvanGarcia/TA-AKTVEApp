// ProfilePage is the class representing the model and implementing the controller
// functions for the "profile" page.
class ProfilePage {
    Init() {
        // Initialize the profile picture swiper
        var profilePicturesSwiper = myApp.swiper('#ProfilePicturesSwiper', {
            preloadImages: false,
            lazyLoading: true,
            pagination: '.swiper-pagination',
            speed: 400,
            spaceBetween: 100
        });

        // Create a new User object for the user in this profile
        // (NOTE: In the future, this User object will actually be created with data
        // from the server. For now, initializing an empty User object results in
        // one with demo data.)
        let user = new User();
        user.is_me = true; // For now, pretend like this user is us

        // If this profile is not the current user's, hide the settings button
        if (!user.is_me) {
            $("#SettingsButton").hide();
        }

        // Set all of the content for the profile page
        // (TODO: We need to actually determine the distance based on the user's
        // latitude and longitude and the current latitude and longitude. This could
        // probably end up being a class function or a global function.)
        $("#ProfileName").html(user.name + ", " + user.age);
        $("#ProfileDistance").html("15 Miles Away");
        $("#ProfileLastActive").html("Last Active " + user.last_active);
        let interests_string = "";
        for (var i = 0; i < user.interests.length; i++) {
            interests_string += "<div class=\"chip\">\n";
            interests_string += "\t<div class=\"chip-media bg-gray\">" + user.interests[i].experience + "</div>\n";
            interests_string += "\t<div class=\"chip-label\">" + user.interests[i].name + "</div>\n";
            interests_string += "</div>\n";
        }
        $("#ProfileInterests").html(interests_string);
        $("#ProfileBio").html(user.bio);

        // Set the user location map on the profile page
        // (TODO: Use an actual Google Static Maps API key here.)
        var google_map_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + user.latitude + "," + user.longitude + "&zoom=13&size=400x200&maptype=roadmap&markers=color:black%7C" + user.latitude + "," + user.longitude + "&" + GOOGLE_STATIC_MAPS_API_KEY;
        $("#ProfileLocationMap").attr("src", google_map_url);
    }
}

// Instantiate a model/controller for the page
let profile_page = new ProfilePage();

// Perform necessary steps once the page is loaded.
myApp.onPageInit('profile', function (page) {
    profile_page.Init();
});
