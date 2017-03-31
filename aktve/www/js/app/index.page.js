// IndexPage is the class representing the model and implementing the controller
// functions for the "index" page.
class IndexPage {
    Init() {
        
    }

    updateMap() {
        // Generate the Google Static Maps API URL
        // (TODO: We need to use an API key with the "&key=..." addition to the
        // query string technically.)
        var google_map_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + g_app_user.latitude + "," + g_app_user.longitude + "&zoom=13&size=600x300&maptype=roadmap&markers=color:black%7C" + g_app_user.latitude + "," + g_app_user.longitude + "";

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

// Instantiate a model/controller for the page
let index_page = new IndexPage();

// Perform necessary steps once the page is loaded.
myApp.onPageInit('index', function (page) {
    index_page.Init();
})
