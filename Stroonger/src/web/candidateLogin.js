var token = null;
var userId = null;

$(function() {

    $("#signin").click(function (e) {
        e.preventDefault();

        jQuery.ajax ({
            url: "/api/candidateSession",
            type: "POST",
            data: JSON.stringify({
                email:$("#inputEmail").val(),
                password:$("#inputPassword").val()
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                token = data.content.token;
                userId = data.content.userId;
                $(location).attr('href', 'main/candidateHome.html?userId=' + userId + '&token=' + token);
            })
            .fail(function(data){
                $("#adminSigninError").css("display", "block");
            })
    });

    $("#signup").click(function (e) {
        $(location).attr('href', 'main/candidateSignUp.html');
    });


});



