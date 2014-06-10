var db = window.openDatabase("golfDB", "1.0", "Golf Database", 1000000);
$(document).on('pageinit', function () {
    $(document).one('click', '#logout', function (e) {
        db.transaction(
                             function (tx) {
                                 var sql = 'UPDATE GolfDetail set RecordStatus="InActive" where UserName="' + localStorage.getItem("UserName") + '" ';
                                 tx.executeSql(sql);
                                 alert(sql);
                                 localStorage.clear();
                                 window.location.href = "index.html";
                             }, function (err) {
                             },
                         function (err) {
                         }
                      );
    });

    if (localStorage.getItem("UserName") == null && localStorage.getItem("Token") == null) {
        var success = false;
        db.transaction(
                function (tx) {
                    tx.executeSql('SELECT * FROM GolfDetail where RecordStatus="Active"', [], function (tx, result) {
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
                        }
                    }, function (err) {
                        alert(err);
                    });
                },
                function (err) {
                    alert(err);
                },
                function (err) {
                    if (success == false) {
                        window.location.href = "index.html";
                    }
                }
                );
    }
});

