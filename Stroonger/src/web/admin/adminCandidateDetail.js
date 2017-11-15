$(function() {
    var token = null;
    var adminId = null;
    var userId = null;

    var email = null;
    var firstName = null;
    var lastName = null;
    var gender = null;
    var age = null;
    var country = null;
    var state = null;
    var city = null;
    var zipCode = null;
    var mobile = null;
    var currentTitle = null;
    var field = null;
    var selfIntroduction = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        adminId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
        userId = tmpArr[2].substring(tmpArr[2].indexOf("=") + 1, tmpArr[2].length);

    } else {
        QueryString = "";
    }

    $(".text_adminContent").show();
    $(".text_edit").hide();
    $("#edit_error").hide();

    jQuery.ajax ({
        url: "/api/admin/" + adminId + "/candidate/" + userId,
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            email = data.content.email;
            firstName = data.content.firstName;
            lastName = data.content.lastName;
            gender = data.content.gender;
            age = data.content.age;
            country = data.content.country;
            state = data.content.state;
            city = data.content.city;
            zipCode = data.content.zipCode;
            mobile = data.content.mobile;
            currentTitle = data.content.currentTitle;
            field = data.content.field;
            selfIntroduction = data.content.selfIntroduction;

            $("#email").text(email);
            $("#fn").text(firstName);
            $("#ln").text(lastName);
            $("#gender").text(gender);
            $("#age").text(age);
            $("#country").text(country);
            $("#state").text(state);
            $("#city").text(city);
            $("#zip").text(zipCode);
            $("#mobile").text(mobile);
            $("#title").text(currentTitle);
            $("#field").text(field);
            $("#intro").text(selfIntroduction);
        })
        .fail(function(data){
            $("#edit_error").show();
        });

    $("#return_button").click(function (e) {
        $(location).attr('href', 'adminCandidate.html?adminId=' + adminId + '&token=' + token);
    });


});



