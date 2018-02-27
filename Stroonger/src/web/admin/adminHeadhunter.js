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

    $("#can_row").hide();

    $("#admin_can_all_error").css("display", "none");

    loadHeadhunter();

    $("#sort_default").click(function (e) {
        e.preventDefault();
        sortValue = "";
        loadHeadhunter();
    });

    $("#sortByDate").click(function (e) {
        e.preventDefault();
        sortValue = "email";
        loadHeadhunter();
    });

    $("#sortBYName").click(function (e) {
        e.preventDefault();
        sortValue = "firstName";
        loadHeadhunter();
    });

    $("#next").click(function(e){
        e.preventDefault();
        if (offset + count < total) {
            offset = offset + count;
            loadHeadhunter();
        }
    });

    $("#previous").click(function(e){
        e.preventDefault();
        console.log("Cliked");
        if (offset - count >= 0) {
            offset = offset - count;
            loadHeadhunter();
        }
    });

    function loadHeadhunter() {

        if(sortValue == "") {
            jQuery.ajax ({
                url: "/api/admin/" + adminId + "/headhunter?offset=" + offset + "&count="  + count,
                type: "GET",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    total = data.metadata.total;
                    $("#page").text("Page " + Math.floor(offset/count+1) + " of " + (Math.ceil(total/count)));
                    $("#table_headhunter").find(".cloned").remove();


                    $("#admin_can_all_error").css("display", "none");

                    data.content.forEach(function(item){
                        $("#can_row").clone().prop("id",item.id).appendTo("#table_headhunter");
                        $("#"+item.id).find("#can_email").text(item.email);
                        $("#"+item.id).find("#can_fn").text(item.firstName);
                        $("#"+item.id).find("#can_ln").text(item.lastName);
                        $("#"+item.id).prop("class","cloned");
                        $("#"+item.id).show();
                        $("#"+item.id).find("#admin_can_btn_detail").click(function (e) {
                            $(location).attr('href', 'adminHeadhunterDetail.html?adminId=' + adminId + '&token=' + token + '&canId=' + item.id);
                        });

                    });
                })
                .fail(function(data){
                    $("#admin_pos_all_error").text("Fail to load headhunters.");
                    $("#admin_pos_all_error").css("display", "block");
                });

        }

        else {
            jQuery.ajax ({
                url: "/api/admin/" + adminId + "/headhunter?sort=" + sortValue + "&offset=" + offset + "&count="  + count,
                type: "GET",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    total = data.metadata.total;
                    $("#page").text("Page " + Math.floor(offset/count+1) + " of " + (Math.ceil(total/count)));
                    $("#table_headhunter").find(".cloned").remove();


                    $("#admin_can_all_error").css("display", "none");

                    data.content.forEach(function(item){
                        $("#can_row").clone().prop("id",item.id).appendTo("#table_headhunter");
                        $("#"+item.id).find("#can_email").text(item.email);
                        $("#"+item.id).find("#can_fn").text(item.firstName);
                        $("#"+item.id).find("#can_ln").text(item.lastName);
                        $("#"+item.id).prop("class","cloned");
                        $("#"+item.id).show();
                        $("#"+item.id).find("#admin_can_btn_detail").click(function (e) {
                            $(location).attr('href', 'adminHeadhunterDetail.html?adminId=' + adminId + '&token=' + token + '&canId=' + item.id);
                        });

                    });
                })
                .fail(function(data){
                    $("#admin_pos_all_error").text("Fail to load headhunters.");
                    $("#admin_pos_all_error").css("display", "block");
                });

        }

    }

});




















