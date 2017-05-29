// Settings page
class SettingsPage {
    constructor() {
        
    }


    Init() {
        $("#settingsback").click(settings_page.storeSettings);
        $("#addInterest").click(settings_page.addInterest);
        // TODO: Get values from server and update UI accordingly
        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/me/settings?token=' + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            context: this, // Make the callaback function's `this` variable point to this User object
            success: function (data) {
                console.log(data.Success.success);
                console.log(data.Success.error);
                console.log(data.Data.sharelocation);
                console.log(data.Data.friendmen);
                console.log(data.Data.friendwomen);
                if(data.Data.sharelocation)
                {
                    $("#locationsharing").prop('checked',true)
                }
                if (data.Data.friendwomen)
                {
                    $("#menbox").prop('checked', true)
                }
                if (data.Data.friendmen)
                {
                    $("#womenbox").prop('checked', true)
                }
                if (data.Data.datemen) {
                    $("#mendatebox").prop('checked', true)
                }
                if (data.Data.datewomen) {
                    $("#womendatebox").prop('checked', true)
                }
            }
        });

        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/me?token=' + APIUserToken, //Change to actual facebook token
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

            }
        });
    } 

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
                }
            });

            var interestObj = new Object();
            for (var i = 0; i < interArr.length; i++) {
                interestObj[interArr[i]] = skillArr[i];
            }
            console.log(interestObj);

            if(interArr.length!=0){
            $.ajax({
                type: 'put',
                url: "https://api.aktve-app.com/me?token=" + APIUserToken, //Change to actual facebook token
                dataType: 'json',
                data: { 'interests': interestObj },
                context: this, // Make the callaback function's `this` variable point to this User object
                success: function (data) {
                    console.log(data.Success.success);
                    console.log(data.Success.error);
                }
            });   
        }
    }

    addInterest() {
        // TODO: PUSH INTERESTS UP TO SERVER
        interArr.push($("#activityName").find("option:selected").text());
        skillArr.push($("#activityLevel").find("option:selected").text());

        let newInterest = $("#SettingsInterests").html();
        newInterest += "<div class=\"chip\">\n";
        newInterest += "\t<div class=\"chip-media bg-gray\">" + $("#activityLevel").find("option:selected").text() + "</div>\n";
        newInterest += "\t<div class=\"chip-label\">" + $("#activityName").find("option:selected").text() + "</div>\n";
        newInterest += "</div>\n";
        $("#SettingsInterests").html(newInterest);
    }
}

// Instantiate a model/controller for the page
let settings_page = new SettingsPage();
let interArr = [];
let skillArr = [];
// Perform necessary steps once the page is loaded.
myApp.onPageInit('settings', function (page) {
    console.log("we here");
    settings_page.Init();

});