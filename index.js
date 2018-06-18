const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const timer = {
  pomodoro: {
    minutes: 25,
    timer: null,
    message: ""
  },
  shortBreak: {
    minutes: 5,
    timer: null,
    message: ""
  },
  longBreak: {
    minutes: 10,
    timer: null,
    message: ""
  }
};

const fullCycle = [
  timer.pomodoro.minutes * 1000,
  timer.shortBreak.minutes * 1000,
  timer.pomodoro.minutes * 1000,
  timer.longBreak.minutes * 1000,
  timer.pomodoro.minutes * 1000
];

let cycleIndex = 0;
let cycleLength = fullCycle.length;

const execTimer = () => {
  console.log("executing timer", cycleIndex);

  if (cycleIndex > cycleLength - 1) {
    console.log("done with pomodoro cycle");
    cycleIndex = 0;
  } else {
    setTimeout(() => {
      console.log("resetting timer");
      execTimer();
    }, fullCycle[cycleIndex]);
    cycleIndex++;
  }
};

app.get("/", function(req, res) {
  return res.json(timer);
});

app.put("/", function(req, res) {
  if (!req.body.result || !req.body.result.parameters) return res.status(304);

  const { shortBreak, longBreak, pomodoro } = req.body;

  if (shortBreak) timer["shortBreak"] = shortBreak;
  if (longBreak) timer["longBreak"] = longBreak;
  if (pomodoro) timer["pomodoro"] = pomodoro;

  res.json(timer);
});

app.get("/start-timer", function(req, res) {
  console.log("starting timer params", req.body);

  cycleIndex = 0;
  execTimer();

  res.json(timer);
});

app.listen(3003, () => {
  console.log("listening on 3003");
});
