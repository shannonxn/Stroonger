$(function() {
    var token = null;
    var userId = null;
    var role = null;
    var positionId = null;
    var resumeId = null;
    var resumeName = null;
    var comId = null;

    var canFN = null;
    var canLN = null;
    var comName = null;
    var posName = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;


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

        })
        .fail(function(data){
        });


    $("#apply_now").click(function (e) {

        canFN = $("#hh_apply_fn").val();
        canLN = $("#hh_apply_ln").val();
        resumeName = $("#hh_apply_re").val();

        if(canFN === "") {

        }

        jQuery.ajax ({
            url: "/api/headhunter/" + userId + "/resume",
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            data: JSON.stringify({
                fileLink: resumeName,
                versionName: resumeName
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data) {
                resumeId = data.content;

                jQuery.ajax ({
                    url: "/api/headhunter/" + userId + "/application",
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
                            url: "/api/headhunter/" + userId + "/notification",
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

            })
            .fail(function(data){
            })



    });




});




















