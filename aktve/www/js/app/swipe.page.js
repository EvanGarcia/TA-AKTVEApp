myApp.onPageInit('swipe', function (page) {
    // Create some events to process user interaction
    // (TODO: Add in touch/swipe events that call these same functions. jQuery
    // makes this very easy.)
    $("#SwipeLikeButton").click(SwipeLike);
    $("#SwipeDislikeButton").click(SwipeDislike);
});

function SwipeLike() {
    $("#SwipePicture").attr('src', 'http://hdwallpapershdpics.com/wp-content/uploads/2016/08/V4Doic.jpg');
}
function SwipeDislike() {
    $("#SwipePicture").attr('src', 'https://pbs.twimg.com/profile_images/483129073208528896/3_wpD7SL.jpeg');
}
