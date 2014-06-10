//var SERVER_END_POINT_API = "http://localhost:3998/";
//var URL_API = "http://localhost:3998";
var URL_API = "http://175.139.183.94:76/GolfAPI";
var SERVER_END_POINT_API = "http://175.139.183.94:76/GolfAPI/";


var defaultDate_Test = "";

function showLoading() {
    $.mobile.loading("show", {
        text: "Loading",
        textVisible: true,
        textonly: false,
    });
}

function HideLoading() {
    $.mobile.loading("hide");
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
function convertJsonDateTime(data) {
    var dateString = data;
    var reggie = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    var dateArray = reggie.exec(dateString);
    var dateObject = new Date(
        (+dateArray[1]),
        (+dateArray[2]) - 1, // Careful, month starts at 0!
        (+dateArray[3]),
        (+dateArray[4]),
        (+dateArray[5]),
        (+dateArray[6])
    );
    return dateObject;
}

$(document).on({
    ajaxStart: function () {
        showLoading();
    },
    ajaxStop: function () {
        HideLoading();
    }
});

if (localStorage.getItem("Token") != "") {
    $.ajaxSetup({
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("Token")
        }
    });
}