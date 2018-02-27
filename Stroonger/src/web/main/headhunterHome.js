$(function() {
    var token = null;
    var userId = null;
    var info_data = null;
    var updated_data = null;
    var offset = 0;
    var count = 20;
    var total = -1;
    var sortValue = "";


    var email = null;
    var firstName = null;
    var lastName = null;
    var gender = null;
    var age = null;
    var country = null;
    var state = null;
    var city = null;
    var zipCode = null;
    var mobile = null;
    var bankaccount = null;
    var routenumber = null;


    $("#app_row").hide();


    var URL = document.location.toString();
    var QueryString, tmpArr, queryParamert;

    if (URL.lastIndexOf("?") != -1) {
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");

        userId = tmpArr[0].substring(tmpArr[0].indexOf("=") + 1, tmpArr[0].length);
        token = tmpArr[1].substring(tmpArr[1].indexOf("=") + 1, tmpArr[1].length);
    } else {
        QueryString = "";
    }


    $("#save_button").hide();
    $(".text_adminContent").show();
    $(".text_edit").hide();
    $("#edit_error").hide();

    jQuery.ajax ({
        url: "/api/headhunter/" + userId,
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){
            email = data.content.email;
            firstName = data.content.firstName;
            lastName = data.content.lastName;
            gender = data.content.gender;
            age = data.content.age;
            country = data.content.country;
            state = data.content.state;
            city = data.content.city;
            zipCode = data.content.zipCode;
            mobile = data.content.mobile;
            bankaccount = data.content.bankaccount;
            routenumber = data.content.routenumber;

            $("#email").text(email);
            $("#fn").text(firstName);
            $("#ln").text(lastName);
            $("#gender").text(gender);
            $("#age").text(age);
            $("#country").text(country);
            $("#state").text(state);
            $("#city").text(city);
            $("#zip").text(zipCode);
            $("#mobile").text(mobile);
            $("#bankaccount").text(bankaccount);
            $("#routenumber").text(routenumber);
        })
        .fail(function(data){

        });


    jQuery.ajax ({
        url: "/api/headhunter/" + userId + "/application",
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
        .done(function(data){

            data.content.forEach(function(item){
                $("#app_row").clone().prop("id",item.id).appendTo( "#table_app" );
                $("#"+item.id).find("#app_can_name").text(item.userFN + " " + item.userLN);
                $("#"+item.id).find("#app_com_name").text(item.comName);
                $("#"+item.id).find("#app_pos_name").text(item.posName);
                $("#"+item.id).find("#app_date").text(item.applyDate);
                $("#"+item.id).find("#app_status").text(item.statue);
                $("#"+item.id).prop("class","cloned");
                $("#"+item.id).show();
            });

        })
        .fail(function(data){

        });


    $("#edit_button").click(function (e) {
        e.preventDefault();
        $("#save_button").show();
        $("#edit_button").hide();

        $("#edit_email").val(email);
        $("#edit_fn").val(firstName);
        $("#edit_ln").val(lastName);
        $("#edit_gender").val(gender);
        $("#edit_age").val(age);
        $("#edit_country").val(country);
        $("#edit_state").val(state);
        $("#edit_city").val(city);
        $("#edit_zip").val(zipCode);
        $("#edit_mobile").val(mobile);
        $("#edit_bankaccount").val(bankaccount);
        $("#edit_routenumber").val(routenumber);


        $(".text_adminContent").hide();
        $(".text_edit").show();

    });

    $("#save_button").click(function (e) {
        e.preventDefault();
        $("#edit_button").show();
        $("#save_button").hide();

        var newemail = $("#edit_email").val();
        var newfn = $("#edit_fn").val();
        var newln = $("#edit_ln").val();
        var newgender = $("#edit_gender").val();
        var newage = $("#edit_age").val();
        var newcountry = $("#edit_country").val();
        var newstate = $("#edit_state").val();
        var newcity = $("#edit_city").val();
        var newzip = $("#edit_zip").val();
        var newmobile = $("#edit_mobile").val();
        var newbankaccount = $("#edit_bankaccount").val();
        var newroutenumber = $("#edit_routenumber").val();

        jQuery.ajax ({
            url: "/api/headhunter/" + userId,
            type: "PATCH",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            data: JSON.stringify({
                email:newemail,
                firstName:newfn,
                lastName:newln,
                gender:newgender,
                age:newage,
                country:newcountry,
                state:newstate,
                city:newcity,
                zipCode:newzip,
                mobile:newmobile,
                bankaccount:newbankaccount,
                routenumber:newroutenumber
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                window.location.reload();
            })
            .fail(function(data){
                $("#edit_error").show();
            })
    });

    $("#logout_button").click(function (e) {
        $(location).attr('href', '../');
    });


});



