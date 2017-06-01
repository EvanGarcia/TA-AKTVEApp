// SwipePage is the class representing the model and implementing the controller
// functions for the "swipe" page.
// DUE TO SCOPING issues, the code inside each handle function is duplicated - Inside handlelike and handledislike cannot access outside  
class SwipePage {

    Init() {
        // Create some events to process user interaction
        // (TODO: Add in touch/swipe events that call these same functions. jQuery
        // makes this very easy.)

        $("#SwipeLikeButton").click(swipe_page.handleLike);
        $("#SwipeDislikeButton").click(swipe_page.handleDislike);

        $("#profPic").click(function () {
            clickedProf = 1;
            console.log("Prof Clicked");
            $.ajax({
                type: 'GET',
                url: 'https://api.aktve-app.com/users/' + potentials[pontentialIndex] + '?token=' + APIUserToken, //Change to actual facebook token
                dataType: 'json',
                context: this, // Make the callaback function's `this` variable point to this User object
                success: function (data) {
                    if (data.Success.success == false) {

                    } else {
                        var theirLat = data.Data.user.latitude;
                        var theirLong = data.Data.user.longitude;

                        $.ajax({
                            type: 'GET',
                            url: 'https://api.aktve-app.com/me' + '?token=' + APIUserToken, //Change to actual facebook token
                            dataType: 'json',
                            context: this, // Make the callaback function's `this` variable point to this User object
                            success: function (data) {
                                console.log(data);
                                var R = 3959; // in miles
                                let y1 = data.Data.latitude;
                                let x1 = data.Data.longitude;
                                let x2 = theirLong
                                let y2 = theirLat
                                var dLat = (y2 - y1) * (Math.PI / 180);
                                var dLon = (x2 - x1) * (Math.PI / 180);
                                var lat1 = (y1) * (Math.PI / 180);
                                var lat2 = (y2) * (Math.PI / 180);
                                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                  Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
                                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                var d = R * c;

                                $("#ProfileDistance").html(Math.round(d) + " Miles Away");
                            }
                        });

                        let pictures_string = "";
                        pictures_string += "<div class=\"swiper-wrapper\" id=\"ProfilePictures\">";
                        for (var i = 0; i < data.Data.user.images.length; i++) {
                            pictures_string += "\t<div class=\"swiper-slide\">";
                            pictures_string += "\t\t<img src=\"" + data.Data.user.images[i] + "\" id=\"ProfilePicture" + i.toString() + "\" class=\"swiper-lazy app-profile-picture\">";
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

                        $("#ProfileName").html(data.Data.user.name + ", " + data.Data.user.age); // Set to ?? initialy incase the ajax call fails

                        $("#ProfileLastActive").html("Seen " + data.Data.user.last_active);
                        $("#ProfileBio").html(data.Data.user.bio);

                        let interests_string = "";
                        $.each(data.Data, function (key, value) { // First Level
                            $.each(value.interests, function (k, v) {  // The contents inside stars
                                interests_string += "<div class=\"chip\">\n";
                                interests_string += "\t<div class=\"chip-media bg-gray\">" + v + "</div>\n";
                                interests_string += "\t<div class=\"chip-label\">" + k + "</div>\n";
                                interests_string += "</div>\n";
                            });
                        });
                        $("#ProfileInterests").html(interests_string);

                        let tags_string = "";
                        if (data.Data.user.tags){
                            for (var i = 0; i < data.Data.user.tags.length; i++) {
                                if (data.Data.user.tags[i] == "friends_men" || data.Data.user.tags[i] == "friends_women") { // If the tag is a "friend" tag
                                    tags_string += "<div class=\"chip bg-blue\">\n";
                                    tags_string += "\t<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div>\n";
                                    tags_string += "\t<div class=\"chip-label\">" + ((data.Data.user.tags[i] == "friends_men") ? "Men" : "Women") + "</div>\n";
                                    tags_string += "</div>\n";
                                }
                                else if (data.Data.user.tags[i] == "dates_men" || data.Data.user.tags[i] == "dates_women") { // If the tag is a "date" tag
                                    tags_string += "<div class=\"chip bg-red\">\n";
                                    tags_string += "\t<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div>\n";
                                    tags_string += "\t<div class=\"chip-label\">" + ((data.Data.user.tags[i] == "friends_men") ? "Men" : "Women") + "</div>\n";
                                    tags_string += "</div>\n";
                                }
                            }
                    }
                        $("#ProfileTags").html(tags_string);

                        var google_map_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + data.Data.user.latitude + "," + data.Data.user.longitude + "&zoom=13&size=400x200&maptype=roadmap&markers=color:black%7C" + data.Data.user.latitude + "," + data.Data.user.longitude + "&" + GOOGLE_STATIC_MAPS_API_KEY;
                        $("#ProfileLocationMap").attr("src", google_map_url);
                    }
                }
            });
        });

        // Below code gets first potential user and puts them on the stack of cards
        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/potentials' + '?token=' + APIUserToken, //
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                if (!data.Data.potential_user_ids) {
                    potentials[0] = -1;
                }else{
                    potentials = data.Data.potential_user_ids;
                }
            },
            async: false
        });

        console.log(potentials);

        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/users/' + potentials[0] + '?token=' + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                if (data.Success.success == false) {
                    document.getElementById("cardContent").
                        innerHTML = "<div class=\"card-header\">There are no more people in your area!</div><div class=\"card-content\"><div class=\"card-content-inner\">Please check back later for more new potential friends! Have fun exploring!</div>";
                    $("#SwipeLikeButton").hide();
                    $("#SwipeDislikeButton").hide();
                } else {
                    $("#SwipeLikeButton").show();
                    $("#SwipeDislikeButton").show();
                    document.getElementById("profPic").
                        innerHTML = "<img data-src=\"" + data.Data.user.images[0] + "\"id=\"SwipePicture\" class=\"lazy lazy-fadeIn app-swipe-picture\">";
                    $("#userName").html(data.Data.user.name + ", " + data.Data.user.age);
                    $("#lastAct").html("Last Active: " + new Date(data.Data.user.last_active));
                    $("#SwipeInterests").html("");

                    $.each(data.Data, function (key, value) { // First Level
                        $.each(value.interests, function (k, v) {  // The contents inside stars
                            document.getElementById("SwipeInterests").
                        innerHTML += "<div class=\"chip\">\n<div class=\"chip-media bg-gray\">" + v + "</div>\n<div class=\"chip-label\">" + k + "</div></div>";
                        });
                    });
                    $("#SwipeDetails").html("");

                    if (data.Data.user.tags){
                        for (var i = 0; i < data.Data.user.tags.length; i++) {
                            if (data.Data.user.tags[i] == "friends_men") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-blue\">\n<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Men</div></div>"
                            } else if (data.Data.user.tags[i] == "friends_women") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-blue\">\n<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Women</div></div>"
                            } else if (data.Data.user.tags[i] == "dates_women") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-red\">\n<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Women</div></div>"
                            } else if (data.Data.user.tags[i] == "dates_men") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-red\">\n<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Men</div></div>"
                            }
                        }

                    }
                }
            }
        });
    }


    // handleLike() is a handler for the event of liking another user.
    handleLike() {

        $.ajax({
            type: 'put',
            url: "https://api.aktve-app.com/users/" + potentials[pontentialIndex] + "/feeling?token=" + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            data: { 'feeling': "like" },
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                console.log(data.Success.success);
                console.log(data.Success.error);
            }
        });

        pontentialIndex++;

        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/users/' + potentials[pontentialIndex] + '?token=' + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                if (data.Success.success == false) {
                    document.getElementById("cardContent").
                        innerHTML = "<div class=\"card-header\">There are no more people in your area!</div><div class=\"card-content\"><div class=\"card-content-inner\">Please check back later for more new potential friends! Have fun exploring!</div>";
                    $("#SwipeLikeButton").hide();
                    $("#SwipeDislikeButton").hide();
                } else {
                    document.getElementById("profPic").
                        innerHTML = "<img data-src=\"" + data.Data.user.images[0] + "\"id=\"SwipePicture\" class=\"lazy lazy-fadeIn app-swipe-picture\">";
                    $("#userName").html(data.Data.user.name + ", " + data.Data.user.age);
                    $("#lastAct").html("Last Active: " + new Date(data.Data.user.last_active));
                    $("#SwipeInterests").html("");

                    $.each(data.Data, function (key, value) { // First Level
                        $.each(value.interests, function (k, v) {  // The contents inside stars
                            document.getElementById("SwipeInterests").
                        innerHTML += "<div class=\"chip\">\n<div class=\"chip-media bg-gray\">" + v + "</div>\n<div class=\"chip-label\">" + k + "</div></div>";
                        });
                    });
                    $("#SwipeDetails").html("");
                    if (data.Data.user.tags) {
                        for (var i = 0; i < data.Data.user.tags.length; i++) {
                            if (data.Data.user.tags[i] == "friends_men") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-blue\">\n<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Men</div></div>"
                            } else if (data.Data.user.tags[i] == "friends_women") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-blue\">\n<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Women</div></div>"
                            } else if (data.Data.user.tags[i] == "dates_women") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-red\">\n<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Women</div></div>"
                            } else if (data.Data.user.tags[i] == "dates_men") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-red\">\n<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Men</div></div>"
                            }
                        }
                    }
                }
            }
        });
    }

    // handleDislike() is a handler for the event of disliking another user.
    handleDislike() {

        $.ajax({
            type: 'put',
            url: "https://api.aktve-app.com/users/" + potentials[pontentialIndex] + "/feeling?token=" + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            data: { 'feeling': "dislike" },
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                console.log(data.Success.success);
                console.log(data.Success.error);
            }
        });

        pontentialIndex++;

        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/users/' + potentials[pontentialIndex] + '?token=' + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                if (data.Success.success == false) {
                    document.getElementById("cardContent").
                        innerHTML = "<div class=\"card-header\">There are no more people in your area!</div><div class=\"card-content\"><div class=\"card-content-inner\">Please check back later for more new potential friends! Have fun exploring!</div>";
                    $("#SwipeLikeButton").hide();
                    $("#SwipeDislikeButton").hide();
                } else {
                    document.getElementById("profPic").
                        innerHTML = "<img data-src=\"" + data.Data.user.images[0] + "\"id=\"SwipePicture\" class=\"lazy lazy-fadeIn app-swipe-picture\">";
                    $("#userName").html(data.Data.user.name + ", " + data.Data.user.age);
                    $("#lastAct").html("Last Active: " + new Date(data.Data.user.last_active));
                    $("#SwipeInterests").html("");

                    $.each(data.Data, function (key, value) { // First Level
                        $.each(value.interests, function (k, v) {  // The contents inside stars
                            document.getElementById("SwipeInterests").
                        innerHTML += "<div class=\"chip\">\n<div class=\"chip-media bg-gray\">" + v + "</div>\n<div class=\"chip-label\">" + k + "</div></div>";
                        });
                    });
                    $("#SwipeDetails").html("");

                    if (data.Data.user.tags) {
                        for (var i = 0; i < data.Data.user.tags.length; i++) {
                            if (data.Data.user.tags[i] == "friends_men") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-blue\">\n<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Men</div></div>"
                            } else if (data.Data.user.tags[i] == "friends_women") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-blue\">\n<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Women</div></div>"
                            } else if (data.Data.user.tags[i] == "dates_women") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-red\">\n<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Women</div></div>"
                            } else if (data.Data.user.tags[i] == "dates_men") {
                                document.getElementById("SwipeDetails").
                            innerHTML += "<div class=\"chip bg-red\">\n<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Men</div></div>"
                            }
                        }
                    }
                }
            }
        });
    }
}

// Instantiate a model/controller for the page
let swipe_page = new SwipePage();
let potentials = [];
var pontentialIndex = 0;
let clickedProf = 0;
// Perform necessary steps once the page is loaded.
myApp.onPageInit('swipe', function (page) {
    swipe_page.Init();

});