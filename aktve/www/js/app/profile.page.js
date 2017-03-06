myApp.onPageInit('profile', function (page) {
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
        interests_string += user.interests[i].name;
        if (i < (user.interests.length - 1)) {
            interests_string += ", ";
        }
    }
    $("#ProfileInterests").html(interests_string);
    $("#ProfileBio").html(user.bio);
})
