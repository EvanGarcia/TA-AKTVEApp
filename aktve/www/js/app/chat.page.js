// ChatPage is the class representing the model and implementing the controller
// functions for the "chat" page.
class ChatPage {
    Init() {
        // Initialize the messages
        var myMessages = myApp.messages('.messages', {
            autoLayout: true
        });

        // Initialize the messagebar
        var myMessagebar = myApp.messagebar('.messagebar');

        // Add some demo messages for
        // (NOTE: These will be created from messages loaded from the server in the
        // future.)
        myMessages.addMessage({
            text: "Hello, I love to hike!",
            type: "sent",
            avatar: false,
            name: "Michelle",
            day: "Monday, Mar 6",
            time: "3:08"
        });

        myMessages.addMessage({
            text: "I also really love to camp!",
            type: "sent",
            avatar: false,
            name: "Michelle",
            day: false,
            time: false
        });

        myMessages.addMessage({
            text: "Where do you like to go?",
            type: "received",
            avatar: "http://lorempixel.com/output/people-q-c-100-100-9.jpg",
            name: "Kate",
            day: false,
            time: false
        });

        myMessages.addMessage({
            text: "How about here?!?!",
            type: "sent",
            avatar: false,
            name: "Michelle",
            day: false,
            time: false
        });

        myMessages.addMessage({
            text: "<img src='http://apis.xogrp.com/media-api/images/27b736f4-fbf3-4b2e-a08c-7f5abaf6d370'>",
            type: "sent",
            avatar: false,
            name: "Michelle",
            day: false,
            time: false
        });

        myMessages.addMessage({
            text: "Wow, That looks awesome!",
            type: "received",
            avatar: "http://lorempixel.com/output/people-q-c-100-100-9.jpg",
            name: "Kate",
            day: false,
            time: false
        });


        // Handle new messages
        // (NOTE: This is simple demonstration code. It will take any messages that
        // are "sent" and randomly make them appear to be from either Kate or the
        // user. This is where actual message-sending code should go in the future.)
        var conversationStarted = false;
        $$('.messagebar .link').on('click', function () {
            // Clean up message text
            var messageText = myMessagebar.value().trim();
            if (messageText.length === 0) return; // Exit if message is empty

            // Empty the messagebar
            myMessagebar.clear()

            // Pick a random message type
            var messageType = (['sent', 'received'])[Math.round(Math.random())];

            // Set the avatar and name if the message type is a received message
            var avatar, name;
            if (messageType === 'received') {
                avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
                name = 'Kate';
            }

            // Add the message to the messages
            myMessages.addMessage({
                text: messageText,
                type: messageType,
                avatar: avatar,
                name: name,
                // Day
                day: !conversationStarted ? 'Today' : false,
                time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
            });

            conversationStarted = true;
        });
    }
}

// Instantiate a model/controller for the page
let chat_page = new ChatPage();

// Perform necessary steps once the page is loaded.
myApp.onPageInit('chat', function (page) {
    chat_page.Init();
});
