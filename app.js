// PC: 192.168.1.156
// Pi: 192.168.1.156:8006
// Pi External: 107.217.165.178:8006
var http = require("http");
var fs = require("fs");
var Gpio = require('onoff').Gpio;
const open = require("open");
const si = require("systeminformation");

let values = getJson();

// Get GPIO Pins
var pins = [new Gpio(4, 'out'), new Gpio(17, 'out'), new Gpio(27, 'out'), new Gpio(22, 'out'), new Gpio(23, 'out')];
update();

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

        for (var i = 0; i < values.switchNames.length; i++) {
          values.switches[values.switchNames[i]] = true;
        }
        for (var i = 0; i < values.waterfallNames.length; i++) {
          values.waterfalls[values.waterfallNames[i]] = true;
        }

        fs.writeFileSync(
          __dirname + "/values.json",
          JSON.stringify(values, null, 4)
        );
      } else if (formdata == "allOff") {
        allOff();
        form = "All lights are off";

        for (var i = 0; i < values.switchNames.length; i++) {
          values.switches[values.switchNames[i]] = false;
        }
        for (var i = 0; i < values.waterfallNames.length; i++) {
          values.waterfalls[values.waterfallNames[i]] = false;
        }
        fs.writeFileSync(
          __dirname + "/values.json",
          JSON.stringify(values, null, 4)
        );
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
      update();

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

function allOn() {
  console.log("All lights are on");
}

function allOff() {
  console.log("All lights are off");
}

function update() {
  for (var i = 0; i < values.waterfallNames.length; i++) {
    if (values.waterfalls[values.waterfallNames[i]] == true) {
      pins[values.waterfallIndex[values.waterfallNames[i]]].writeSync(1);
    } else {
      pins[values.waterfallIndex[values.waterfallNames[i]]].writeSync(0);
    }
  }
}

function getJson() {
  return (json = JSON.parse(
    fs.readFileSync(__dirname + "/values.json", "utf8")
  ));
}

function getValues() {
  var on = "values";

  for (var i = 0; i < values.switchNames.length; i++) {
    var name = values.switchNames[i];
    if (values.switches[name] == true) {
      on += "&" + values.switchNames[i] + "&" + values.switchColors[name];
    }
  }
  for (var i = 0; i < values.waterfallNames.length; i++) {
    var name = values.waterfallNames[i];
    if (values.waterfalls[name] == true) {
      on += "&" + values.waterfallNames[i];
    }
  }

  console.log("getValues: " + on);

  return on;
}


function switchPin(pin, state) {

}

// Create a server that invokes the `handler` function upon receiving a request

http.createServer(handler).listen(8006, "0.0.0.0", function (err) {
  if (err) {
    console.log("Error starting http server");
    pins[0].writeSync(0);
  } else {
    console.log(
      "Server running at http://127.0.0.1:8000/ or http://localhost:8000/"
    );
    pins[0].writeSync(1);
  }
});

function clean() {

  for (var i = 0; i < pins.length; i++) {
    pins[i].writeSync(0);
  }

}

// Handle application Quit
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.cleanup) clean();
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

