$(function() {
    var token = null;
    var adminId = null;
    var posName = null;
    var posType = null;
    var posLocation = null;
    var posDes = null;
    var posDate = null;

    var positionId = null;
    var comId = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        adminId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
        positionId = tmpArr[2].substring(tmpArr[2].indexOf("=") + 1, tmpArr[2].length);
    } else {
        QueryString = "";
    }

    jQuery.ajax ({
        url: "/api/position/" + positionId,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            posName = data.content.name;
            posType = data.content.type;
            posLocation = data.content.location;
            posDes = data.content.description;
            posDate = data.content.date;
            comId = data.content.companyId;
            $("#admin_pos_detail_name").text(posName);
            $("#admin_pos_detail_field").text(posType);
            $("#admin_pos_detail_location").text(posLocation);
            $("#admin_pos_detail_des").text(posDes);
            $("#admin_pos_detail_date").text(posDate);

            var comName = null;

            jQuery.ajax ({
                url: "/api/company/" + comId,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data1){
                    comName = data1.content.name;
                    $("#admin_pos_detail_com").text(comName);
                })
                .fail(function(data1){
                    $("#admin_company_detail_des").text("Fail to load details.");
                    $("#admin_company_detail_des").css("display", "block");
                });

        })
        .fail(function(data){
            $("#admin_company_detail_des").text("Fail to load details.");
            $("#admin_company_detail_des").css("display", "block");
        });


    $("#admin_pos_btn_edit").click(function (e) {
        $("#admin_company_edit_info").css("display", "block");
        $("#admin_company_edit_error").css("display", "none");
        $("#admin_pos_edit_name").val(posName);
        $("#admin_pos_edit_field").val(posType);
        $("#admin_pos_edit_location").val(posLocation);
        $("#admin_pos_edit_date").val(posDate);
        $("#admin_pos_edit_des").val(posDes);
    });

    $("#admin_com_edit_submit").click(function (e) {
        $("#admin_company_edit_error").css("display", "none");
        var newname = $("#admin_pos_edit_name").val();
        var newtype = $("#admin_pos_edit_field").val();
        var newlocation = $("#admin_pos_edit_location").val();
        var newdate = $("#admin_pos_edit_date").val();
        var newdes = $("#admin_pos_edit_des").val();

        jQuery.ajax ({
            url: "/api/admin/" + adminId + "/company/" + comId + "/position/" + positionId,
            type: "PATCH",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            data: JSON.stringify({
                name:newname,
                type:newtype,
                location:newlocation,
                date:newdate,
                description:newdes
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                window.location.reload();
            })
            .fail(function(data){
                $("#admin_company_edit_error").css("display", "block");
            });
    });

    $("#admin_com_edit_cancel").click(function (e) {
        $("#admin_company_edit_info").css("display", "none");
    });


});




















