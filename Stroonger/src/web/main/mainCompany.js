$(function() {
    var token = null;
    var userId = null;
    var offset = 0;
    var count = 20;
    var total = -1;
    var sortValue = "";

    var searchVal = "";

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        userId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
    }
    else {
        QueryString = "";
    }

    $("#company_row").hide();

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
            url: "/api/company?name=" + searchVal + "&offset=" + offset + "&count=" + count,
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
                $("#table_company").find(".cloned").remove();

                data.content.forEach(function(item){
                    $( "#company_row" ).clone().prop("id",item.id).appendTo( "#table_company" );
                    $("#"+item.id).find("#company_name").text(item.name);
                    $("#"+item.id).prop("class","cloned");
                    $("#"+item.id).show();
                    $("#"+item.id).find("#admin_company_detail").click(function (e) {
                        $(location).attr('href', 'mainCompanyDetail.html?userId=' + userId + '&token=' + token + '&companyId=' + item.id);
                    });

                });
                $("#admin_company_all_error").css("display", "none");
            })
            .fail(function(data){
                $("#admin_company_all_error").text("Fail to load companies.");
                $("#admin_company_all_error").css("display", "block");
            });
    });


    function loadCandidate() {

        if(searchVal === "") {

            if (sortValue == "") {

                jQuery.ajax({
                    url: "/api/company?offset=" + offset + "&count=" + count,
                    type: "GET",
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", token);
                    },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function (data) {
                        total = data.metadata.total;
                        $("#page").text("Page " + Math.floor(offset / count + 1) + " of " + (Math.ceil(total / count)));
                        $("#table_company").find(".cloned").remove();

                        data.content.forEach(function (item) {
                            $("#company_row").clone().prop("id", item.id).appendTo("#table_company");
                            $("#" + item.id).find("#company_name").text(item.name);
                            $("#" + item.id).prop("class", "cloned");
                            $("#" + item.id).show();
                            $("#" + item.id).find("#admin_company_detail").click(function (e) {
                                $(location).attr('href', 'mainCompanyDetail.html?userId=' + userId + '&token=' + token + '&companyId=' + item.id);
                            });

                        });
                        $("#admin_company_all_error").css("display", "none");
                    })
                    .fail(function (data) {
                        $("#admin_company_all_error").text("Fail to load companies.");
                        $("#admin_company_all_error").css("display", "block");
                    });

            }

            else {
                jQuery.ajax({
                    url: "/api/company?sort=" + sortValue + "&offset=" + offset + "&count=" + count,
                    type: "GET",
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", token);
                    },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function (data) {
                        total = data.metadata.total;
                        $("#page").text("Page " + Math.floor(offset / count + 1) + " of " + (Math.ceil(total / count)));
                        $("#table_company").find(".cloned").remove();

                        data.content.forEach(function (item) {
                            $("#company_row").clone().prop("id", item.id).appendTo("#table_company");
                            $("#" + item.id).find("#company_name").text(item.name);
                            $("#" + item.id).prop("class", "cloned");
                            $("#" + item.id).show();
                            $("#" + item.id).find("#admin_company_detail").click(function (e) {
                                $(location).attr('href', 'mainCompanyDetail.html?userId=' + userId + '&token=' + token + '&companyId=' + item.id);
                            });

                        });
                        $("#admin_company_all_error").css("display", "none");
                    })
                    .fail(function (data) {
                        $("#admin_company_all_error").text("Fail to load companies.");
                        $("#admin_company_all_error").css("display", "block");
                    });


            }
        }

        else {
            if (sortValue == "") {

                jQuery.ajax({
                    url: "/api/company?name=" + searchVal + "&offset=" + offset + "&count=" + count,
                    type: "GET",
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", token);
                    },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function (data) {
                        total = data.metadata.total;
                        $("#page").text("Page " + Math.floor(offset / count + 1) + " of " + (Math.ceil(total / count)));
                        $("#table_company").find(".cloned").remove();

                        data.content.forEach(function (item) {
                            $("#company_row").clone().prop("id", item.id).appendTo("#table_company");
                            $("#" + item.id).find("#company_name").text(item.name);
                            $("#" + item.id).prop("class", "cloned");
                            $("#" + item.id).show();
                            $("#" + item.id).find("#admin_company_detail").click(function (e) {
                                $(location).attr('href', 'mainCompanyDetail.html?userId=' + userId + '&token=' + token + '&companyId=' + item.id);
                            });

                        });
                        $("#admin_company_all_error").css("display", "none");
                    })
                    .fail(function (data) {
                        $("#admin_company_all_error").text("Fail to load companies.");
                        $("#admin_company_all_error").css("display", "block");
                    });

            }

            else {
                jQuery.ajax({
                    url: "/api/company?name=" + searchVal + "&sort=" + sortValue + "&offset=" + offset + "&count=" + count,
                    type: "GET",
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", token);
                    },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function (data) {
                        total = data.metadata.total;
                        $("#page").text("Page " + Math.floor(offset / count + 1) + " of " + (Math.ceil(total / count)));
                        $("#table_company").find(".cloned").remove();

                        data.content.forEach(function (item) {
                            $("#company_row").clone().prop("id", item.id).appendTo("#table_company");
                            $("#" + item.id).find("#company_name").text(item.name);
                            $("#" + item.id).prop("class", "cloned");
                            $("#" + item.id).show();
                            $("#" + item.id).find("#admin_company_detail").click(function (e) {
                                $(location).attr('href', 'mainCompanyDetail.html?userId=' + userId + '&token=' + token + '&companyId=' + item.id);
                            });

                        });
                        $("#admin_company_all_error").css("display", "none");
                    })
                    .fail(function (data) {
                        $("#admin_company_all_error").text("Fail to load companies.");
                        $("#admin_company_all_error").css("display", "block");
                    });


            }
        }

    }





});




















