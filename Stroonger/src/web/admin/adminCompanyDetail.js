$(function() {
    var token = null;
    var adminId = null;
    var comName = null;
    var comField = null;
    var comLocation = null;
    var comDes = null;
    var offset = 0;
    var count = 20;
    var total = -1;
    var sortValue = "";

    var companyId = null;

    var posFlag = 0;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        adminId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
        companyId = tmpArr[2].substring(tmpArr[2].indexOf("=") + 1, tmpArr[2].length);
        if(tmpArr.length >= 4) {
            posFlag = 1; // go to position page
        }
    } else {
        QueryString = "";
    }

    $("#pos_row").hide();

    $("#admin_pos_add_error").css("display", "none");
    $("#admin_pos_all_error").css("display", "none");
    $("#admin_company_edit_error").css("display", "none");

    if(posFlag === 1) {
        $("#admin_company_detail_div_des").css("display", "none");
        $("#admin_company_edit_info").css("display", "none");
        $("#admin_company_detail_div_pos").css("display", "block");
        $("#admin_company_detail_add_pos_orm").css("display", "none");

        jQuery.ajax ({
            url: "/api/company/" + companyId + "/position",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                $("#admin_pos_all_error").css("display", "none");
                data.content.forEach(function(item){
                    $("#pos_row").clone().prop("id",item.id).appendTo("#table_position");
                    $("#"+item.id).find("#pos_name").text(item.name);
                    $("#"+item.id).find("#pos_location").text(item.location);
                    $("#"+item.id).find("#pos_date").text(item.date);
                    $("#"+item.id).prop("class","cloned");
                    $("#"+item.id).show();
                    $("#"+item.id).find("#admin_pos_btn_detail").click(function (e) {
                        $(location).attr('href', 'adminPositionDetail.html?adminId=' + adminId + '&token=' + token + '&positionId=' + item.id);
                    });

                    $("#"+item.id).find("#admin_pos_btn_delete").click(function (e) {

                        jQuery.ajax ({
                            url: "/api/admin/" + adminId + "/company/" + companyId + "/position/" + item.id,
                            type: "DELETE",
                            beforeSend: function(request) {
                                request.setRequestHeader("Authorization", token);
                            },
                            dataType: "json",
                            contentType: "application/json; charset=utf-8"
                        })
                            .done(function(data){
                                alert("Delete a Company Successfully!");
                                $(location).attr('href', 'adminCompanyDetail.html?adminId=' + adminId + '&token=' + token + '&companyId=' + companyId + "&flag=1");
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

    }

    else {
        $("#admin_company_detail_div_des").css("display", "block");
        $("#admin_company_edit_info").css("display", "none");
        $("#admin_company_detail_div_pos").css("display", "none");
        $("#admin_company_detail_add_pos_orm").css("display", "none");

        jQuery.ajax ({
            url: "/api/company/" + companyId,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                comName = data.content.name;
                comField = data.content.field;
                comLocation = data.content.location;
                comDes = data.content.description;
                $("#admin_company_detail_name").text(comName);
                $("#admin_company_detail_field").text(comField);
                $("#admin_company_detail_location").text(comLocation);
                $("#admin_company_detail_des").text(comDes);
            })
            .fail(function(data){
                $("#admin_company_detail_des").text("Fail to load details.");
                $("#admin_company_detail_des").css("display", "block");
            });
    }

    $("#admin_company_detail_des_btn").click(function (e) {
        $("#admin_company_detail_div_des").css("display", "block");
        $("#admin_company_edit_info").css("display", "none");
        $("#admin_company_detail_div_pos").css("display", "none");
        $("#admin_company_detail_add_pos_orm").css("display", "none");
    });
    $("#admin_company_detail_des_edit").click(function (e) {
        $("#admin_company_detail_div_des").css("display", "block");
        $("#admin_company_edit_info").css("display", "block");
        $("#admin_company_detail_div_pos").css("display", "none");
        $("#admin_company_detail_add_pos_orm").css("display", "none");

        $("#admin_company_edit_name").val(comName);
        $("#admin_company_edit_field").val(comField);
        $("#admin_company_edit_location").val(comLocation);
        $("#admin_company_edit_des").val(comDes);
    });

    $("#admin_com_edit_submit").click(function (e) {
        var newName = $("#admin_company_edit_name").val();
        var newField = $("#admin_company_edit_field").val();
        var newLocation = $("#admin_company_edit_location").val();
        var newDes = $("#admin_company_edit_des").val();

        jQuery.ajax ({
            url: "/api/admin/" + adminId + "/company/" + companyId,
            type: "PATCH",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            data: JSON.stringify({
                name:newName,
                description:newDes,
                field:newField,
                location:newLocation
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                window.location.reload();
                $("#admin_company_edit_error").css("display", "none");
            })
            .fail(function(data){
                $("#admin_company_edit_error").css("display", "block");
            });
    });

    $("#admin_com_edit_cancel").click(function (e) {
        $("#admin_company_detail_div_des").css("display", "block");
        $("#admin_company_edit_info").css("display", "none");
        $("#admin_company_detail_div_pos").css("display", "none");
        $("#admin_company_detail_add_pos_orm").css("display", "none");
    });



    $("#admin_company_detail_pos").click(function (e) {
        $("#admin_pos_add_error").css("display", "none");
        $("#admin_pos_all_error").css("display", "none");
        $("#admin_company_edit_error").css("display", "none");

        $("#admin_company_detail_div_des").css("display", "none");
        $("#admin_company_edit_info").css("display", "none");
        $("#admin_company_detail_div_pos").css("display", "block");
        $("#admin_company_detail_add_pos_orm").css("display", "none");

        var newName = $("#admin_company_edit_name").val();
        var newField = $("#admin_company_edit_field").val();
        var newLocation = $("#admin_company_edit_location").val();
        var newDes = $("#admin_company_edit_des").val();

        jQuery.ajax ({
            url: "/api/company/" + companyId + "/position",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                $("#admin_pos_all_error").css("display", "none");
                data.content.forEach(function(item){
                    $("#pos_row").clone().prop("id",item.id).appendTo("#table_position");
                    $("#"+item.id).find("#pos_name").text(item.name);
                    $("#"+item.id).find("#pos_location").text(item.location);
                    $("#"+item.id).find("#pos_date").text(item.date);
                    $("#"+item.id).prop("class","cloned");
                    $("#"+item.id).show();
                    $("#"+item.id).find("#admin_pos_btn_detail").click(function (e) {
                        $(location).attr('href', 'adminPositionDetail.html?adminId=' + adminId + '&token=' + token + '&positionId=' + item.id);
                    });

                    $("#"+item.id).find("#admin_pos_btn_delete").click(function (e) {

                        jQuery.ajax ({
                            url: "/api/admin/" + adminId + "/company/" + companyId + "/position/" + item.id,
                            type: "DELETE",
                            beforeSend: function(request) {
                                request.setRequestHeader("Authorization", token);
                            },
                            dataType: "json",
                            contentType: "application/json; charset=utf-8"
                        })
                            .done(function(data){
                                alert("Delete a Company Successfully!");
                                $(location).attr('href', 'adminCompanyDetail.html?adminId=' + adminId + '&token=' + token + '&companyId=' + companyId + "&flag=1");
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

    $("#admin_company_detail_add").click(function (e) {

        $("#admin_company_detail_div_des").css("display", "none");
        $("#admin_company_edit_info").css("display", "none");
        $("#admin_company_detail_div_pos").css("display", "block");
        $("#admin_company_detail_add_pos_orm").css("display", "block");

        var newName = $("#admin_company_edit_name").val();
        var newField = $("#admin_company_edit_field").val();
        var newLocation = $("#admin_company_edit_location").val();
        var newDes = $("#admin_company_edit_des").val();

        jQuery.ajax ({
            url: "/api/company/" + companyId + "/position",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                $("#admin_pos_all_error").css("display", "none");
                data.content.forEach(function(item){
                    $("#pos_row").clone().prop("id",item.id).appendTo("#table_position");
                    $("#"+item.id).find("#pos_name").text(item.name);
                    $("#"+item.id).find("#pos_location").text(item.location);
                    $("#"+item.id).find("#pos_date").text(item.date);
                    $("#"+item.id).prop("class","cloned");
                    $("#"+item.id).show();
                    $("#"+item.id).find("#admin_pos_btn_detail").click(function (e) {
                        $(location).attr('href', 'adminPositionDetail.html?adminId=' + adminId + '&token=' + token + '&positionId=' + item.id);
                    });
                    $("#"+item.id).find("#admin_pos_btn_delete").click(function (e) {

                        jQuery.ajax ({
                            url: "/api/admin/" + adminId + "/company/" + companyId + "/position/" + item.id,
                            type: "DELETE",
                            beforeSend: function(request) {
                                request.setRequestHeader("Authorization", token);
                            },
                            dataType: "json",
                            contentType: "application/json; charset=utf-8"
                        })
                            .done(function(data){
                                alert("Delete a Company Successfully!");
                                $(location).attr('href', 'adminCompanyDetail.html?adminId=' + adminId + '&token=' + token + '&companyId=' + companyId + "&flag=1");
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

    $("#admin_com_pos_add_create").click(function (e) {
        var pos_name = $("#companyInputPosName").val();
        var pos_tyoe = $("#companyInputPosType").val();
        var pos_description = $("#companyInputPosDescription").val();
        var pos_location = $("#companyInputPosLocation").val();
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth()+1;
        var date = myDate.getDate();
        var pos_date = month + "/" + date + "/" + year;

        var errorFlag = 0;

        if(pos_name === "") {
            $("#posNameError").css("display", "block");
        } else {
            $("#posNameError").css("display", "none");
            errorFlag = errorFlag + 1;
        }

        if(pos_tyoe === "") {
            $("#posFieldError").css("display", "block");
        } else {
            $("#posFieldError").css("display", "none");
            errorFlag = errorFlag + 1;
        }

        if(pos_description === "") {
            $("#posDescriptionError").css("display", "block");
        } else {
            $("#posDescriptionError").css("display", "none");
            errorFlag = errorFlag + 1;
        }

        if(pos_location === "") {
            $("#posLocationError").css("display", "block");
        } else {
            $("#posLocationError").css("display", "none");
            errorFlag = errorFlag + 1;
        }

        if(errorFlag >= 4) {
            jQuery.ajax ({
                url: "/api/admin/" + adminId + "/company/" + companyId + "/position",
                type: "POST",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                data: JSON.stringify({
                    name:pos_name,
                    type:pos_tyoe,
                    description:pos_description,
                    location:pos_location,
                    date:pos_date
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    $("#admin_pos_add_error").css("display", "none");
                    alert("Add a Position Successfully!");
                    $(location).attr('href', 'adminCompanyDetail.html?adminId=' + adminId + '&token=' + token + '&companyId=' + companyId + "&flag=1");
                })
                .fail(function(data){
                    $("#admin_pos_add_error").css("display", "block");
                })
        }
    });

    $("#admin_com_pos_add_cancel").click(function (e) {
        $("#companyInputPosName").val("");
        $("#companyInputPosType").val("");
        $("#companyInputPosDescription").val("");
        $("#companyInputPosLocation").val("");

        $("#posNameError").css("display", "none");
        $("#posFieldError").css("display", "none");
        $("#posDescriptionError").css("display", "none");
        $("#posLocationError").css("display", "none");

        $("#admin_company_detail_div_des").css("display", "none");
        $("#admin_company_edit_info").css("display", "none");
        $("#admin_company_detail_div_pos").css("display", "block");
        $("#admin_company_detail_add_pos_orm").css("display", "none");

    });


});




















