// ChatPage is the class representing the model and implementing the controller
// functions for the "chat" page.
class ChatPage {
    constructor() {
        // Declare some member variables
        // (NOTE: We will actually initialize some of these variables later, in
        // the Init() function, which gets called once the page is actually
        // loaded.)
        this.messages = null;
        this.messagebar = null;
        this.conversationHasStarted = false;
    }

    Init() {
        // Initialize the messages container and get a handle to it
        this.messages = myApp.messages(".messages", {
            autoLayout: true
        });

        // Initialize the messagebar and get a handle to it
        this.messagebar = myApp.messagebar(".messagebar");

        // Setup a handler function for the "Send" button
        $(".messagebar .link").click(this.handleSend);

        ////////////////////////////////////////////////////////////////////////
        // Add some demo messages for
        // (NOTE: These will be created from messages loaded from the server in the
        // future.)
        this.messages.addMessage({
            text: "Hello, I love to hike!",
            type: "sent",
            avatar: false,
            name: "Michelle",
            day: "Monday, Mar 6",
            time: "3:08"
        });

        this.messages.addMessage({
            text: "I also really love to camp!",
            type: "sent",
            avatar: false,
            name: "Michelle",
            day: false,
            time: false
        });

        this.messages.addMessage({
            text: "Where do you like to go?",
            type: "received",
            avatar: "http://lorempixel.com/output/people-q-c-100-100-9.jpg",
            name: "Kate",
            day: false,
            time: false
        });

        this.messages.addMessage({
            text: "How about here?!?!",
            type: "sent",
            avatar: false,
            name: "Michelle",
            day: false,
            time: false
        });

        this.messages.addMessage({
            text: "<img src='http://apis.xogrp.com/media-api/images/27b736f4-fbf3-4b2e-a08c-7f5abaf6d370'>",
            type: "sent",
            avatar: false,
            name: "Michelle",
            day: false,
            time: false
        });

        this.messages.addMessage({
            text: "Wow, That looks awesome!",
            type: "received",
            avatar: "http://lorempixel.com/output/people-q-c-100-100-9.jpg",
            name: "Kate",
            day: false,
            time: false
        });
        ////////////////////////////////////////////////////////////////////////
    }

    // handleSend() is a handler for the event of sending the message
    // currently typed into the message box.
    handleSend() {
        // Clean up message text
        var messageText = this.messagebar.value().trim();
        if (messageText.length === 0) return; // Exit if message is empty

        // Empty the messagebar
        this.messagebar.clear()

        // Pick a random message type
        var messageType = (['sent', 'received'])[Math.round(Math.random())];

        // Set the avatar and name if the message type is a received message
        var messageAvatar, messageName;
        if (messageType === 'received') {
            messageAvatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
            messageName = 'Kate';
        }

        // Add the message to the messages
        AddMessage(messageText, messageType, messageName, messageAvatar, !this.conversationHasStarted ? 'Today' : false, !this.conversationHasStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false)

        // Update the sentinel for the UI to know how to display the
        // message's dates
        this.conversationHasStarted = true;
    }

    // SendMessage() sends the message that is currently typed into the
    // messagebar on the page
    SendMessage() {
        // (TODO: Send the message to the server. Possibly also add it to the
        // page's message view if the server doesn't send it back to you as a
        // new message.)
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
    chat_page.Init();
});
