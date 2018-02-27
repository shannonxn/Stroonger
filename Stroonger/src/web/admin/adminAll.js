$(function() {
    var token = null;
    var adminId = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        adminId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
    } else {
        QueryString = "";
    }


    $("#menu_home").click(function (e) {
        $(location).attr('href', 'adminHome.html?adminId=' + adminId + '&token=' + token);
    });
    $("#menu_company").click(function (e) {
        $(location).attr('href', 'adminCompany.html?adminId=' + adminId + '&token=' + token);
    });
    $("#menu_position").click(function (e) {
        $(location).attr('href', 'adminPosition.html?adminId=' + adminId + '&token=' + token);
    });
    $("#menu_candidate").click(function (e) {
        $(location).attr('href', 'adminCandidate.html?adminId=' + adminId + '&token=' + token);
    });
    $("#menu_headhunter").click(function (e) {
        $(location).attr('href', 'adminHeadhunter.html?adminId=' + adminId + '&token=' + token);
    });
    $("#menu_noti").click(function (e) {
        $(location).attr('href', 'adminNotification.html?adminId=' + adminId + '&token=' + token);
    });
    $("#menu_achievement").click(function (e) {
        $(location).attr('href', 'adminAchievement.html?adminId=' + adminId + '&token=' + token);
    });




});


