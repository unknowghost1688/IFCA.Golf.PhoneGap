var db = null;
//var URL_API = "http://localhost:3998";
//var SERVER_END_POINT_API = "http://localhost:3998";

$(document).one('pagecreate', function () {
    db = window.openDatabase("golfDB", "1.0", "Golf Database", 1000000);
    $.ajaxSetup({
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');

            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);

            }
        }
    });

    function navigateToMenu() {
        window.location.href = "booking_menu.html";
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

    var username = localStorage.getItem("username");
    var password = localStorage.getItem("password");
    login(username, password);

    $("#login").click(function () {
        login($("#username").val(), $("#password").val());
    });

    function login(username, password) {
        var success = false;
        db.transaction(
                function (tx) {
                    ensureTableExists(tx);
                    tx.executeSql('SELECT * FROM GolfDetail where UserName="' + username + '"', [], function (tx, result) {
                        for (var index = 0; index < result.rows.length; index++) {
                            var item = result.rows.item(index);
                            localStorage.setItem("Token", item.AuthToken);
                            localStorage.setItem("UserName", item.UserName);
                            localStorage.setItem("ICNo", item.ICNo);
                            localStorage.setItem("Email", item.Email);
                            localStorage.setItem("UserID", item.UserID);
                            localStorage.setItem("ClubMemberID", item.ClubMemberID);
                            localStorage.setItem("MembershipNo", item.MembershipNo);
                            localStorage.setItem("UserID", item.UserID);
                            localStorage.setItem("TokenExpiryDate", item.TokenExpiryDate);
                            localStorage.setItem("DeviceID", item.DeviceID);
                            localStorage.setItem("DeviceKey", item.DeviceKey);
                            success = true;
                            var sql2 = 'update GolfDetail set RecordStatus="Active" where UserName="' + username + '" ';
                            tx.executeSql(sql2);
                        }
                    }
                    , function (err) {

                    });
                },
                function (err) {

                },
                function (err) {
                    if (success == true) {
                        navigateToMenu();
                    }
                    else {
                        authenticateLogin(username, password);
                    }
                }
                );
    }

    function authenticateLogin(username, password) {

        $.ajax({
            type: "POST",
            url: SERVER_END_POINT_API + "/token",
            async: false,
            contentType: "application/x-www-form-urlencoded",
            data: "grant_type=password&username=" + username + "&password=" + password
        })
       .done(function (data) {

           //alert("sucess");
           var isLogin = authenticate(data);

           //localStorage.setItem("Token", data.access_token);
           // localStorage.setItem("UserName", data.UserName);


       }).fail(function () {
           alert("Invalid login");

       });
    }

    function getDeviceID() {

        if (localStorage.getItem("DeviceKey") != null) {
            return localStorage.getItem("DeviceKey");
        } else {
            return "no-device-id";
        }

    }

    function ensureTableExists(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS GolfDetail' +
                '(id INTEGER PRIMARY KEY, UserID,TokenExpiryDate,AuthToken,UserName,Email,ICNo,DeviceID,DeviceKey,RecordStatus,ClubMemberID,MembershipNo)');
    }

    function authenticate(msg) {

        var IsAuthenticated = false;
        //alert(msg.access_token);
        var token = {
            DeviceKey: getDeviceID(),
            Token: msg.access_token,
            TokenExpiryDate: msg.expires_in,
            UserName: msg.userName
        };


        $.ajax({
            type: "POST",
            url: SERVER_END_POINT_API + "/api/User/Authenticate",
            contentType: "application/json",
            async: true,
            data: JSON.stringify(token),
            headers: {
                "Authorization": "Bearer " + msg.access_token
            }
        }).done(function (data) {

            var msg = JSON.parse(data);

            localStorage.setItem("ICNo", msg.ICNo);
            localStorage.setItem("Email", msg.Email);
            localStorage.setItem("UserID", msg.UserID);
            localStorage.setItem("ClubMemberID", msg.ClubMemberID);
            localStorage.setItem("MembershipNo", msg.MembershipNo);
            localStorage.setItem("TokenExpiryDate", msg.TokenExpiryDate);
            localStorage.setItem("Token", msg.Token);
            localStorage.setItem("UserName", msg.UserName);
            IsAuthenticated = true;
            db.transaction(
                              function (tx) {
                                  ensureTableExists(tx);
                                  //var sql = 'select COUNT(*) as a  from Contacts where firstname="' + firstName + '"';
                                  var sql = 'SELECT COUNT(*) as a  from GolfDetail where UserName="' + msg.UserName + '"';
                                  tx.executeSql(sql, [],
                                          function (tx, results) {
                                              var item;
                                              item = results.rows.item(0);
                                              if (item.a == 0) {
                                                  var sql1 = 'INSERT INTO GolfDetail(UserID,TokenExpiryDate,AuthToken,UserName,Email,ICNo,DeviceID,DeviceKey,RecordStatus,ClubMemberID,MembershipNo) VALUES("' + msg.UserID + '","' + msg.TokenExpiryDate + '","' + msg.Token + '","' + msg.UserName + '","' + msg.Email + '","' + msg.ICNo + '","' + msg.DeviceID + '","' + msg.DeviceKey + '","Active","' + msg.ClubMemberID + '","' + msg.MembershipNo + '")';
                                                  tx.executeSql(sql1);
                                              }
                                              else {
                                                  var sql2 = 'update GolfDetail set RecordStatus="Active", TokenExpiryDate="' + msg.TokenExpiryDate + '",AuthToken="' + msg.Token + '",Email="' + msg.Email + '",ICNo="' + msg.ICNo + '",DeviceID="' + msg.DeviceID + '",DeviceKey="' + msg.DeviceKey + '" where UserName="' + msg.UserName + '" ';
                                                  tx.executeSql(sql2);
                                              }
                                              navigateToMenu();
                                          }
                                          , function (err) {
                                              //alert("Unable to fetch result from golf Table");
                                          });
                              }, function (err) {
                                  //alert("Test");
                              },
                              function (err) {
                              }
                              );

        }).fail(function () {
            IsAuthenticated = false;
            alert("fail authenticate");

            if (localStorage.getItem("UserName") != undefined) {
                $("#login").click();
            }

        });

        return IsAuthenticated;
    }


});