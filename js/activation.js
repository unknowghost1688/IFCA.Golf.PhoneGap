$(document).one('pagecreate', function () {

    $("#activate").click(function () {

         var aToken = localStorage.getItem("aToken");
         var regid = localStorage.getItem("regid");
         var verifykey = localStorage.getItem("verifykey");

         var code = $("#code").val();



         if (code.length != 0 && code.length > 3) {

             $.ajax({
                 type: "POST",
                 contentType: "application/json",
                 url: URL_API + "/api/User/MembershipsActivation?atoken=" + aToken + "&regid=" + regid + "&verifykey=" + verifykey + "&code=" + code ,
                 
                
             })
            .done(function (data) {
                //alert(data[0]);
                //alert(data[1]);
                var data = data.split("|");
                localStorage.setItem("username", data[0]);
                localStorage.setItem("password", data[1]);

                window.location.href = "login.html";
            }).fail(function (jqXHR, exception) {
                //if (jqXHR.status === 0) {
                //    alert('Not connect.\n Verify Network.');
                //} else if (jqXHR.status == 404) {
                //    alert('Requested page not found. [404]');

                //} else if (jqXHR.status == 500) {
                //    alert('Internal Server Error [500].');
                //} else if (exception === 'parsererror') {
                //    alert('Requested JSON parse failed.');
                //} else if (exception === 'timeout') {
                //    alert('Time out error.');
                //} else if (exception === 'abort') {
                //    alert('Ajax request aborted.');
                //} else {
                //    alert('Uncaught Error.\n' + jqXHR.responseText);

                //}

                alert("Please enter a valid 4-Digit Code.");
            });
         }
         else {
             alert("Please enter the 4-Digit Code.");

         }
    });

});