$(document).one('pagecreate', function () {
    function navigateToMenu() {
        window.location.href = "login.html";
        // $.mobile.navigate("booking_menu.html");
    }


    if (localStorage.getItem("UserName") != undefined && localStorage.getItem("Token") != undefined) {

        $.ajaxSetup({
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("Token")
            }
        });
        navigateToMenu();


    }
    $("#register").click(function () {


        var member = $("#membershipNo").val();

        if (member.length != 0)
        {
            var regMember = {

                ClubID: 3,
                Username: "KLGCC_" + member,
                MembershipNo: member,
                Password: "123456$$"
            }

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: URL_API + "/api/User/RegisterGolfClubMember",
                data: JSON.stringify(regMember)
            })
           .done(function (data) {
               var ActivationData = data.split("|");


               localStorage.setItem("aToken", ActivationData[0]);
               localStorage.setItem("regid", ActivationData[1]);
               localStorage.setItem("verifykey", ActivationData[2]);

               window.location.href = "activation.html";
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
               alert("Please key in a valid membership no. to register.")
           }

           );
        }
        else {
            alert("Key in a valid membership no. to register.");

        }
        });
    
});