// SwipePage is the class representing the model and implementing the controller
// functions for the "swipe" page.

class SwipePage {

    Init() {
        // Create some events to process user interaction
        // (TODO: Add in touch/swipe events that call these same functions. jQuery
        // makes this very easy.)

        // TODO: Buttons are switched. Image doesnt correspond to correct one. 
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
                console.log(data.Success.success);
                console.log(data.Success.error);
                console.log(data.Data.user.name)
                $("#userName").html(data.Data.user.name);
            }
        });


    }

    // handleLike() is a handler for the event of liking another user.
    handleLike() {
        $("#SwipePicture").attr('src', 'http://hdwallpapershdpics.com/wp-content/uploads/2016/08/V4Doic.jpg');

        $.ajax({
            type: 'put',
            url: "https://api.aktve-app.com/users/" + 1 + "/feeling?token=" + APITestToken, //Change to actual facebook token
            dataType: 'json',
            data: { 'feeling': "like" },
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                console.log(data.Success.success);
                console.log(data.Success.error);
            }
        });
    }

    // handleDislike() is a handler for the event of disliking another user.
    handleDislike() {
        $("#SwipePicture").attr('src', 'https://pbs.twimg.com/profile_images/483129073208528896/3_wpD7SL.jpeg');

        $.ajax({
            type: 'put',
            url: "https://api.aktve-app.com/users/" + 1 + "/feeling?token=" + APITestToken, //Change to actual facebook token
            dataType: 'json',
            data: { 'feeling': "dislike" },
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                console.log(data.Success.success);
                console.log(data.Success.error);
            }
        });

    }
}

// Instantiate a model/controller for the page
let swipe_page = new SwipePage();
let potentials = [];
// Perform necessary steps once the page is loaded.
myApp.onPageInit('swipe', function (page) {
    swipe_page.Init();
    
});
