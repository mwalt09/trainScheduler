// Initialize Firebase
var config = {
  apiKey: "AIzaSyDxKoNP-ozTKTTXKqDUFExpgifObck3EbU",
  authDomain: "trainscheduler-bd259.firebaseapp.com",
  databaseURL: "https://trainscheduler-bd259.firebaseio.com",
  projectId: "trainscheduler-bd259",
  storageBucket: "",
  messagingSenderId: "566816897751"
};
firebase.initializeApp(config);

var database = firebase.database();

var train_name = "";
var destination = "";
var first_train = "";
var frequency = "";

$("#submitButton").click(function() {
  // event.preventDefault();

  var trains = database.ref("/trainSchedule");
  var trainSchedule = trains.push();
  trainSchedule.set({
    "train_name": $("#train_name").val().trim(),
    "destination": $("#destination").val().trim(),
    "first_train": $("#first_train").val().trim(),
    "frequency": $("#frequency").val().trim(),

    "dateAdded": firebase.database.ServerValue.TIMESTAMP
  });

});

var trainSchedule = database.ref("/trainSchedule/").orderByChild("dateAdded");

trainSchedule.on("child_added", function(snap) {
  var trainData = snap.val();
  console.log(trainData);

  // test
  var convertedTime = moment(trainData.first_train, "HH:mm").subtract(1, "years");
  console.log(convertedTime);
  // var currentTime = moment();
  // console.log("Current Time: " + currentTime.format("HH:mm"));
  var tDifference = moment().diff(moment(convertedTime), "minutes");
  console.log(tDifference);
  var tRemainder = tDifference % trainData.frequency;
  console.log(tRemainder);
  var tRemainingToNextTrain = trainData.frequency - tRemainder;
  console.log("Minutes to next train: " + tRemainingToNextTrain);
  var timeOfNextTrain = moment().add(tRemainingToNextTrain, "minutes");
  console.log("Arrival: " + moment(timeOfNextTrain).format("HH:mm"));
  // End Test

  $("#tableBody")
    .prepend($("<tr>")
      .append($("<td>").text(trainData.train_name),
        $("<td>").text(trainData.destination),
        // $("<td>").text(trainData.first_train),
        $("<td>").text(trainData.frequency),
        $("<td>").text(timeOfNextTrain.format("HH:mm")),
        $("<td>").text(tRemainingToNextTrain)
      )
    );
});

$("#modalBtn").click(function() {
  $(".modal").modal("open");
});

$("#submitButton").click(function() {
  $(".modal").modal("close");
});
