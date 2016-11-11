var numberOfHoles = 18;
var myLocation = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};
var closeCourses;
var selectedCourse;
var Weather;
var players;
var front = [];
var totPar = 0, totYards = 0;
var tees;

$(document).ready(function () {
    $.post("https://golf-courses-api.herokuapp.com/courses", myLocation, function (data, status) {
        closeCourses = JSON.parse(data);
        console.log(closeCourses);
        for (var p in closeCourses.courses) {
            $("#courseSelect").append("<option value='" + closeCourses.courses[p].id + "'>" + closeCourses.courses[p].name + "</option>");

        }
    });

});

function loadCourse(theid) {



    $.get("https://golf-courses-api.herokuapp.com/courses/" + theid, function (data, status) {
        selectedCourse = JSON.parse(data).course;
        $("#courseTitle").html(selectedCourse.name);
        $(".modal-title").html(selectedCourse.name + " Information");
        $("#CourseInfo").html("<h4>Phone Number: </h4>" + selectedCourse.phone + '<br>');
        $("#CourseInfo").append("<h4>Website: </h4> " + selectedCourse.website + '<br>');
        $("#CourseInfo").append("<h4>Address: </h4> " + selectedCourse.addr_1 + ", " + selectedCourse.city + ", " + selectedCourse.state_or_province + " " + selectedCourse.zip_code +'<br>');
        $("#CourseInfo").append("<h4>Membership Type: </h4>" + selectedCourse.membership_type + '<br>');


        for (var i = 0; i < (selectedCourse.holes[0].tee_boxes.length - 1); i++) {
            $("#teeType").append("<option value='" + i + "'>" + selectedCourse.holes[0].tee_boxes[i].tee_type + "</option>");

        }

    });


}


function begincard() {
    // $("#golfBanner").fadeIn();
    players = $("#playercount").val();
    var teetype = $("#teetype").val();
    console.log(players);
    $("#cardLeft").html("");

    console.log(selectedCourse);


    //initialize weather data
     var lati = selectedCourse.location.lat;
    var long = selectedCourse.location.lng;
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat={"+ lati +"}&lon={"+ long +"}";
    $.get("weatherURL", function (weatherStuff, status) {
        Weather = JSON.parse(weatherStuff);
    });


    for (var i = 0; i < selectedCourse.holes.length; i++) {
        var hole = selectedCourse.holes[i];
         var tees;
        for (var j = 0; j < hole.tee_boxes.length; j++) {
            var teebox = hole.tee_boxes[j];

            if (teebox.teetype === teetype) {
                tees = teebox;
                break;
            }
        }

        $("#tableHeader").append('<th>' + hole.hole_num + '<br> Par: ' + tees.par + '<br> Yards: ' + tees.yards + '</tr>');
        totPar += parseInt(tees.par);
        totYards += parseInt(tees.yards);
    }

    for (var i = 0; i < players; i++) {
        var playerData = '<tr><td style="margin-right: 20px;"><input id="Player' + (i + 1) + 'Name" placeholder="Player ' + (i + 1) +'" style="border: none;"></td>';

        for (var j = 0; j < selectedCourse.holes.length; j++) {
            playerData += '<td><input size="2" maxlength="2" value="0" id="player' + (i + 1) + 'col' + (j + 1) + '"></td>';
        }
        //added id to all cells, exe. player#col#  and player#tot#
        // tot1 = front9 total, tot2 = back9 total, tot3 = grand total
        for(var k = 1; k <= 3; k++){
            playerData += '<td><output id="player' + (i + 1) + 'tot' + k + '"></output></td>';
        }
        playerData += '</tr>';
        $("#mainTable").append(playerData);

    }
    
    $("#InnerScoresContainer").html("'<h4 style='text-align: center; font-family: sans-serif;'>Total Pars:" + totPar + "</h4>'");
    $("#InnerScoresContainer").append("'<h4 style='text-align: center; font-family: sans-serif;'>Total Yards:" + totYards + "</h4>'");

    //Add totals to total modal
    for (var t = 1; t <= players; t++) {
        var PlayerName = $("#Player" + t + "Name").val();
        $("#ScoresTable").append("<tr><td id='Player" + t + "TableName'></td><td id='Player" + t + "front'></td><td  id='Player" + t + "back'></td><td  id='Player" + t + "Grand'></td><td id='status" + t +"'></td></tr>");

    }

    $("#modalbackground").fadeOut();
}




function calculateTotals() {


    //add player names to total table
    for (var t = 1; t <= players; t++) {
        var PlayerName = $("#Player" + t + "Name").val();
        var PlayerTableName = $("#Player" + t + "TableName");
        PlayerTableName.html(PlayerName);

    }
    // for (var c = 1; c <= players; c++) {


        for (var p = 0; p < players; p++) {
            var FrontScore = 0;
            var BackScore = 0;
            var totalScore = 0;
            for (var i = 1; i <= 9; i++) {
                var playerId = "player" + (p + 1) + "col" + i;
                FrontScore += parseInt($('#' + playerId).val());
            }
            for (var b = 10; b <= 18; b++) {
                var playerId = "player" + (p + 1) + "col" + b;
                BackScore += parseInt($('#' + playerId).val());
            }
            totalScore = FrontScore + BackScore;

            var PlayerFront = "Player" + (p + 1) + "front";
            var PlayerBack = "Player" + (p + 1) + "back";
            var GrandToto = "Player" + (p + 1) + "Grand";
            $("#" + PlayerFront).html(FrontScore);
            $("#" + PlayerBack).html(BackScore);
            $("#" + GrandToto).html(totalScore);


            console.log(totalScore);

            if(totalScore > totPar){
                $("#status" + (p + 1)).html("Bad");
            }
            else if(totalScore <= totPar){
                $("#staus" + (p + 1)).html("Good");
            }

        }


    // }
}

