$(function() {
    var token = null;
    var adminId = null;
    var comName = null;
    var offset = 0;
    var count = 20;
    var total = -1;
    var sortValue = "";

    var role = null;

    var searchVal = "";

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        adminId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
        role = tmpArr[2].substring(tmpArr[2].indexOf("=") + 1, tmpArr[2].length);
    } else {
        QueryString = "";
    }

    $("#pos_row").hide();

    loadCandidate();

    $("#sort_default").click(function (e) {
        e.preventDefault();
        sortValue = "";
        loadCandidate();
    });

    $("#sortByDate").click(function (e) {
        e.preventDefault();
        sortValue = "name";
        loadCandidate();
    });

    $("#sortBYName").click(function (e) {
        e.preventDefault();
        sortValue = "publishDate";
        loadCandidate();
    });

    $("#next").click(function(e){
        e.preventDefault();
        if (offset + count < total) {
            offset = offset + count;
            loadCandidate();
        }
    });

    $("#previous").click(function(e){
        e.preventDefault();
        console.log("Cliked");
        if (offset - count >= 0) {
            offset = offset - count;
            loadCandidate();
        }
    });

    $("#search_btn").click(function(e){
        searchVal = $("#searchCom").val();
        jQuery.ajax ({
            url: "/api/position?name=" + searchVal + "&offset=" + offset + "&count=" + count,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                total = data.metadata.total;
                $("#page").text("Page " + Math.floor(offset/count+1) + " of " + (Math.ceil(total/count)));
                $("#table_position").find(".cloned").remove();
                $("#admin_pos_all_error").css("display", "none");

                data.content.forEach(function(item){
                    $("#pos_row").clone().prop("id",item.id).appendTo("#table_position");
                    $("#"+item.id).find("#pos_name").text(item.name);
                    $("#"+item.id).find("#pos_location").text(item.location);
                    $("#"+item.id).find("#pos_date").text(item.date);
                    $("#"+item.id).prop("class","cloned");
                    $("#"+item.id).show();
                    $("#"+item.id).find("#admin_pos_btn_detail").click(function (e) {
                        $(location).attr('href', 'mainPositionDetail.html?adminId=' + adminId + '&token=' + token + '&role=' + role + '&positionId=' + item.id);
                    });

                });
            })
            .fail(function(data){
                $("#admin_pos_all_error").text("Fail to load positions.");
                $("#admin_pos_all_error").css("display", "block");
            });

    });


    function loadCandidate() {

        if(searchVal === "") {

            if (sortValue == "") {

                jQuery.ajax({
                    url: "/api/position?offset=" + offset + "&count=" + count,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function (data) {
                        total = data.metadata.total;
                        $("#page").text("Page " + Math.floor(offset / count + 1) + " of " + (Math.ceil(total / count)));
                        $("#table_position").find(".cloned").remove();
                        $("#admin_pos_all_error").css("display", "none");

                        data.content.forEach(function (item) {
                            $("#pos_row").clone().prop("id", item.id).appendTo("#table_position");
                            $("#" + item.id).find("#pos_name").text(item.name);
                            $("#" + item.id).find("#pos_location").text(item.location);
                            $("#" + item.id).find("#pos_date").text(item.date);
                            $("#" + item.id).prop("class", "cloned");
                            $("#" + item.id).show();
                            $("#" + item.id).find("#admin_pos_btn_detail").click(function (e) {
                                $(location).attr('href', 'mainPositionDetail.html?adminId=' + adminId + '&token=' + token + '&role=' + role + '&positionId=' + item.id);
                            });

                        });
                    })
                    .fail(function (data) {
                        $("#admin_pos_all_error").text("Fail to load positions.");
                        $("#admin_pos_all_error").css("display", "block");
                    });

            }

            else {
                jQuery.ajax({
                    url: "/api/position?sort=" + sortValue + "&offset=" + offset + "&count=" + count,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function (data) {
                        total = data.metadata.total;
                        $("#page").text("Page " + Math.floor(offset / count + 1) + " of " + (Math.ceil(total / count)));
                        $("#table_position").find(".cloned").remove();
                        $("#admin_pos_all_error").css("display", "none");

                        data.content.forEach(function (item) {
                            $("#pos_row").clone().prop("id", item.id).appendTo("#table_position");
                            $("#" + item.id).find("#pos_name").text(item.name);
                            $("#" + item.id).find("#pos_location").text(item.location);
                            $("#" + item.id).find("#pos_date").text(item.date);
                            $("#" + item.id).prop("class", "cloned");
                            $("#" + item.id).show();
                            $("#" + item.id).find("#admin_pos_btn_detail").click(function (e) {
                                $(location).attr('href', 'mainPositionDetail.html?adminId=' + adminId + '&token=' + token + '&role=' + role + '&positionId=' + item.id);
                            });

                        });
                    })
                    .fail(function (data) {
                        $("#admin_pos_all_error").text("Fail to load positions.");
                        $("#admin_pos_all_error").css("display", "block");
                    });

            }
        }

        else {
            if (sortValue == "") {

                jQuery.ajax({
                    url: "/api/position?name=" + searchVal + "&offset=" + offset + "&count=" + count,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function (data) {
                        total = data.metadata.total;
                        $("#page").text("Page " + Math.floor(offset / count + 1) + " of " + (Math.ceil(total / count)));
                        $("#table_position").find(".cloned").remove();
                        $("#admin_pos_all_error").css("display", "none");

                        data.content.forEach(function (item) {
                            $("#pos_row").clone().prop("id", item.id).appendTo("#table_position");
                            $("#" + item.id).find("#pos_name").text(item.name);
                            $("#" + item.id).find("#pos_location").text(item.location);
                            $("#" + item.id).find("#pos_date").text(item.date);
                            $("#" + item.id).prop("class", "cloned");
                            $("#" + item.id).show();
                            $("#" + item.id).find("#admin_pos_btn_detail").click(function (e) {
                                $(location).attr('href', 'mainPositionDetail.html?adminId=' + adminId + '&token=' + token + '&role=' + role + '&positionId=' + item.id);
                            });

                        });
                    })
                    .fail(function (data) {
                        $("#admin_pos_all_error").text("Fail to load positions.");
                        $("#admin_pos_all_error").css("display", "block");
                    });

            }

            else {
                jQuery.ajax({
                    url: "/api/position?name=" + searchVal + "&sort=" + sortValue + "&offset=" + offset + "&count=" + count,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function (data) {
                        total = data.metadata.total;
                        $("#page").text("Page " + Math.floor(offset / count + 1) + " of " + (Math.ceil(total / count)));
                        $("#table_position").find(".cloned").remove();
                        $("#admin_pos_all_error").css("display", "none");

                        data.content.forEach(function (item) {
                            $("#pos_row").clone().prop("id", item.id).appendTo("#table_position");
                            $("#" + item.id).find("#pos_name").text(item.name);
                            $("#" + item.id).find("#pos_location").text(item.location);
                            $("#" + item.id).find("#pos_date").text(item.date);
                            $("#" + item.id).prop("class", "cloned");
                            $("#" + item.id).show();
                            $("#" + item.id).find("#admin_pos_btn_detail").click(function (e) {
                                $(location).attr('href', 'mainPositionDetail.html?adminId=' + adminId + '&token=' + token + '&role=' + role + '&positionId=' + item.id);
                            });

                        });
                    })
                    .fail(function (data) {
                        $("#admin_pos_all_error").text("Fail to load positions.");
                        $("#admin_pos_all_error").css("display", "block");
                    });

            }
        }

    }



});




















