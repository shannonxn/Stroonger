$(function() {
    var token = null;
    var userId = null;

    $("#candidateSignupError").hide();

    $("#candidateSignUp").click(function (e) {

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
        var inputCurrentTitle = $("#inputCurrentTitle").val();
        var inputField = $("#inputField").val();
        var inputSelfIntroduction = $("#inputSelfIntroduction").val();

        var successFlag = 0;

        if(inputEmail === "") {
            alert("!!");
            $("#candidateEmailError").text("Please enter your email address.");
            $("#candidateEmailError").css("display", "block");
        } else if(! scope.test(inputEmail)) {
            $("#candidateEmailError").text("Please enter valid email address.");
            $("#candidateEmailError").css("display", "block");
        } else {
            $("#candidateEmailError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputPassword === "") {
            $("#candidatePasswordError").text("Please enter your password.");
            $("#candidatePasswordError").css("display", "block");
        } else if(inputPassword.length < 6) {
            $("#candidatePasswordError").text("The password should be more than 6 characters.");
            $("#candidatePasswordError").css("display", "block");
        } else {
            $("#candidatePasswordError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputConfirmPassword === "") {
            $("#candidateConfrimPasswordError").text("Please confirm your password.");
            $("#candidateConfrimPasswordError").css("display", "block");
        } else if(inputPassword !== inputConfirmPassword) {
            $("#candidateConfrimPasswordError").text("Two passwords are different.");
            $("#candidateConfrimPasswordError").css("display", "block");
        } else {
            $("#candidateConfrimPasswordError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputFirstName === "") {
            $("#candidateFirstNameError").css("display", "block");
        } else {
            $("#candidateFirstNameError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputLastName === "") {
            $("#candidateLastNameError").css("display", "block");
        } else {
            $("#candidateLastNameError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputGender === "") {
            $("#candidateGenderError").css("display", "block");
        } else {
            $("#candidateGenderError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputAge === "") {
            $("#candidateAgeError").css("display", "block");
        } else {
            $("#candidateAgeError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputCountry === "") {
            $("#candidateCountryError").css("display", "block");
        } else {
            $("#candidateCountryError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputState === "") {
            $("#candidateStateError").css("display", "block");
        } else {
            $("#candidateStateError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputCity === "") {
            $("#candidateCityError").css("display", "block");
        } else {
            $("#candidateCityError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputZipcode === "") {
            $("#candidateZipcodeError").css("display", "block");
        } else {
            $("#candidateZipcodeError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputMobile === "") {
            $("#candidateMobileError").css("display", "block");
        } else {
            $("#candidateMobileError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputCurrentTitle === "") {
            $("#candidateCurrentTitleError").css("display", "block");
        } else {
            $("#candidateCurrentTitleError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputField === "") {
            $("#candidateFieldError").css("display", "block");
        } else {
            $("#candidateFieldError").css("display", "none");
            successFlag = successFlag + 1;
        }

        if(inputSelfIntroduction === "") {
            $("#candidateSelfIntroduction").css("display", "block");
        } else {
            $("#candidateSelfIntroduction").css("display", "none");
            successFlag = successFlag + 1;
        }

        e.preventDefault();

        if(successFlag >= 15) {
            jQuery.ajax ({
                url: "/api/candidate",
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
                    "currentTitle": inputCurrentTitle,
                    "field": inputField,
                    "selfIntroduction": inputSelfIntroduction
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){

                    jQuery.ajax ({
                        url: "/api/candidateSession",
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
                            $(location).attr('href', 'candidateHome.html?userId=' + userId + '&token=' + token);
                        })
                        .fail(function(data){
                            $("#candidateSignupError").show();
                        })

                })
                .fail(function(data){
                    $("#candidateSignupError").show();
                })
        }

        successFlag = 0;

    });


});


