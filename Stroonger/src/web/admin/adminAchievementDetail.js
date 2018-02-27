$(function() {
    var token = null;
    var adminId = null;

    var achId = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        adminId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
        achId = tmpArr[2].substring(tmpArr[2].indexOf("=") + 1, tmpArr[2].length);
    } else {
        QueryString = "";
    }

    jQuery.ajax({
        url: "/api/admin/" + adminId + "/achievement/" + achId,
        type: "GET",
        dataType: "json",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        contentType: "application/json; charset=utf-8"
    })
        .done(function (data) {
            $("#achi_editor").text("Author: " + data.content.editor);
            $("#achi_date").text("Date: " + data.content.date);
            $("#achi_company").text("Company: " + data.content.company);
            $("#achi_content").text("Content: " + data.content.content);
        })
        .fail(function (data) {
        });
});


