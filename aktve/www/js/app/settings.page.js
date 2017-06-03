// Settings page
class SettingsPage {
    constructor() {
        
    }


    Init() {

        $("#settingsback").click(settings_page.storeSettings);
        $("#addInterest").click(settings_page.addInterest);
        $("#LogoutButton").click(settings_page.logoutHelp);
        $("#ClearInterest").click(settings_page.clearHelp);
        $("#DeleteButton").click(settings_page.deleteHelp);
        
        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/me/settings?token=' + APIUserToken, 
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                console.log(data.Success.success);
                console.log(data.Success.error);
                console.log(data.Data.sharelocation);
                console.log(data.Data.friendmen);
                console.log(data.Data.friendwomen);

                // Handling for the switches on the settings page
                if (data.Data.sharelocation)
                {
                    $("#locationsharing").prop('checked',true)
                }
                if (data.Data.friendwomen)
                {
                    $("#womenbox").prop('checked', true)
                }
                if (data.Data.friendmen)
                {
                    $("#menbox").prop('checked', true)
                }
                if (data.Data.datemen) {
                    $("#mendatebox").prop('checked', true)
                }
                if (data.Data.datewomen) {
                    $("#womendatebox").prop('checked', true)
                }
            }
        });

        // Load users interests
        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/me?token=' + APIUserToken, 
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                let interests_string = "";
                $.each(data.Data.interests, function (k, v) {  // The contents inside stars
                    if (interArr.indexOf(k)<0) {
                        interArr.push(k);
                        skillArr.push(v);
                    }
                    interests_string += "<div class=\"chip\">\n";
                    interests_string += "\t<div class=\"chip-media bg-gray\">" + v + "</div>\n";
                    interests_string += "\t<div class=\"chip-label\">" + k + "</div>\n";
                    interests_string += "</div>\n";
                });
                $("#SettingsInterests").html(interests_string);
                console.log(interArr);
                if (data.Data.bio) {
                    $("#bioId").html("<textarea placeholder=\"Bio goes here...\">" + data.Data.bio + "</textarea>");
                }
            }
        });
    } 

    // Function that store the settings when the user clicks back
    storeSettings() {

        var locisChecked = $("#locationsharing").prop("checked");
        console.log(locisChecked);
        var menisChecked = $("#menbox").prop("checked");
        console.log(menisChecked);
        var womenisChecked = $("#womenbox").prop("checked");
        console.log(womenisChecked);
        var mendateisChecked = $("#mendatebox").prop("checked");
        console.log(mendateisChecked);
        var womendateisChecked = $("#womendatebox").prop("checked");
        console.log(womendateisChecked);

            $.ajax({
                type: 'post',
                url: "https://api.aktve-app.com/me/settings?token=" + APIUserToken, //Change to actual facebook token
                dataType: 'json',
                data: {
                    'sharelocation': locisChecked,
                    'friendmen': menisChecked,
                    'friendwomen': womenisChecked,
                    'datemen': mendateisChecked,
                    'datewomen': womendateisChecked
                },
                context: this, // Make the callaback function's `this` variable point to this User object
                success: function (data) {
                    console.log(data.Success.success);
                    console.log(data.Success.error);
                },
                async: false
                
            });

            // Make user interest array compatible for put request
            var interestObj = "{";
            for (var i = 0; i < interArr.length; i++) {
                interestObj += "\"";
                interestObj += interArr[i];
                interestObj += "\":";
                interestObj += skillArr[i];
                if (i!=(interArr.length-1))
                {
                    interestObj += ","
                }
            }
            interestObj += "}";
            console.log(interestObj);

            var bio = ($("#bioId").find('textarea').val());
            // Put interests
            $.ajax({
                type: 'put',
                url: "https://api.aktve-app.com/me?token=" + APIUserToken + "&interests=" + interestObj + "&bio=" + bio, //Change to actual facebook token
                dataType: 'json',
                context: this, // Make the callaback function's `this` variable point to this User object
                success: function (data) {
                    console.log(data);
                },
                async: false
            });
            
            console.log(bio);
    }

    // TODO: Remove interests from the server and UI when X is clicked
    addInterest() {
        interArr.push($("#activityName").find("option:selected").text());
        skillArr.push($("#activityLevel").find("option:selected").text());

        let newInterest = $("#SettingsInterests").html();
        newInterest += "<div class=\"chip\">\n";
        newInterest += "\t<div class=\"chip-media bg-gray\">" + $("#activityLevel").find("option:selected").text() + "</div>\n";
        newInterest += "\t<div class=\"chip-label\">" + $("#activityName").find("option:selected").text() + "</div>\n";
        newInterest += "</div>\n";
        $("#SettingsInterests").html(newInterest);
    }

    // Helper to logout user
    logoutHelp() {
        fbLogoutUser();
    }
    // Helper to clear user interests
    clearHelp() {
        interArr = [];
        skillArr = [];
        $("#SettingsInterests").html("");
    }

    // Helper to delete user account
    deleteHelp() {
        $.ajax({
            type: 'delete',
            url: "https://api.aktve-app.com/me?token=" + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                fbLogoutUser();
            }
        });
    }

}



// Instantiate a model/controller for the page
let settings_page = new SettingsPage();
        let interArr = [];
        let skillArr = [];
        // Perform necessary steps once the page is loaded.
        myApp.onPageInit('settings', function (page) {
            settings_page.Init();

        });