/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the next arrival. Using difference between start and current time.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate Total minutes away

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAVfCEv4SrtE2H09kCUBxFDWpPaK7fiTFQ",
    authDomain: "train-schedule-3377e.firebaseapp.com",
    databaseURL: "https://train-schedule-3377e.firebaseio.com",
    projectId: "train-schedule-3377e",
    storageBucket: "train-schedule-3377e.appspot.com",
    messagingSenderId: "311708711184"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var current = moment().format("hh:mm");
  var trainName = $("#train-name-input").val().trim();
  var destInput = $("#dest-input").val().trim();
  var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("HH:mm a");
  var frequency = moment($("#freq-input").val().trim(),"mm").format("mm");
//math computations to determine time logic
  var formated = moment(firstTrain, "hh:mm").subtract(1, "years");
  var diff = moment().diff(moment(formated), "minutes");
  var apart = diff % frequency;
  var minAway = frequency - apart;
  var nextArrival = moment().add(minAway, "minutes").format("hh:mm");

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destInput,
    start: firstTrain,
    rate: frequency,
    nextTrain: minAway,
    nextArrival: nextArrival
  };

  // Uploads the new train data to the database
  database.ref().push(newTrain);

   // Alert
  alert("Your train has been successfully added.");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#first-train-input").val("");
  $("#freq-input").val("");

  // Logs everything to console
  console.log("Train name:" + newTrain.name);
  console.log("destination: " + newTrain.destination);
  console.log("start time: " + newTrain.start);
  console.log("frequency: " + newTrain.rate);
  console.log("Min next train away: " + newTrain.nextTrain);
  console.log("time of next arrival: " + newTrain.nextArrival);


// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destInput = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().start;
  var frequency = childSnapshot.val().rate;  
  var trainArrival = childSnapshot.val().nextArrival;
  var trainAway = childSnapshot.val().nextTrain;

  // train Info
  console.log(trainName);
  console.log(destInput);
  console.log(firstTrain);
  console.log(frequency);
  console.log(trainArrival);
  console.log(trainAway);

  // // Prettify the employee start
  // var firstTrainPretty = moment.unix(firstTrain).format("MM/DD/YY");

  // // Calculate the months worked using hardcore math
  // // To calculate the months worked
  // var empMonths = moment().diff(moment.unix(firstTrain, "X"), "months");
  // console.log(empMonths);

  // // Calculate the total billed rate
  // var empBilled = empMonths * frequency;
  // console.log(empBilled);

  // Add each train's data into the table
  $("#train-schedule > tbody").append("<tr><td>" + trainName + "</td><td>" + destInput + "</td><td>" +
  frequency + " minutes" + "</td><td>" + trainArrival + "</td><td>" + trainAway + " minutes" + "</td><td>");
});

});


