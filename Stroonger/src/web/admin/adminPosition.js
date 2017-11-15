$(function() {
    var token = null;
    var adminId = null;
    var comName = null;

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

    $("#pos_row").hide();

    $("#admin_pos_add_error").css("display", "none");
    $("#admin_pos_all_error").css("display", "none");

    jQuery.ajax ({
        url: "/api/position",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            $("#admin_pos_all_error").css("display", "none");
            data.content.forEach(function(item){
                $("#pos_row").clone().prop("id",item.id).appendTo("#table_position");
                $("#"+item.id).find("#pos_name").text(item.name);

                jQuery.ajax ({
                    url: "/api/company/" + item.companyId,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(data1){
                        comName = data1.content.name;
                        $("#"+item.id).find("#pos_com").text(comName);
                    })
                    .fail(function(data1){
                        $("#admin_pos_all_error").text("Fail to load positions.");
                        $("#admin_pos_all_error").css("display", "block");
                    });

                $("#"+item.id).find("#pos_location").text(item.location);
                $("#"+item.id).find("#pos_date").text(item.date);
                $("#"+item.id).prop("class","cloned");
                $("#"+item.id).show();
                $("#"+item.id).find("#admin_pos_btn_detail").click(function (e) {
                    $(location).attr('href', 'adminPositionDetail.html?adminId=' + adminId + '&token=' + token + '&positionId=' + item.id);
                });

                $("#"+item.id).find("#admin_pos_btn_delete").click(function (e) {

                    jQuery.ajax ({
                        url: "/api/admin/" + adminId + "/company/" + item.companyId + "/position/" + item.id,
                        type: "DELETE",
                        beforeSend: function(request) {
                            request.setRequestHeader("Authorization", token);
                        },
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(data){
                            alert("Delete a Position Successfully!");
                            window.location.reload();
                        })
                        .fail(function(data){
                            $("#admin_pos_all_error").text("Fail to delete.");
                            $("#admin_pos_all_error").css("display", "block");
                        });
                });

            });
        })
        .fail(function(data){
            $("#admin_pos_all_error").text("Fail to load positions.");
            $("#admin_pos_all_error").css("display", "block");
        });



});




















