console.log("javascript running");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");

  var WIRES = ["blue", "green", "red", "white", "yellow"];
  var WIRES_STATE = [0, 0, 0, 0, 0];
  var gameOver = false;
  var timeOutID = "";   // assigned when hot wire is first cut, see explode()

  for (var i = 0; i < 5; i++) {
    var el = document.getElementById(WIRES[i]);
    el.addEventListener("click", cut);
    console.log("Added click listener for " + wires[i] + " wire");
  }

  generateHotWires();

  function generateHotWires () {    // hot wires will explode when cut
    for (var i = 0; i < WIRES_STATE.length; i++) {
      if (Math.random() < 0.5) {
        WIRES_STATE[i] = 1;   // 1 is live
        console.log(WIRES[i] + " is randomly set to HOT");
      }
    }
    console.log(WIRES_STATE);
  }

  function cut (element) {
    if (!gameOver) {
      var el = element.target;
      consequence(update(el));
      if (checkDefuse() === true) {
        win();
      }
    }
  }

  function update (el) {
    var index = WIRES.indexOf(el.id);
    WIRES[index] = "cut";  // update array
    console.log("Updated array: " + WIRES);
    var newImgURL = "img/cut-" + el.id + "-wire.png";
    el.src = newImgURL;  // set new img src
    return index;   // WIRES_STATE array index no.
  }

  function consequence (wireIndex) {
    if (WIRES_STATE[wireIndex] === 1) {
      explode();
    }
  }

  function checkDefuse () {
    var coldWires = 5 - totalHotWires();
    var coldWiresCut = 0;
    for (var i = 0; i < WIRES.length; i++) {
      if (WIRES[i] === "cut" && WIRES_STATE[i] === 0) {
        coldWiresCut++;
      }
    }
    console.log("Total cold: " + coldWires + ", total cut: " + coldWiresCut);
    if (coldWires === coldWiresCut) {
      clearTimeout(timeOutID);  // prevents explosion even if hot wire was cut
      return true;
    }
    else {
      return false;
    }
  }

  function win () {
    // stop timer
    console.log("win function");
    document.getElementById("timer").classList.add("timer-green");
    gameOver = true;
  }

  function explode () {
    timeOutID = setTimeout(function () {
      document.getElementsByTagName("body")[0].classList.add("exploded");
      gameOver = true;
    }, 750)
  }

  function totalHotWires () {
    // total number of hot wires
    return WIRES_STATE.filter(function(state) {
      return state === 1;
    }).length;
  }


});
