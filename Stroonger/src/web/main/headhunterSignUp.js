$(function() {
    var token = null;
    var userId = null;
    var role = null;

    $("#headhunterSignupError").hide();


    $("#iamcandidate").click(function (e) {
        $(location).attr('href', 'candidateSignUp.html');
    });

    $("#headhunterSignUp").click(function (e) {

        var inputEmail = $("#inputEmail").val();
        var inputPassword = $("#inputPassword").val();
        var scope = /\w+[@]{1}\w+[.]\w+/;
        var inputConfirmPassword = $("#inputConfirmPassword").val();
        var inputFirstName = $("#inputFirstName").val();
        var inputLastName = $("#inputLastName").val();
        var inputGender = $("#inputGender").val();
        var inputAge = $("#inputAge").val();
        var inputCountry = $("#inputCountry").val();
        var inputState = $("#inputState").val();
        var inputCity = $("#inputCity").val();
        var inputZipcode = $("#inputZipcode").val();
        var inputMobile = $("#inputMobile").val();
        var inputBankAccount = $("#inputBankAccount").val();
        var inputRouteNumber = $("#inputRouteNumber").val();

        var successFlag = 0;

        if(inputEmail === "") {
            alert("!!");
            $("#headhunterEmailError").text("Please enter your email address.");
            $("#headhunterEmailError").css("display", "block");
        } else if(! scope.test(inputEmail)) {
            $("#headhunterEmailError").text("Please enter valid email address.");
            $("#headhunterEmailError").css("display", "block");
        } else {
            $("#headhunterEmailError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputPassword === "") {
            $("#headhunterPasswordError").text("Please enter your password.");
            $("#headhunterPasswordError").css("display", "block");
        } else if(inputPassword.length < 6) {
            $("#headhunterPasswordError").text("The password should be more than 6 characters.");
            $("#headhunterPasswordError").css("display", "block");
        } else {
            $("#headhunterPasswordError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputConfirmPassword === "") {
            $("#headhunterConfrimPasswordError").text("Please confirm your password.");
            $("#headhunterConfrimPasswordError").css("display", "block");
        } else if(inputPassword !== inputConfirmPassword) {
            $("#headhunterConfrimPasswordError").text("Two passwords are different.");
            $("#headhunterConfrimPasswordError").css("display", "block");
        } else {
            $("#headhunterConfrimPasswordError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputFirstName === "") {
            $("#headhunterFirstNameError").css("display", "block");
        } else {
            $("#headhunterFirstNameError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputLastName === "") {
            $("#headhunterLastNameError").css("display", "block");
        } else {
            $("#headhunterLastNameError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputGender === "") {
            $("#headhunterGenderError").css("display", "block");
        } else {
            $("#headhunterGenderError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputAge === "") {
            $("#headhunterAgeError").css("display", "block");
        } else {
            $("#headhunterAgeError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputCountry === "") {
            $("#headhunterCountryError").css("display", "block");
        } else {
            $("#headhunterCountryError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputState === "") {
            $("#headhunterStateError").css("display", "block");
        } else {
            $("#headhunterStateError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputCity === "") {
            $("#headhunterCityError").css("display", "block");
        } else {
            $("#headhunterCityError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputZipcode === "") {
            $("#headhunterZipcodeError").css("display", "block");
        } else {
            $("#headhunterZipcodeError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputMobile === "") {
            $("#headhunterMobileError").css("display", "block");
        } else {
            $("#headhunterMobileError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputBankAccount === "") {
            $("#headhunterBankAccountError").css("display", "block");
        } else {
            $("#headhunterBankAccountError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputRouteNumber === "") {
            $("#headhunterRouteNumberError").css("display", "block");
        } else {
            $("#headhunterRouteNumberError").css("display", "none");
            successFlag = successFlag + 1;
        }


        e.preventDefault();

        if(successFlag >= 14) {
            jQuery.ajax ({
                url: "/api/headhunter",
                type: "POST",
                data: JSON.stringify({
                    "email": inputEmail,
                    "password": inputPassword,
                    "firstName": inputFirstName,
                    "lastName": inputLastName,
                    "gender": inputGender,
                    "age": inputAge,
                    "country": inputCountry,
                    "state": inputState,
                    "city": inputCity,
                    "zipCode": inputZipcode,
                    "mobile": inputMobile,
                    "bankaccount": inputBankAccount,
                    "routenumber": inputRouteNumber,
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){

                    jQuery.ajax ({
                        url: "/api/headhunterSession",
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
                            userId = data.content.userId;
                            $(location).attr('href', 'headhunterHome.html?userId=' + userId + '&token=' + token + '&role=' + "h");
                        })
                        .fail(function(data){
                            $("#headhunterSignupError").show();
                        })

                })
                .fail(function(data){
                    $("#headhunterSignupError").show();
                })
        }

        successFlag = 0;

    });


});


