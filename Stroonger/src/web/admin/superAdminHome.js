$(function() {
    var token = null;
    var adminId = null;
    var email = null;
    var fn = null;
    var ln = null;

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

    $("#admin_row").hide();


    jQuery.ajax ({
        url: "/api/admin",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            data.content.forEach(function(item){
                $("#admin_row").clone().prop("id",item.id).appendTo("#table_admin");
                $("#"+item.id).find("#admin_email").text(item.email);
                $("#"+item.id).find("#admin_fn").text(item.firstName);
                $("#"+item.id).find("#admin_ln").text(item.lastName);
                $("#"+item.id).prop("class","cloned");
                $("#"+item.id).show();

                $("#"+item.id).find("#admin_btn_delete").click(function (e) {

                    jQuery.ajax ({
                        url: "/api/admin/" + item.id,
                        type: "DELETE",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(data){
                            alert("Delete the admin successfully.");
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




















