$(function() {
    var token = null;
    var adminId = null;
    var adminEmail = null;
    var adminFN = null;
    var adminLN = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        adminId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
    }
    else {
        QueryString = "";
    }


    $("#admin_edit_info").hide();


    jQuery.ajax ({
        url: "/api/admin/" + adminId,
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            adminEmail = data.content.email;
            adminFN = data.content.firstName;
            adminLN = data.content.lastName;
            $("#adminEmailContent").text(adminEmail);
            $("#adminFirstNameContent").text(adminFN);
            $("#adminLastNameContent").text(adminLN);
        })
        .fail(function(data){

        });


    $("#admin_home_edit").click(function (e) {
        $("#admin_edit_info").show();
        $("#admin_home_edit_fn").val(adminFN);
        $("#admin_home_edit_ln").val(adminLN);
    });

    $("#admin_home_edit_submit").click(function (e) {
        var newFN = $("#admin_home_edit_fn").val();
        var newLN = $("#admin_home_edit_ln").val();

        jQuery.ajax ({
            url: "/api/admin/" + adminId,
            type: "PATCH",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            data: JSON.stringify({
                firstName:newFN,
                lastName:newLN
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                window.location.reload();
            })
            .fail(function(data){
                $("#admin_home_edit_error").css("display", "block");
            });
    });

    $("#admin_home_edit_cancel").click(function (e) {
        $("#admin_edit_info").hide();
    });


    $("#admin_home_Logout").click(function (e) {
        $(location).attr('href', '../admin');
    });



});




















