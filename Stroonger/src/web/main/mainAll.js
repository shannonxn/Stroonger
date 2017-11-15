$(function() {
    var token = null;
    var userId = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        userId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
    } else {
        QueryString = "";
    }


    $("#menu_account").click(function (e) {
        $(location).attr('href', 'candidateHome.html?userId=' + userId + '&token=' + token);
    });
    $("#menu_company").click(function (e) {
        $(location).attr('href', 'mainCompany.html?userId=' + userId + '&token=' + token);
    });
    $("#menu_position").click(function (e) {
        $(location).attr('href', 'mainPosition.html?userId=' + userId + '&token=' + token);
    });




});


