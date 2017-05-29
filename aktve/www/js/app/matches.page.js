// MatchesPage is the class representing the model and implementing the
// controller functions for the "matches" page.
class MatchesPage {
    Init() {
        this.PopulateMatchesList();
    }

    // PopulateMatchesList() adds all of the current app User's matches to the
    // list on the page.
    PopulateMatchesList() {
        let html = "";

        for (var i = 0; i < g_app_user.matches.length; i++) {
            let match = g_app_user.matches[i];
            let other_user = g_user_cache.RetrieveUser(match.participants[1]);

            console.log(other_user);

            html += "<li>\n";
            html += "\t<a href=\"chat.html?id=" + match.id + "\" class=\"item-link item-content\">\n";
            html += "\t\t<div class=\"item-media app-matches-list-profile-picture-wrapper\"><img src=\"" + other_user.images[i] + "\" class=\"app-matches-list-profile-picture\"></div>\n";
            html += "\t\t<div class=\"item-inner\">\n";
            html += "\t\t\t<div class=\"item-title-row\">\n";
            html += "\t\t\t\t<div class=\"item-title\">" + other_user.name + "</div>\n";
            if (match.messages != null) {
                html += "\t\t\t\t<div class=\"item-after\">" + ((match.messages.length > 0) ? match.messages[match.messages.length - 1].date : "") + "</div>\n";
            }
            html += "\t\t\t</div>\n";
            if (match.messages != null) {
                html += "\t\t\t\t<div class=\"item-after\">" + ((match.messages.length > 0) ? match.messages[match.messages.length - 1].message : "") + "</div>\n";
            }
            html +="\t\t</div>\n";

            html += "\t</a>\n";
            html += "</li>\n";
        }

        $("#MatchesList").html(html);
    }
}

// Instantiate a model/controller for the page
let matches_page = new MatchesPage();

// Perform necessary steps once the page is loaded.
myApp.onPageInit('matches', function (page) {
    matches_page.Init();
});
