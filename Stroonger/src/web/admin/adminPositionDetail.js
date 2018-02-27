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

    var userId = null;

    var comName = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;


    $("#app_row").hide();

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


    jQuery.ajax ({
        url: "/api/admin/" + adminId + "/position/" + positionId + "/application",
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){

            data.content.forEach(function(item){
                $( "#app_row" ).clone().prop("id",item.id).appendTo( "#table_app" );

                var name = item.userFN + " " + item.userLN;

                userId = item.userId;

                $("#"+item.id).find("#app_name").text(name);

                jQuery.ajax ({
                    url: "/api/admin/" + adminId + "/resume/" + item.resumeId,
                    type: "GET",
                    beforeSend: function(request) {
                        request.setRequestHeader("Authorization", token);
                    },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(data){
                        var link = data.content.fileLink;
                        $("#"+item.id).find("#app_resume").text(link);
                    })
                    .fail(function(data){

                    });


                if(item.isHeadhunter === true) {
                    jQuery.ajax ({
                        url: "/api/admin/" + adminId + "/headhunter/" + item.userId,
                        type: "GET",
                        beforeSend: function(request) {
                            request.setRequestHeader("Authorization", token);
                        },
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(data){
                            var hhName = data.content.firstName + " " + data.content.lastName;
                            $("#"+item.id).find("#app_hh").text(hhName);
                            $("#"+item.id).find("#app_hh").click(function (e) {
                                $(location).attr('href', 'adminHeadhunterDetail.html?adminId=' + adminId + '&token=' + token + '&canId=' + item.userId);
                            });
                        })
                        .fail(function(data){

                        });
                } else {
                    $("#"+item.id).find("#app_hh").text("None");
                }

                $("#"+item.id).find("#app_date").text(item.applyDate);

                if(item.statue === "In Progress") {
                    $("#"+item.id).find("#app_status").hide();
                    $("#"+item.id).find("#app_applied").show();
                    $("#"+item.id).find("#app_failed").show();
                } else {
                    $("#"+item.id).find("#app_status").show();
                    $("#"+item.id).find("#app_applied").hide();
                    $("#"+item.id).find("#app_failed").hide();
                    $("#"+item.id).find("#app_status").text(item.statue);
                }

                $("#"+item.id).prop("class","cloned");
                $("#"+item.id).show();

                $("#"+item.id).find("#app_applied").click(function (e){
                    jQuery.ajax ({
                        url: "/api/admin/" + adminId + "/position/" + positionId + "/application/" + item.id,
                        type: "PATCH",
                        beforeSend: function(request) {
                            request.setRequestHeader("Authorization", token);
                        },
                        dataType: "json",
                        data: JSON.stringify({
                            statue: "Applied"
                        }),
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(data){

                            jQuery.ajax ({
                                url: "/api/admin/" + adminId + "/notification",
                                type: "POST",
                                beforeSend: function(request) {
                                    request.setRequestHeader("Authorization", token);
                                },
                                data: JSON.stringify({
                                    toId: userId,
                                    title: "Your Application Is Applied",
                                    content: "Name: " + name + "&" + "Company: " + comName + "&" + "Position: " + posName
                                }),
                                dataType: "json",
                                contentType: "application/json; charset=utf-8"
                            })
                                .done(function(data) {
                                    window.location.reload();
                                })
                                .fail(function(data){

                                })

                        })
                        .fail(function(data){

                        });
                });


                $("#"+item.id).find("#app_failed").click(function (e){
                    jQuery.ajax ({
                        url: "/api/admin/" + adminId + "/position/" + positionId + "/application/" + item.id,
                        type: "PATCH",
                        beforeSend: function(request) {
                            request.setRequestHeader("Authorization", token);
                        },
                        dataType: "json",
                        data: JSON.stringify({
                            statue: "Failed"
                        }),
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(data){

                            jQuery.ajax ({
                                url: "/api/admin/" + adminId + "/notification",
                                type: "POST",
                                beforeSend: function(request) {
                                    request.setRequestHeader("Authorization", token);
                                },
                                data: JSON.stringify({
                                    toId: userId,
                                    title: "Your Application Is Failed To Apply",
                                    content: "Name: " + name + "&" + "Company: " + comName + "&" + "Position: " + posName
                                }),
                                dataType: "json",
                                contentType: "application/json; charset=utf-8"
                            })
                                .done(function(data) {
                                    window.location.reload();
                                })
                                .fail(function(data){

                                })
                        })
                        .fail(function(data){

                        });
                });

            });

        })
        .fail(function(data){

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




















