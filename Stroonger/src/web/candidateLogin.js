var token = null;
var userId = null;
var role = null;

$(function() {


    $("#signup").click(function (e) {
        $(location).attr('href', 'main/candidateSignUp.html');
    });

    $("#iamcandidate").click(function (e) {
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
                role = "c";
                $(location).attr('href', 'main/candidateHome.html?userId=' + userId + '&token=' + token + '&role=' + role);
            })
            .fail(function(data){
                $("#adminSigninError").css("display", "block");
            })
    });

    $("#iamheadhunter").click(function (e) {
        e.preventDefault();

        jQuery.ajax ({
            url: "/api/headhunterSession",
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
                role = "h";
                $(location).attr('href', 'main/headhunterHome.html?userId=' + userId + '&token=' + token + '&role=' + role);
            })
            .fail(function(data){
                $("#adminSigninError").css("display", "block");
            })
    });

    // $("input:checkbox").on('click', function() {
    //
    //     var $box = $(this);
    //     if ($box.is(":checked")) {
    //
    //         var group = "input:checkbox[name='" + $box.attr("name") + "']";
    //
    //         $(group).prop("checked", false);
    //         $box.prop("checked", true);
    //     } else {
    //         $box.prop("checked", false);
    //     }
    // });


});



