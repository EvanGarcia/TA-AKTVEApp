class IndexPage {
    updateMap() {
        // Generate the Google Static Maps API URL
        // (TODO: We need to use an API key with the "&key=..." addition to the
        // query string technically.)
        var google_map_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + app_user.latitude + "," + app_user.longitude + "&zoom=13&size=600x300&maptype=roadmap&markers=color:black%7C" + app_user.latitude + "," + app_user.longitude + "";

        // Set the map to the right URL and then show it
        $("#IndexLocationMap").attr("src", google_map_url);
        $("#IndexLocationSearch").hide();
        $("#IndexLocationMap").show();
    }

    hideMap() {
        $("#IndexLocationMap").hide();
        $("#IndexLocationSearch").show();
    }
}

let index_page = new IndexPage();

myApp.onPageInit('index', function (page) {

})
