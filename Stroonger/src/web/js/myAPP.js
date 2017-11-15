$(function() {
    var token = null;
    var userId = null;
    var offset = 0;
    var count = 20;
    var total = -1;
    var sortValue = "";

    //alert("Please use this form to login");
    $("#getResumes").hide();
    $("#candidate_row").hide();

    $("#signin").click(function (e) {

        e.preventDefault();

        jQuery.ajax ({
            url: "/api/sessions",
            type: "POST",
            data: JSON.stringify({email:$("#inputEmail").val(), password:$("#inputPassword").val()}),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function(data){
                $("#greeting").text("Hello " + data.content.firstName);
                $("#getResumes").show();
                $("#table_candidate").find(".cloned").remove();
                token = data.content.token;
                userId = data.content.userId;
            })
            .fail(function(data){
                $("#greeting").text("You might want to try it again");
                $("#getResumes").hide();
            })
    });

    $("#getResumes").click(function (e) {
        e.preventDefault();
        loadResumes();
    });

    $("#sort_by_file").click(function (e) {
        e.preventDefault();
        sortValue = "fileLink";
        loadResumes();
    });

    $("#sort_by_name").click(function (e) {
        e.preventDefault();
        sortValue = "versionName";
        loadResumes();
    });

    $("#sort_by_time").click(function (e) {
        e.preventDefault();
        sortValue = "uploadTime";
        loadResumes();
    });

    $("#sort_default").click(function (e) {
        e.preventDefault();
        sortValue = "";
        loadResumes();
    });

    $("#next").click(function(e){
        e.preventDefault();
        if (offset + count < total) {
            offset = offset + count;
            loadResumes();
        }
    });

    $("#previous").click(function(e){
        e.preventDefault();
        console.log("Cliked");
        if (offset - count >= 0) {
            offset = offset - count;
            loadResumes();
        }
    });

    function loadResumes() {

        if(sortValue == "") {
            jQuery.ajax ({
                url:  "/api/candidates/" + userId + "/resumes?&offset=" + offset + "&count="  + count,
                type: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", token);
                }
            })
                .done(function(data){
                    total = data.metadata.total;

                    $("#page").text("Page " + Math.floor(offset/count+1) + " of " + (Math.ceil(total/count)));
                    $("#table_candidate").find(".cloned").remove();

                    data.content.forEach(function(item){
                        $( "#candidate_row" ).clone().prop("id",item.id).appendTo( "#table_candidate" );
                        $("#"+item.id).find("#fileLink").text(item.fileLink);
                        $("#"+item.id).find("#versionName").text(item.versionName);
                        $("#"+item.id).find("#uploadTime").text(item.uploadTime);
                        $("#"+item.id).prop("class","cloned");
                        $("#"+item.id).show();
                    });
                })
                .fail(function(data){
                    $("#text_notification").text("Sorry no resumes!");
                })
        }

        else {
            jQuery.ajax ({
                url:  "/api/candidates/" + userId + "/resumes?sort=" + sortValue + "&offset=" + offset + "&count="  + count,
                type: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", token);
                }
            })
                .done(function(data){
                    total = data.metadata.total;

                    $("#page").text("Page " + Math.floor(offset/count+1) + " of " + (Math.ceil(total/count)));
                    $("#table_candidate").find(".cloned").remove();

                    data.content.forEach(function(item){
                        $( "#candidate_row" ).clone().prop("id",item.id).appendTo( "#table_candidate" );
                        $("#"+item.id).find("#fileLink").text(item.fileLink);
                        $("#"+item.id).find("#versionName").text(item.versionName);
                        $("#"+item.id).find("#uploadTime").text(item.uploadTime);
                        $("#"+item.id).prop("class","cloned");
                        $("#"+item.id).show();
                    });
                })
                .fail(function(data){
                    $("#text_notification").text("Sorry no resumes!");
                })
        }


    }

});


