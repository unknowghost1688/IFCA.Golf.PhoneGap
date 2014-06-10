function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}
$(document).one('pagebeforeshow', function (event, data) {

    $(document).off('click', '.btnMenu_Click').on('click', '.btnMenu_Click', function (e) {
        window.location.href = "booking_menu.html";
    });

    $(document).off('click', '.btnBack_Click').on('click', '.btnBack_Click', function (e) {
        window.location.href = "newbooking.html";
    });

    var weekday = new Array(7);
    weekday[0] = "SUN";
    weekday[1] = "MON";
    weekday[2] = "TUE";
    weekday[3] = "WED";
    weekday[4] = "THU";
    weekday[5] = "FRI";
    weekday[6] = "SAT";

    var parameters = getURLParameter("BookingID");
    $.ajax({
        url: SERVER_END_POINT_API + 'api/Booking/GetBookingDetail',
        type: 'GET',
        dataType: 'json',
        data: {
            BookingID: parameters,
        },
        success: function (Data) {
            Club = Data.Club;
            RecordStatus = Data.RecordStatus;
            FlightDateTime = new Date(convertJsonDateTime(Data.FlightDateTime));
            Course = Data.Course;
            comfirmationID = Data.ComfirmationID;
            $('#bookedClub').html("");
            $("#bookedClub").append(Club);
            $('#bookedCourse').html("");
            $("#bookedCourse").append(Course);
            $('#bookedDate').html("");
            $("#bookedDate").append(FlightDateTime.getDate() + "/" + (FlightDateTime.getMonth() + 1) + "/" + FlightDateTime.getFullYear() + "(" + weekday[FlightDateTime.getDay()] + ")");
            $('#bookedTime').html("");
            $("#bookedTime").append(formatAMPM(FlightDateTime));
            $('#bookedHole').html("");
            $("#bookedHole").append(Data.Holes + " Holes");
            $('#bookedComfirmation').html("");
            $("#bookedComfirmation").append("Booking ID: " + comfirmationID);
        }
    });
});