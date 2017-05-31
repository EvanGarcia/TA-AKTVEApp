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

        //$.ajax({ //TODO: Put message data into array that will be handled.
        //    type: 'GET',
        //    url: 'https://api.aktve-app.com/me/matches/' + this._id + '/messages?token=' + APIUserToken, //
        //    dataType: 'json',
        //    context: this, // Make the callaback function's `this` variable point to this User object
        //    success: function (data) {

        //        console.log(data.Data.messages);
                
        //    }

        //});
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

                    // Update the conversation title and profile link
                    // (TODO: Make this more robust. For example, display the names
                    // of all participants that are not the app's User.)
                    $("#PageTitle").html("Chat with " + g_user_cache.RetrieveUser(match.participants[1]).name);
                    $("#ChatProfileLink").attr("href", "profile.html?id=" + match.participants[1]);

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
                            this.AddMessage(message.message, type, author.name, author.images[0], false, false);

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
                type: 'post',
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
            avatar: avatar,
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
