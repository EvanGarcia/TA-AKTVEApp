// ChatPage is the class representing the model and implementing the controller
// functions for the "chat" page.
class ChatPage {
    constructor() {
        // Declare some member variables
        // (NOTE: We will actually initialize some of these variables later, in
        // the Init() function, which gets called once the page is actually
        // loaded.)
        this._match_id = null;
        this.messages = null;
        this.messagebar = null;
    }

    get id() {
        return this._match_id;
    }

    Init() {
        // Initialize the messages container and get a handle to it
        this.messages = myApp.messages(".messages", {
            autoLayout: true
        });

        // Initialize the messagebar and get a handle to it
        this.messagebar = myApp.messagebar(".messagebar");

        // Setup a handler function for the "Send" button
        $(".messagebar .link").click($.proxy(this.handleSend, this));

       
        
    }

    // handleSend() is a handler for the event of sending the message
    // currently typed into the message box.
    handleSend() {
        // Send the message
        this.SendMessage();
    }

    // LoadAndParseMessages(id) loads and parses any messages, optionally only
    // new (unread ones), of the app User's Match with the provided ID into the
    // messages list.
    LoadAndParseMessages(id=this._match_id, only_unread=false) {
        // Cache the Match ID
        this._match_id = id;

        

        if(g_app_user.matches != null)
        {

            // Parse out messages
            for (var i = 0; i < g_app_user.matches.length; i++) {
                if (g_app_user.matches[i].id == id) { // If this is the Match whose conversation is supposed to be displayed
                    let match = g_app_user.matches[i] // (NOTE: This is a copy. To modify the read switch of its messages, actually touch the real object.)

                    console.log(match);
                    // Update the conversation title and profile link
                    // (TODO: Make this more robust. For example, display the names
                    // of all participants that are not the app's User.)
                    $("#PageTitle").html("Chat with " + g_user_cache.RetrieveUser(match.participants[1]).name);
                    
                    $("#ChatProfileLink").click(function () {
                        clickedProf = 1;
                        console.log("Prof Clicked from chat");
                        $.ajax({
                            type: 'GET',
                            url: 'https://api.aktve-app.com/users/' + match.participants[1] + '?token=' + APIUserToken, //Change to actual facebook token
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
                                    if (data.Data.user.tags) {
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


                    if(g_app_user.matches[i].messages != null)
                    {


                    for (var j = 0; j < g_app_user.matches[i].messages.length; j++) {
                        let message = g_app_user.matches[i].messages[j]; // (NOTE: This is a copy. To modify the read switch, actually touch the real object.)

                        if (!only_unread || (only_unread && message.read == false)) {
                            // Parse out some necessary info from the message
                            let type = (message.author == null || message.author == g_app_user.id) ? "sent" : "received";
                            let author = (type == "sent") ? g_app_user : g_user_cache.RetrieveUser(message.author);

                            // Add the message to the messages list
                            // (TODO: Make this use the actual date information from the message.)
                            
                            this.AddMessage(message.message, type, author.name, false, false);

                            // Mark the message as "read"
                            g_app_user.matches[i].messages[j].read = true;
                        }
                    }

                    break;
                }
            }
            }
        }
    }

    // SendMessage() sends the message that is currently typed into the
    // messagebar on the page
        SendMessage() {
            // Clean up message text
            var messageText = this.messagebar.value().trim();
            if (messageText.length === 0) return; // Exit if message is empty

            // Empty the messagebar
            this.messagebar.clear()

            // Add the message to the messages
            // (TODO: Send the message to the server. Possibly also add it to the
            // page's message view if the server doesn't send it back to you as a
            // new message.)
            $.ajax({
                type: 'POST',
                url: "https://api.aktve-app.com/me/matches/" + this._match_id + "/message?token=" + APIUserToken, //Change to actual facebook token
                dataType: 'json',
                data: { 'message': encodeURIComponent(messageText)}, 
                context: this, // Make the callaback function's `this` variable point to this User object
                success: function (data) {
                    console.log(this._match_id);
                    console.log(data.Success.success);
                    console.log(data.Success.error);
                }
            });
            // (TODO: Actually include the message's date information.)
            this.AddMessage(messageText, "sent", g_app_user.name, g_app_user.images[0], false, false)
        }

    // AddMessage() adds the provided regular text message to the message
    // list on the page
    AddMessage(message, type="sent", name="", avatar=null, day=false, time=false) {
        this.messages.addMessage({
            text: message,
            type: type,
            //avatar: avatar,    Get working for final and add back into add message function call above
            name: name,
            day: day,
            time: time
        });
    }
}

// Instantiate a model/controller for the page
let chat_page = new ChatPage();

// Perform necessary steps once the page is loaded.
myApp.onPageInit('chat', function (page) {
    // Retrieve any necessary query string values
    var match_id = page.query.id; // The ID of the Match whose conversation will be shown

    chat_page.Init();
    chat_page.LoadAndParseMessages(match_id);
});
