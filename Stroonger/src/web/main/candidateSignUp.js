$(function() {

    var token = null;
    var userId = null;


    $("#sign_up_submit").click(function (e) {
        $(location).attr('href', 'candidateHome.html?userId=' + userId + '&token=' + token);
    });
});