var clubMemberID;
var membershipNo;
var confirmationID;
var courseID;
var flightDateTime;
var noOfHoles;
var weekday = new Array(7);
weekday[0] = "SUN";
weekday[1] = "MON";
weekday[2] = "TUE";
weekday[3] = "WED";
weekday[4] = "THU";
weekday[5] = "FRI";
weekday[6] = "SAT";

function loadBooking(membershipNo) {
    var htmlString = "";
    var flightDate = "";
    var displayDate = "";
    
    $.ajax({
        url: SERVER_END_POINT_API + '/api/Booking/GetByMemberID?',
        type: 'GET',
        dataType: 'json',
        data: {
            MembershipNo: membershipNo
        },
        success: function (result) {
            if (result != null && result != "") {
                $.each(result, function (index, element) {
                    flightDate = "";
                    displayDate = "";
                    flightDate = new Date(convertJsonDateTime(element.FlightDateTime));                    
                    displayDate = flightDate.getDate() + "/" + (flightDate.getMonth()+1) + "/" + flightDate.getFullYear() + "(" + weekday[flightDate.getDay()] + ")";

                    htmlString = htmlString + "<ul data-role=\"listview\" data-inset=\"true\">" +
                    "<li data-role=\"list-divider\" data-theme=\"b\">" +
                        "<h1 class=\"CourseNameHeader\">" + element.CourseName + "</h1></li> " +
                    "<li data-theme=\"d\"><div class=\"ui-grid-b center\"><br />" +
                            "<div class=\"ui-block-a\"><img src=\"images/date.png\" class=\"confimedIcon\" /></div>" +
                            "<div class=\"ui-block-b\"><img src=\"images/time.png\" class=\"confimedIcon\" /></div>" +
                            "<div class=\"ui-block-c\"><img src=\"images/hole.png\" class=\"confimedIcon\" /></div>" +
                            "<div class=\"ui-block-a\"><id>" + displayDate + "</id></div>" +
                            "<div class=\"ui-block-b\"><id>" + element.FlightTime + "</id></div>" +
                            "<div class=\"ui-block-c\"><id>" + element.NoOfHoles + " Holes</id></div></div><br /></li>" +
                    "<li data-role=\"list-divider\" data-theme=\"b\">" +
                         "<h1 class=\"CancelButtonLabel\">ID: " + element.ConfirmationID + "</h1><div class=\"RedCancelButton\"><a data-role=\"button\" data-icon=\"delete\" data-theme=\"e\" class=\"btnRight ui-btn-right-cancel ui-link ui-btn ui-btn-e ui-icon-delete ui-btn-icon-left ui-shadow ui-corner-all btnCancelBooking\" confirmid=\"" + element.ConfirmationID + "\" courseid=\"" + element.CourseID + "\" flightdatetime=\"" + element.FlightDateTime + "\" noofholes=\"" + element.NoOfHoles + "\">Cancel Booking</a></div></li></ul>"
                });
                $("#wrapper").html("");                
                $("#wrapper").append(htmlString).trigger("create");                
            } else {
                htmlString = htmlString + "<div class=\"no-booking\"> You have no upcoming booking.</div>"
                $("#wrapper").html("");
                $('#content').css({ "padding": '0' });
                $("#wrapper").append(htmlString);                
            }

        },
        error: function () {
            alert("error");
        },
    });
}
$(document).one("pagebeforeshow", function () {    
    if (localStorage.getItem("ClubMemberID") != null) {
        clubMemberID = localStorage.getItem("ClubMemberID");
    }
    if (localStorage.getItem("MembershipNo") != null) {
        membershipNo = localStorage.getItem("MembershipNo");
    }
    loadBooking(membershipNo);

    $(document).off('click', '.btnCancelBooking').on('click', '.btnCancelBooking', function (e) {
        confirmationID = $(this).attr("confirmid");
        courseID = $(this).attr("courseid");
        flightDateTime = $(this).attr("flightdatetime");
        noOfHoles = $(this).attr("noofholes");
        $("#popupDialog").popup("open");
    });

    $(document).off('click', '#cancelBooking').on('click', '#cancelBooking', function (e) {
        submitCancel(membershipNo, confirmationID, clubMemberID, courseID, flightDateTime, noOfHoles);
    });

    $(document).off('click', '.btnMenu_Click').on('click', '.btnMenu_Click', function (e) {
        window.location.href = "booking_menu.html";
    });

    $(document).off('click', '.btnBack_Click').on('click', '.btnBack_Click', function (e) {
        window.location.href = "booking_menu.html";
    });
});
function submitCancel(membershipno, confirmationid, clubMemberID, courseID, flightDateTime, noOfHoles) {
    $.ajax({
        url: SERVER_END_POINT_API + '/api/Booking/CancelBooking',
        type: 'GET',
        dataType: 'json',
        data: {
            MembershipNo: membershipno,
            ConfirmationID: confirmationid,
            ClubMemberID: clubMemberID,
            CourseID: courseID,
            FlightDateTime: flightDateTime,
            NoOfHoles: noOfHoles,
        },
        success: function (result) {
            if (result != null) {
                if (result == "ok") {
                    //alert("Cancel Success");
                    $("#CancelSuccess").popup("open");
                    $(document).off('click', '#cancelOK').on('click', '#cancelOK', function (e) {
                        loadBooking(membershipNo);
                    });
                    
                } else {
                    alert("fail to cancel");
                }
            } else {
                alert("fail to cancel");
            }
        }
    });
}
