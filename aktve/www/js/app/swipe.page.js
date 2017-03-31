// SwipePage is the class representing the model and implementing the controller
// functions for the "swipe" page.
class SwipePage {
    Init() {
        // Create some events to process user interaction
        // (TODO: Add in touch/swipe events that call these same functions. jQuery
        // makes this very easy.)
        $("#SwipeLikeButton").click(swipe_page.handleLike);
        $("#SwipeDislikeButton").click(swipe_page.handleDislike);
    }

    // handleLike() is a handler for the event of liking another user.
    handleLike() {
        $("#SwipePicture").attr('src', 'http://hdwallpapershdpics.com/wp-content/uploads/2016/08/V4Doic.jpg');
    }

    // handleDislike() is a handler for the event of disliking another user.
    handleDislike() {
        $("#SwipePicture").attr('src', 'https://pbs.twimg.com/profile_images/483129073208528896/3_wpD7SL.jpeg');
    }
}

// Instantiate a model/controller for the page
let swipe_page = new SwipePage();

// Perform necessary steps once the page is loaded.
myApp.onPageInit('swipe', function (page) {
    swipe_page.Init();
});
