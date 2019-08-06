$( document ).ready(function() {
    // initialize firebase
    
    
      var config = {
        apiKey: "AIzaSyBM2jWV4qiy-OtJSXzR5jPkSXIGjq5UWZU",
        authDomain: "trainschedule-b1b56.firebaseapp.com",
        databaseURL: "https://trainschedule-b1b56.firebaseio.com",
        projectId: "trainschedule-b1b56",
        storageBucket: "trainschedule-b1b56.appspot.com",
        messagingSenderId: "401275841666",
        appID: "1:401275841666:web:d5707cd9c0bfbdd0",
      };
      // Initialize Firebase
      firebase.initializeApp(config);
    
    // var for data base
     var database = firebase.database();
    
    // button to submit the user input
    $("#trainInfoBtn").on("click", function(event) {
        event.preventDefault();
    
        //set user input values to vars
        var trainName = $("#name").val().trim();
        var destination = $("#dest").val().trim();
    
        //converts user input to usable info
        var firstTime = moment($("#firstTime").val().trim(), "hh:mm").subtract(1, "years").format("X");
    
        var frequency = $("#freq").val().trim();
        
        //current time
        var currentTime = moment();
        console.log("CURRENT TIME: " +  moment(currentTime).format("hh:mm"));
    
        console.log(trainName);
    
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
    
    //figure out what this does
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    
            console.log(childSnapshot.val());
            //store in variables
            var trainName = childSnapshot.val().train;
            var destination =childSnapshot.val().trainGoing;
            var firstTime = childSnapshot.val().trainComing;
            var frequency = childSnapshot.val().everyXMin;
    
            //makes first train time neater
            var trainTime = moment.unix(firstTime).format("hh:mm");
            //calculate difference between times
            var difference =  moment().diff(moment(trainTime),"minutes");
    
            //time apart(remainder)
            var trainRemain = difference % frequency;
    
            //minutes until arrival
            var minUntil = frequency - trainRemain;
    
            //next arrival time
            var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');
    
            //adding info to DOM table 
            $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minUntil + "</td></tr>");
    
    });
    });
    
    