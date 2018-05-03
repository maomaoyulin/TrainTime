// Prints the current day and time in this particular format.
console.log(moment().format("DD/MM/YY hh:mm A"));

/* global moment firebase */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBb_-jPSqQHScXICZWlki77Fv6Px77bAXc",
    authDomain: "anytime-is-train-time.firebaseapp.com",
    databaseURL: "https://anytime-is-train-time.firebaseio.com",
    projectId: "anytime-is-train-time",
    stordestinationBucket: "anytime-is-train-time.appspot.com",
    messagingSenderId: "339600106471"
};
  
firebase.initializeApp(config);
  
// Create a variable to reference the database
var database = firebase.database();
  
// Initial Values
var firstTrainTime = " ";
var trainName = " ";
var destination = " ";
var frequency = 0;
var trainNumber = 1;
var nextTrain = " ";
var nextTrainFormatted = " ";
var minutesAway = " ";
var firstTrainTimeConverted = " ";
var currentTime = " ";
var diffTime = " ";
var remainder = " ";

// Capture Button Click
$("button").on("click", function(event) {
    event.preventDefault();
  
    // Grabbed values from text boxes
    trainName = $("#trainName").val().trim();
    firstTrainTime = $("#firstTrainTime").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    firstTrainTimeConverted = moment(firstTrainTime, "hh:mm A").subtract(1, "years");
    currentTime = moment();
    diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    remainder = diffTime % frequency;
    minutesAway = frequency - remainder;
    nextTrain = moment().add(minutesAway, "minutes");
    nextTrainFormatted = moment(nextTrain).format("hh:mm A");

    console.log(trainName)
    console.log(firstTrainTime)
    console.log(destination)
    console.log(frequency)
  
    // Code for handling the push
    database.ref().push({
      trainName: trainName,
      firstTrainTime: firstTrainTime,
      destination: destination,
      frequency: frequency,
      nextTrainFormatted: nextTrainFormatted,
      minutesAway: minutesAway,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    trainNumber++

    //Console log all the data in Firebase
    var userLastOnlineRef = firebase.database().ref();
    userLastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
    userLastOnlineRef.on('value', function(snapshot) {
        console.log(snapshot.val());
    });
});

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref().on("child_added", function(snapshot) {
    var sv = snapshot.val();

    // storing the snapshot.val() in a variable for convenience
    var tBody = $("tbody");
    var tRow = $("<tr>");

    // Methods run on jQuery selectors return the selector they we run on
    // This is why we can create and save a reference to a td in the same statement we update its text
    var trainNameTd = $("<td>").text(sv.trainName);
    var destinationTd = $("<td>").text(sv.destination);
    var frequencyTd = $("<td>").text(sv.frequency);
    var nextTrainTd = $("<td>").text(sv.nextTrainFormatted);
    var minutesAwayTd = $("<td>").text(sv.minutesAway);
    
    // Append the newly created table data to the table row
    tRow.append(trainNumber, trainNameTd, destinationTd, frequencyTd, nextTrainTd, minutesAwayTd);
    // Append the table row to the table body
    tBody.append(tRow);

    // Console.loging the last user's data
    console.log(trainNumber)
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.frequency);

    // Change the HTML to reflect
    $("#trainNumber").text(trainNumber);
    $("#trainName").text(sv.trainName);
    $("#destination").text(sv.destination);
    $("#frequency").text(sv.frequency);
    $("#nextTrain").text(sv.nextTrainFormatted);
    $("#minutesAway").text(sv.minutesAway);
    $("#removeBtn").append("<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>");

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code)
});
