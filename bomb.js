console.log("javascript running");

// NOTE: ON 'HOT' AND 'COLD' WIRES
// 'hot' wire when cut will explode
// all 'cold' wires must be cut to defuse bomb
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");

  var WIRES = ["blue", "green", "red", "white", "yellow"];
  var WIRES_STATE = [0, 0, 0, 0, 0];  // 1 = hot, 0 = cold
  var GAMEOVER = false;
  var TIMEOUTID = "";   // assigned when hot wire is first cut, see explode()
  var SECONDS = 29;
  var MILLIS = 999;

  // ADD CLICK EVENT LISTENERS TO THE 5 WIRES
  for (var i = 0; i < WIRES.length; i++) {
    var el = document.getElementById(WIRES[i]);
    el.addEventListener("click", cut);
  }
  // RESET BUTTON CLICK LISTENER
  document.getElementById("reset-btn").addEventListener("click", reset);

  var intervalSec = setInterval(function () {
    var seconds = document.getElementById("seconds");
    seconds.textContent = SECONDS;
    SECONDS--;
    if (SECONDS < 0) {
      explode(0);
      stopTimers("hard");
    }
  }, 1000);

  var intervalMS = setInterval(function () {
    var millis = document.getElementById("millis");
    millis.textContent = MILLIS;
    if (MILLIS === 100) {
      MILLIS = 999;
    }
    MILLIS--;
  }, 1);

  generateHotWires();

  function generateHotWires () {    // hot wires will explode when cut
    for (var i = 0; i < WIRES.length; i++) {
      if (Math.random() < 0.5) {
        WIRES_STATE[i] = 1;   // 1 is hot
        console.log(WIRES[i] + " is randomly set to HOT");
      }
    }
    console.log(WIRES_STATE);
  }

  // CONDUIT TO EVERYTHING - RUNS WHEN AN UNCUT WIRE IS CLICKED
  function cut (element) {
    if (!GAMEOVER) {  // prevents user from cutting wires if game over
      var el = element.target;
      var index = WIRES.indexOf(el.id);
      update(el, "cut");   // change wire img to cut img
      consequence(index);   // trigger explosion if hot wire is cut
      if (checkDefuse() === true) {
        win();
      }
    }
  }

  // UPDATE CUT WIRE IMG, RETURNS WIRES_STATE INDEX NUMBER
  function update (el, action) {
    var index = WIRES.indexOf(el.id);
    if (action === "cut") {
      WIRES[index] = "cut";  // update array
      var newImgURL = "img/cut-" + el.id + "-wire.png";
      el.src = newImgURL;  // set new img src
    }
    else if (action === "uncut") {  // used only by 'reset' function
      WIRES[index] = el.id;  // reset array
      var newImgURL = "img/uncut-" + el.id + "-wire.png";   // uncut!
      el.src = newImgURL;  // set new img src
    }
  }

  // CHECKS IF A HOT WIRE HAS BEEN CUT
  function consequence (wireIndex) {
    if (WIRES_STATE[wireIndex] === 1) {
      explode(750);
    }
  }

  // CHECKS IF ALL COLD WIRES HAVE BEEN CUT - TRUE/FALSE
  function checkDefuse (option) {
    if (option === "reset") {
      var coldWires = totalColdWires();
      var coldWiresCut = 0;
    }
    var coldWires = totalColdWires();
    var coldWiresCut = 0;
    for (var i = 0; i < WIRES.length; i++) {  // checks every wire
      if (WIRES[i] === "cut" && WIRES_STATE[i] === 0) {
        coldWiresCut++;
      }
    }
    console.log("Total cold: " + coldWires + ", total cut: " + coldWiresCut);
    if (coldWires === coldWiresCut) {
      clearTimeout(TIMEOUTID);  // prevents explosion even if hot wire was cut
      return true;
    }
    else {
      return false;
    }
  }

  // STOPS TIMER FROM RUNNING
  function win () {
    // stop timer
    console.log("win function");
    document.getElementById("timer").classList.add("timer-green");
    stopTimers();
    GAMEOVER = true;
  }

  // RUNS 750ms COUNTDOWN TO EXPLOSION
  function explode (delay) {
    TIMEOUTID = setTimeout(function () {
      document.getElementsByTagName("body")[0].classList.add("exploded");
      GAMEOVER = true;
    }, delay)
  }

  // CALCULATES NUMBER OF HOT WIRES THIS ROUND
  function totalColdWires () {
    // total number of hot wires
    return 5 - WIRES_STATE.filter(function(state) {
      return state === 1;
    }).length;
  }

  // STOP INTERVAL TIMERS FOR TIMER DISPLAY
  function stopTimers (type) {
    clearInterval(intervalSec);
    clearInterval(intervalMS);
    if (type === "hard") {  // hard-set ms timer display to 000
      document.getElementById("millis").textContent = "000";
    }
  }

  function reset () {
    console.log("reset clicked");
    document.getElementById("seconds").textContent = "30";
    document.getElementById("millis").textContent = "000";
    document.getElementsByTagName("body")[0].classList.add("unexploded");
    document.getElementById("timer").classList.add("timer-green");
    GAMEOVER = false;
    WIRES = ["blue", "green", "red", "white", "yellow"];
    WIRES_STATE = [0, 0, 0, 0, 0];
    GAMEOVER = false;
    TIMEOUTID = "";
    SECONDS = 29;
    MILLIS = 999;
    generateHotWires();
    for (var i = 0; i < WIRES.length; i++) {
      var el = document.getElementById(WIRES[i]); // refer to each img element
      update(el, "uncut");
    }
    checkDefuse("reset");  // resets total cold wires count
    console.log("reset WIRES: " + WIRES + ", WIRES_STATE: " + WIRES_STATE);
  }
});
