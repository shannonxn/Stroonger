$(function() {
    var token = null;
    var userId = null;

    var role = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        userId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
        role = tmpArr[2].substring(tmpArr[2].indexOf("=") + 1, tmpArr[2].length);
    } else {
        QueryString = "";
    }


    $("#ach_row").hide();

    jQuery.ajax({
        url: "/api/achievement",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function (data) {
            data.content.forEach(function (item) {
                $("#ach_row").clone().prop("id", item.id).appendTo("#table_achievement");
                $("#" + item.id).find("#ach_editor").text(item.editor);
                $("#" + item.id).find("#ach_date").text(item.date);
                $("#" + item.id).find("#ach_company").text(item.company);
                $("#" + item.id).find("#ach_content").text(item.content);
                $("#" + item.id).prop("class", "cloned");
                $("#" + item.id).show();
            });
        })
        .fail(function (data) {
        });
});




