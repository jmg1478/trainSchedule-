$(document).ready(function() {
  // initialize firebase

  var config = {
    apiKey: "AIzaSyBM2jWV4qiy-OtJSXzR5jPkSXIGjq5UWZU",
    authDomain: "trainschedule-b1b56.firebaseapp.com",
    databaseURL: "https://trainschedule-b1b56.firebaseio.com",
    projectId: "trainschedule-b1b56",
    storageBucket: "trainschedule-b1b56.appspot.com",
    messagingSenderId: "401275841666",
    appID: "1:401275841666:web:d5707cd9c0bfbdd0"
  };
  // Initialize Firebase
  firebase.initializeApp(config);

  // var for data base
  var database = firebase.database();

  console.log("db", database);

  // Attach an asynchronous callback to read the data at our posts reference
  database.ref().on(
    "value",
    function(snapshot) {
      console.log("snapshotval", snapshot.val());
    },
    function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );

  $("#clearEntries").on("click", e => {
    e.preventDefault();

    console.log("clearing entries");
    database
      .ref()
      .remove()
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  });
  // button to submit the user input
  $("#trainInfoBtn").on("click", function(event) {
    event.preventDefault();

    //set user input values to vars
    var trainName = $("#name")
      .val()
      .trim();
    var destination = $("#dest")
      .val()
      .trim();

    //converts user input to usable info
    const [hour, minutes] = $("#firstTime")
      .val()
      .trim()
      .split(":");

    const firstTime = moment()
      .hour(hour)
      .minute(minutes)
      .unix();

    var frequency = $("#freq")
      .val()
      .trim();

    //var that will gather new input by user
    var newTrain = {
      train: trainName,
      trainGoing: destination,
      trainComing: firstTime,
      everyXMin: frequency
    };

    //uploads new info to firebase
    database.ref().push(newTrain);

    //clear elements
    $("#name").val("");
    $("#dest").val("");
    $("#firstTime").val("");
    $("#freq").val("");

    return false;
  });

  // figure out what this does
  // Note: firebase js library establishes a real-time connection to your database, and this is just an event listener for whenever new data is added
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    //store in variables
    const trainName = childSnapshot.val().train;
    const destination = childSnapshot.val().trainGoing;
    const firstTime = childSnapshot.val().trainComing;
    const frequency = childSnapshot.val().everyXMin;

    const trainTime = moment.unix(firstTime);

    // check if firstTime is in the past
    // if its in the past, then find the next frequency difference from now
    // if not, calculate time until it runs from now

    let nextArrival;
    let minUntil;

    if (trainTime.isAfter(moment())) {
      console.log(`First train run time is in the future`);
      minUntil = trainTime.diff(moment(), "minutes");
      nextArrival = trainTime;
      console.log("db", minUntil, nextArrival);
    } else {
      console.log(
        `First train already passed, let's calculate the difference!`
      );

      const difference = moment().diff(trainTime, "minutes");
      const timeRemaining = frequency - (difference % frequency);

      nextArrival = moment().add(timeRemaining, "minutes");
      minUntil = moment(nextArrival).diff(moment(), "minutes");
    }

    //adding info to DOM table
    $("#trainTable > tbody").append(
      "<tr><td>" +
        trainName +
        "</td><td>" +
        destination +
        "</td><td>" +
        frequency +
        "</td><td>" +
        moment(nextArrival).format("ddd, hh:mm a") +
        "</td><td>" +
        minUntil +
        "</td></tr>"
    );
  });
});
    
    