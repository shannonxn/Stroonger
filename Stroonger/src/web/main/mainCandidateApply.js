$(function() {
    var token = null;
    var userId = null;
    var role = null;
    var positionId = null;
    var resumeId = null;
    var comId = null;

    var canFN = null;
    var canLN = null;
    var comName = null;
    var posName = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    $("#resume_row").hide();
    $("#error_resume_name").hide();
    $("#error_resume_link").hide();

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        userId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
        role = tmpArr[2].substring(tmpArr[2].indexOf("=") + 1, tmpArr[2].length);
        positionId = tmpArr[3].substring(tmpArr[3].indexOf("=") + 1, tmpArr[3].length);
    } else {
        QueryString = "";
    }


    jQuery.ajax ({
        url: "/api/position/" + positionId,
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){

            comId = data.content.companyId;

            jQuery.ajax ({
                url: "/api/company/" + comId,
                type: "GET",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    comName = data.content.name;
                    $("#apply_com_con").text(comName);
                })
                .fail(function(data){

                });

            posName = data.content.name;

            $("#apply_pos_con").text(posName);

            jQuery.ajax ({
                url: "/api/candidate/" + userId,
                type: "GET",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    canFN = data.content.firstName;
                    canLN = data.content.lastName;
                    $("#apply_fn_con").text(canFN);
                    $("#apply_ln_con").text(canLN);
                })
                .fail(function(data){

                });

        })
        .fail(function(data){
        });


    jQuery.ajax ({
        url: "/api/candidate/" + userId + "/resume/",
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            data.content.forEach(function(item){
                $( "#resume_row" ).clone().prop("id",item.id).appendTo( "#table_resume" );
                $("#"+item.id).find("#resume_text_name").text(item.versionName);
                $("#"+item.id).find("#resume_text_link").text(item.fileLink);
                $("#"+item.id).prop("class","cloned");
                $("#"+item.id).show();
                $("#"+item.id).find("#resume_radio").prop("value", item.id);
            });

        })
        .fail(function(data){
        });


    $("#add_resume").click(function (e) {
        var new_resume_name = $("#edit_resume_name").val();
        var new_resume_link = $("#edit_resume_link").val();
        var flag = 0;

        if(new_resume_name === "") {
            $("#error_resume_name").show();
        } else {
            $("#error_resume_link").hide();
            flag++;
        }

        if(new_resume_link === "") {
            $("#error_resume_link").show();
        } else {
            $("#error_resume_link").hide();
            flag++;
        }

        // alert(flag);

        if(flag >= 2) {
            jQuery.ajax ({
                url: "/api/candidate/" + userId + "/resume/",
                type: "POST",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                data: JSON.stringify({
                    fileLink: new_resume_name,
                    versionName: new_resume_link
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data) {
                    alert("Add the resume successfully!");
                    window.location.reload();
                })
                .fail(function(data){

                })
        }

    });



    $("#apply_now").click(function (e) {

        var radio = document.getElementsByName("resume");
        for (i=0; i<radio.length; i++) {
            if (radio[i].checked) {
                resumeId = radio[i].value;
            }
        }

        jQuery.ajax ({
            url: "/api/candidate/" + userId + "/application",
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            data: JSON.stringify({
                companyId: comId,
                positionId: positionId,
                userId: userId,
                resumeId: resumeId,
                userFN: canFN,
                userLN: canLN,
                comName: comName,
                posName: posName
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data) {


                jQuery.ajax ({
                    url: "/api/candidate/" + userId + "/notification",
                    type: "POST",
                    beforeSend: function(request) {
                        request.setRequestHeader("Authorization", token);
                    },
                    data: JSON.stringify({
                        title: "New Application",
                        content: "Name: " + canFN + " " + canLN + "&" + "Company: " + comName + "&" + "Position: " + posName
                    }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(data) {
                        alert("Apply successfully!");
                        $(location).attr('href', 'mainPositionDetail.html?userId=' + userId + '&token=' + token + '&role=' + role + '&positionId=' + positionId);
                    })
                    .fail(function(data){

                    })


            })
            .fail(function(data){

            })
    });




});




















