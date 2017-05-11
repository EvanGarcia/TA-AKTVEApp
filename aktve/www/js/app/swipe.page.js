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
        
        // Below code gets first potential user and puts them on the stack of cards
        $.ajax({ 
            type: 'GET',
            url: 'https://api.aktve-app.com/potentials' + '?token=' + APITestToken, //
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                potentials = data.Data.potential_user_ids;    
            },
            async: false
        });

        console.log(potentials);

        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/users/' + potentials[0] + '?token=' + APITestToken, //Change to actual facebook token
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
                        innerHTML = "<img data-src=\"" + data.Data.user.images[0] + "\"id=\"SwipePicture\" class=\"lazy lazy-fadeIn app-swipe-picture\" alt=\"" + pontentialIndex + "\">";
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
        });
    }


    // handleLike() is a handler for the event of liking another user.
    handleLike() {
 
        $.ajax({
            type: 'put',
            url: "https://api.aktve-app.com/users/" + pontentialIndex + "/feeling?token=" + APITestToken, //Change to actual facebook token
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
            url: 'https://api.aktve-app.com/users/' + potentials[pontentialIndex] + '?token=' + APITestToken, //Change to actual facebook token
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
                        innerHTML = "<img data-src=\"" + data.Data.user.images[0] + "\"id=\"SwipePicture\" class=\"lazy lazy-fadeIn app-swipe-picture\" alt=\"" + pontentialIndex + "\">";
                    $("#userName").html(data.Data.user.name + ", " + data.Data.user.age);
                    $("#lastAct").html("Last Active: " + new Date(data.Data.user.last_active));
                    $("#SwipeInterests").html("");

                    $.each(data.Data, function (key, value) { // First Level
                        $.each(value.interests, function (k, v) {  // The contents inside stars
                            document.getElementById("SwipeInterests").
                        innerHTML += "<div class=\"chip\">\n<div class=\"chip-media bg-gray\">" + v + "</div>\n<div class=\"chip-label\">"+ k +"</div></div>";
                        });
                    });
                    $("#SwipeDetails").html("");

                    for (var i = 0; i < data.Data.user.tags.length; i++)
                    {
                        if (data.Data.user.tags[i] == "friends_men")
                        {
                            document.getElementById("SwipeDetails").
                        innerHTML += "<div class=\"chip bg-blue\">\n<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Men</div></div>"
                        } else if (data.Data.user.tags[i] == "friends_women")
                        {
                            document.getElementById("SwipeDetails").
                        innerHTML += "<div class=\"chip bg-blue\">\n<div class=\"chip-media\"><i class=\"fa fa-hand-peace-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Women</div></div>"
                        } else if (data.Data.user.tags[i] == "dates_women")
                        {
                            document.getElementById("SwipeDetails").
                        innerHTML += "<div class=\"chip bg-red\">\n<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Women</div></div>"
                        } else if (data.Data.user.tags[i] == "dates_men")
                        {
                            document.getElementById("SwipeDetails").
                        innerHTML += "<div class=\"chip bg-red\">\n<div class=\"chip-media\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i></div><div class=\"chip-label\">Men</div></div>"
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
            url: "https://api.aktve-app.com/users/" + pontentialIndex + "/feeling?token=" + APITestToken, //Change to actual facebook token
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
            url: 'https://api.aktve-app.com/users/' + potentials[pontentialIndex] + '?token=' + APITestToken, //Change to actual facebook token
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
                        innerHTML = "<img data-src=\"" + data.Data.user.images[0] + "\"id=\"SwipePicture\" class=\"lazy lazy-fadeIn app-swipe-picture\" alt=\"" + pontentialIndex + "\">";
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
        });
    }
}

// Instantiate a model/controller for the page
let swipe_page = new SwipePage();
let potentials = [];
var pontentialIndex = 0;
// Perform necessary steps once the page is loaded.
myApp.onPageInit('swipe', function (page) {
    swipe_page.Init();
    
});
