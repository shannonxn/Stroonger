$(function() {
    var token = null;
    var adminId = null;

    $("#adminSignUp").click(function (e) {


        var inputEmail = $("#adminInputEmail").val();
        var inputPassword = $("#adminInputPassword").val();
        var scope = /\w+[@]{1}\w+[.]\w+/;
        var inputCPassword = $("#adminInputConfrimPassword").val();
        var inputFName = $("#adminInputFirstName").val();
        var inputLName = $("#adminInputLastName").val();

        var successFlag = 0;

        if(inputEmail === "") {
            $("#adminEmailError").text("Please input your email address.");
            $("#adminEmailError").css("display", "block");
        } else if(! scope.test(inputEmail)) {
            $("#adminEmailError").text("Please input the right email address.");
            $("#adminEmailError").css("display", "block");
        } else {
            $("#adminEmailError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputPassword === "") {
            $("#adminPasswordError").text("Please input your password.");
            $("#adminPasswordError").css("display", "block");
        } else if(inputPassword.length < 6) {
            $("#adminPasswordError").text("The password should be more than 6 characters.");
            $("#adminPasswordError").css("display", "block");
        } else {
            $("#adminPasswordError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputCPassword === "") {
            $("#adminConfrimPasswordError").text("Please confirm your password.");
            $("#adminConfrimPasswordError").css("display", "block");
        } else if(inputPassword !== inputCPassword) {
            $("#adminConfrimPasswordError").text("Two passwords are different.");
            $("#adminConfrimPasswordError").css("display", "block");
        } else {
            $("#adminConfrimPasswordError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputFName === "") {
            $("#adminFirstNameError").css("display", "block");
        } else {
            $("#adminFirstNameError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputLName === "") {
            $("#adminLastNameError").css("display", "block");
        } else {
            $("#adminLastNameError").css("display", "none");
            successFlag = successFlag + 1;
        }

        e.preventDefault();

        if(successFlag >= 5) {
            jQuery.ajax ({
                url: "/api/admin",
                type: "POST",
                data: JSON.stringify({
                    "email": inputEmail,
                    "password": inputPassword,
                    "firstName": inputFName,
                    "lastName": inputLName
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){

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
                            alert("Sign In Fail");
                        })

                })
                .fail(function(data){
                    alert("Sign Up Fail");
                    $("#adminSignupError").css("display", "block");
                })
        }

        successFlag = 0;

    });


});


