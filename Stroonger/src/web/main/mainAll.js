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


    $("#menu_home").click(function (e) {
        if(role === "h") {
            $(location).attr('href', 'headhunterHome.html?userId=' + userId + '&token=' + token + '&role=' + role);
        } else if(role === "c") {
            $(location).attr('href', 'candidateHome.html?userId=' + userId + '&token=' + token + '&role=' + role);
        }
    });
    $("#menu_company").click(function (e) {
        $(location).attr('href', 'mainCompany.html?userId=' + userId + '&token=' + token + '&role=' + role);
    });
    $("#menu_position").click(function (e) {
        $(location).attr('href', 'mainPosition.html?userId=' + userId + '&token=' + token + '&role=' + role);
    });
    $("#menu_noti").click(function (e) {
        $(location).attr('href', 'mainNotification.html?userId=' + userId + '&token=' + token + '&role=' + role);
    });
    $("#menu_achievement").click(function (e) {
        $(location).attr('href', 'mainAchievement.html?userId=' + userId + '&token=' + token + '&role=' + role);
    });




});


