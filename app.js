// PC: 192.168.1.156
// Pi: 192.168.1.156:8006
// Pi External: 107.217.165.178:8006
// Hue IP: 192.168.1.111
// Hue manager: 6pLBMl94oEyehpbU1jeKwnGuuuuSpXYzBEiLKMdh

// Application
const http = require("http");
const fs = require("fs");
const colorsys = require("colorsys");
const axios = require("axios");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Backups
const { exec } = require("child_process");
const nrc = require("node-run-cmd");

const bridgeIp = "192.168.1.111";
const username = "6pLBMl94oEyehpbU1jeKwnGuuuuSpXYzBEiLKMdh";

let values = getJson();

if (values.hardware) {
  var Gpio = require("onoff").Gpio;
}

// Get GPIO Pins
if (values.hardware) {
  var pins = [
    new Gpio(4, "out"),
    new Gpio(17, "out"),
    new Gpio(27, "out"),
    new Gpio(22, "out"),
    new Gpio(23, "out"),
  ];
}
updateGPIO();
//updateLights();
backup();

// Create a function to handle every HTTP request
function handler(req, res) {
  var form = "";

  if (req.method == "GET") {
    form = fs.readFileSync(__dirname + "/index.html", "utf8");

    //respond
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(form);
  } else if (req.method == "POST") {
    //read form data
    req.on("data", function (chunk) {
      //grab form data as string
      var formdata = chunk.toString();
      console.log("Formdata: " + formdata);

      if (formdata == "getValues") {
        form = getValues();
      } else if (formdata == "allOn") {
        allOn();
        form = "All lights are on";
      } else if (formdata == "allOff") {
        allOff();
        form = "All lights are off";
      } else {
        if (values.debug == true) {
          form = "Input recieved: " + formdata;
        } else {
          form = "Completed";
        }

        var val = formdata.split("&");

        for (var i = 0; i < values.switchNames.length; i++) {
          values.switches[values.switchNames[i]] = false;
        }
        for (var i = 0; i < values.waterfallNames.length; i++) {
          values.waterfalls[values.waterfallNames[i]] = false;
        }

        for (var i = 0; i < val.length; i += 2) {
          if (val[i].substring(0, 5) != "water") {
            values.switches[val[i]] = true;
            values.switchColors[val[i]] = val[i + 1];
          } else {
            values.waterfalls[val[i]] = true;
            i--;
          }
        }
        fs.writeFileSync(
          __dirname + "/values.json",
          JSON.stringify(values, null, 4)
        );
      }
      updateGPIO();
      updateLights();

      //respond
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(form);
    });
  } else {
    res.writeHead(200);
    res.end();
  }
}

//#region All On/Off

function allOn() {
  for (var i = 0; i < values.switchNames.length; i++) {
    values.switches[values.switchNames[i]] = true;
  }
  for (var i = 0; i < values.waterfallNames.length; i++) {
    values.waterfalls[values.waterfallNames[i]] = true;
  }

  fs.writeFileSync(__dirname + "/values.json", JSON.stringify(values, null, 4));
  console.log("Everything Is On");
}

function allOff() {
  for (var i = 0; i < values.switchNames.length; i++) {
    values.switches[values.switchNames[i]] = false;
  }
  for (var i = 0; i < values.waterfallNames.length; i++) {
    values.waterfalls[values.waterfallNames[i]] = false;
  }
  fs.writeFileSync(__dirname + "/values.json", JSON.stringify(values, null, 4));
  console.log("Everything Is Off");
}

//#endregion

function updateGPIO() {
  for (var i = 0; i < values.waterfallNames.length; i++) {
    if (values.waterfalls[values.waterfallNames[i]] == true) {
      if (values.hardware) {
        pins[values.waterfallIndex[values.waterfallNames[i]]].writeSync(1);
      }
    } else {
      if (values.hardware) {
        pins[values.waterfallIndex[values.waterfallNames[i]]].writeSync(0);
      }
    }
  }
}

//#region Basic Light Functions

const manageLight = async (id, hex, value) => {
  const url =
    "http://" + bridgeIp + "/api/" + username + "/lights/" + id + "/state";
  var hsv = getHSV(hex);
  console.log(hsv);

  try {
    return await axios.put(url, {
      on: value,
      hue: hsv.h,
      sat: hsv.s,
      bri: hsv.v,
    });
  } catch (err) {
    console.error(err);
  }
};

function updateLights() {
  for (var i = 0; i < values.switchNames.length; i++) {
    console.log(values.areas[values.switchNames[i]].ids.length);
    for (var k = 0; k < values.areas[values.switchNames[i]].ids.length; k++) {
      manageLight(
        values.areas[values.switchNames[i]].ids[k],
        values.switchColors[values.switchNames[i]],
        values.switches[values.switchNames[i]]
      );
    }
  }
}

//#endregion

//#region Light Functions
async function loop(colors, lights, interval, runtime) {
  var iterations = runtime / interval;
  var colorIndex = 0;
  for (var i = 0; i < iterations; i++) {
    for (var k = 0; k < lights.length; k++) {
      manageLight(lights[k], colors[colorIndex], true);
    }
    if (colorIndex == colors.length - 1) colorIndex = 0;
    else colorIndex++;

    await delay(interval);
  }
}
//#endregion

loop(
  ["FF0000", "888800", "00FF00", "008888", "0000FF", "880088"],
  [1, 2],
  500,
  25000
);

function getJson() {
  return (json = JSON.parse(
    fs.readFileSync(__dirname + "/values.json", "utf8")
  ));
}

function getValues() {
  var on = "values";

  for (var i = 0; i < values.switchNames.length; i++) {
    var name = values.switchNames[i];
    on +=
      "&" +
      values.switchNames[i] +
      "&" +
      values.switchColors[name] +
      "&" +
      values.switches[name];
  }
  for (var i = 0; i < values.waterfallNames.length; i++) {
    var name = values.waterfallNames[i];
    on += "&" + values.waterfallNames[i] + "&" + values.waterfalls[name];
  }

  console.log("getValues: " + on);

  return on;
}

function getHSV(hex) {
  var hsv = colorsys.hex2Hsv(hex);
  // console.log(hsv);
  hsv.h = Math.round(hsv.h * 182);
  hsv.s = Math.round(hsv.s * 2.54);
  hsv.v = Math.round(hsv.v * 2.54);
  // console.log(hsv);
  return hsv;
}

//#region Start Server

// Create a server that invokes the `handler` function upon receiving a request
var port;
if (values.hardware) {
  port = 8006;
} else {
  port = 8000;
}
http.createServer(handler).listen(port, "0.0.0.0", function (err) {
  if (err) {
    console.log("Error starting http server");
    if (values.hardware) {
      pins[0].writeSync(0);
    }
  } else {
    console.log(
      "Server running at http://127.0.0.1:%d/ or http://localhost:%d/",
      port,
      port
    );
    if (values.hardware) {
      pins[0].writeSync(1);
    }
  }
});

//#endregion

//#region exit

function clean() {
  if (values.hardware) {
    for (var i = 0; i < pins.length; i++) {
      pins[i].writeSync(0);
    }
  }
}

function backup() {
  // Linux
  exec("git add *");
  exec("git commit -m 'backup'");
  exec("git push");

  // Windows
  nrc.run("git add *");
  nrc.run("git commit -m 'backup'");
  nrc.run("git push");

  // Log
  console.log("backup complete");
}

// Handle application Quit
process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
  backup();
  clean();
  if (options.cleanup) clean();
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
//#endregion
