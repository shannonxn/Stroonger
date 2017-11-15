$(function() {
    var token = null;
    var adminId = null;

    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        adminId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
    }
    else {
        QueryString = "";
    }

    $("#company_row").hide();


    jQuery.ajax ({
        url: "/api/company",
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            data.content.forEach(function(item){
                $( "#company_row" ).clone().prop("id",item.id).appendTo( "#table_company" );
                $("#"+item.id).find("#company_name").text(item.name);
                $("#"+item.id).prop("class","cloned");
                $("#"+item.id).show();
                $("#"+item.id).find("#admin_company_detail").click(function (e) {
                    $(location).attr('href', 'adminCompanyDetail.html?adminId=' + adminId + '&token=' + token + '&companyId=' + item.id);
                });
                $("#"+item.id).find("#admin_company_delete").click(function (e) {

                    jQuery.ajax ({
                        url: "/api/admin/" + adminId + "/company/" + item.id,
                        type: "DELETE",
                        beforeSend: function(request) {
                            request.setRequestHeader("Authorization", token);
                        },
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    })
                        .done(function(data){
                            alert("Delete a Company Successfully!");
                            window.location.reload();
                        })
                        .fail(function(data){
                            $("#admin_company_all_error").text("Fail to delete.");
                            $("#admin_company_all_error").css("display", "block");
                        });

                });
            });
            $("#admin_company_all_error").css("display", "none");
        })
        .fail(function(data){
            $("#admin_company_all_error").text("Fail to load companies.");
            $("#admin_company_all_error").css("display", "block");
        });

    $("#admin_company_add_create").click(function (e) {
        var company_name = $("#companyInputName").val();
        var company_field = $("#companyInputField").val();
        var company_description = $("#companyInputDescription").val();
        var company_location = $("#companyInputLocation").val();

        var errorFlag = 0;

        if(company_name === "") {
            $("#companyNameError").css("display", "block");
        } else {
            $("#companyNameError").css("display", "none");
            errorFlag = errorFlag + 1;
        }

        if(company_field === "") {
            $("#companyFieldError").css("display", "block");
        } else {
            $("#companyFieldError").css("display", "none");
            errorFlag = errorFlag + 1;
        }

        if(company_description === "") {
            $("#companyDescriptionError").css("display", "block");
        } else {
            $("#companyDescriptionError").css("display", "none");
            errorFlag = errorFlag + 1;
        }

        if(company_location === "") {
            $("#companyLocationError").css("display", "block");
        } else {
            $("#companyLocationError").css("display", "none");
            errorFlag = errorFlag + 1;
        }

        if(errorFlag >= 4) {
            jQuery.ajax ({
                url: "/api/admin/" + adminId + "/company",
                type: "POST",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                data: JSON.stringify({
                    name:company_name,
                    field:company_field,
                    description:company_description,
                    location:company_location
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .done(function(data){
                    $("#admin_company_add_error").css("display", "none");
                    alert("Add a Company Successfully!");
                    window.location.reload();
                })
                .fail(function(data){
                    $("#admin_company_add_error").css("display", "block");
                })
        }
    });

    $("#admin_company_add_cancel").click(function (e) {
        window.location.reload();
    });



});




















