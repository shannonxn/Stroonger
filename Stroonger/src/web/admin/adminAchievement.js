$(function() {
    var token = null;
    var adminId = null;
    var achId = null;


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

    $("#ach_row").hide();
    $("#admin_ach_add_error").css("display", "none");
    $("#admin_ach_all_error").css("display", "none");

    loadAchievement();

    function loadAchievement() {
            jQuery.ajax ({
                url: "/api/admin/" + adminId + "/achievement",
                type: "GET",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    $("#admin_ach_all_error").css("display", "none");

                    data.content.forEach(function(item){
                        $("#ach_row").clone().prop("id",item.id).appendTo("#table_achievement");
                        $("#"+item.id).find("#ach_editor").text(item.editor);
                        $("#"+item.id).find("#ach_date").text(item.date);
                        $("#"+item.id).prop("class","cloned");
                        $("#"+item.id).show();
                        $("#"+item.id).find("#admin_ach_btn_detail").click(function (e) {
                            $(location).attr('href', 'adminAchievementDetail.html?adminId=' + adminId + '&token=' + token + '&achId=' + item.id);
                        });

                        $("#"+item.id).find("#admin_ach_btn_delete").click(function (e) {

                            jQuery.ajax ({
                                    url: "/api/admin/" + adminId + "/achievement/" + item.id,
                                    type: "DELETE",
                                    beforeSend: function(request) {
                                        request.setRequestHeader("Authorization", token);
                                    },
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8"
                                })
                                    .done(function(data){
                                        alert("Delete Achievement Successfully!");
                                        window.location.reload();
                                    })
                                    .fail(function(data){
                                    });

                    })

                    });
                })
                .fail(function(data){
                });
    }




    $("#admin_ach_add_create").click(function (e) {
        var ach_editor = $("#achi_author_edit").val();
        var ach_company = $("#achi_com_edit").val();
        var ach_content = $("#achi_content_edit").val();

        jQuery.ajax ({
            url: "/api/admin/" + adminId + "/achievement/",
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            data: JSON.stringify({
                editor:ach_editor,
                company:ach_company,
                content:ach_content
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                $("#admin_ach_add_error").css("display", "none");
                alert("Add a Achievement Successfully!");
                window.location.reload();
            })
            .fail(function(data){
            })

    });

    $("#admin_ach_add_cancel").click(function (e) {
        window.location.reload();
    });


});























