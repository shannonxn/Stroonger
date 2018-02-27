$(function() {
    var token = null;
    var adminId = null;
    var canId = null;
    var offset = 0;
    var count = 20;
    var total = -1;
    var sortValue = "";

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

    $("#noti_new").hide();
    $("#noti_row").hide();

    jQuery.ajax ({
        url: "/api/admin/" + adminId + "/notification",
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            data.content.forEach(function(item){
                $("#noti_row").clone().prop("id",item.id).appendTo("#table_noti");
                $("#"+item.id).find("#noti_title").text(item.title);
                $("#"+item.id).find("#noti_date").text(item.date);

                var contentArr = item.content.split("&");

                var name = contentArr[0];
                var com = contentArr[1];
                var pos = contentArr[2];

                $("#"+item.id).find("#noti_name").text(name);
                $("#"+item.id).find("#noti_com").text(com);
                $("#"+item.id).find("#noti_pos").text(pos);
                $("#"+item.id).prop("class","cloned");

                if(item.hasRead === true) {
                    $("#"+item.id).find("#noti_new").hide();
                } else {
                    $("#"+item.id).find("#noti_new").show();
                }

                $("#"+item.id).show();

                $("#"+item.id).find("#noti").click(function (e) {

                    jQuery.ajax ({
                        url: "/api/admin/" + adminId + "/notification/" + item.id,
                        type: "PATCH",
                        beforeSend: function(request) {
                            request.setRequestHeader("Authorization", token);
                        },
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(data){
                            window.location.reload();
                        })
                        .fail(function(data){

                        });

                });

            });
        })
        .fail(function(data){

        });


});




















