$(function() {
    var token = null;
    var adminId = null;

    $("#adminSignIn").click(function (e) {

        var inputEmail = $("#adminInputEmail").val();
        var inputPassword = $("#adminInputPassword").val();
        var scope = /\w+[@]{1}\w+[.]\w+/;

        if(inputEmail === "") {
            $("#adminEmailError").text("Please input your email address.");
            $("#adminEmailError").css("display", "block");
        } else if(! scope.test(inputEmail)) {
            $("#adminEmailError").text("Please input the right email address.");
            $("#adminEmailError").css("display", "block");
        } else {
            $("#adminEmailError").css("display", "none");
        }

        if(inputPassword === "") {
            $("#adminPasswordError").text("Please input your password.");
            $("#adminPasswordError").css("display", "block");
        } else {
            $("#adminPasswordError").css("display", "none");
        }

        e.preventDefault();

        if(inputEmail !== "stroonger@gmail.com") {
            jQuery.ajax ({
                url: "/api/adminSession",
                type: "POST",
                data: JSON.stringify({
                    email:inputEmail,
                    password:inputPassword
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    token = data.content.token;
                    adminId = data.content.adminId;
                    $(location).attr('href', 'adminHome.html?adminId=' + adminId + '&token=' + token);
                })
                .fail(function(data){
                    $("#adminSigninError").css("display", "block");
                })

        } else {
            jQuery.ajax ({
                url: "/api/adminSession",
                type: "POST",
                data: JSON.stringify({
                    email:inputEmail,
                    password:inputPassword
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    token = data.content.token;
                    adminId = data.content.adminId;
                    $(location).attr('href', 'superAdminHome.html?adminId=' + adminId + '&token=' + token);
                })
                .fail(function(data){
                    $("#adminSigninError").css("display", "block");
                })
        }


    });

    $("#adminSignUp").click(function (e) {
        $(location).attr('href', 'adminSignup.html');
    });

});


