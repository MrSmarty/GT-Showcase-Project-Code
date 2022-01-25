// PC: 192.168.1.156
var http = require('http');
var fs = require('fs');
const open = require('open');
const si = require('systeminformation');

let values = getJson();
// console.log(values.switches.firePit);
// values.switches.firePit = true;
// fs.writeFileSync(__dirname + '/values.json', JSON.stringify(values, null, 4));

// console.log(getValues());

// Create a function to handle every HTTP request
function handler(req, res) {

    var form = '';

    if (req.method == "GET") {

        form = fs.readFileSync(__dirname + '/index.html', 'utf8');

        //respond
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(form);

    } else if (req.method == 'POST') {

        //read form data
        req.on('data', function (chunk) {
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
                form = "Input recieved: " + formdata;
                var val = formdata.split("&");
                // for (var i = 0; i < val.length; i++) {
                //     values.switches[val[i]] = true;
                // }
                console.log(values.switches[values.switchNames[0]]);

                for (var i = 0; i < values.switchNames.length; i++) {
                    if (val.includes(values.switchNames[i])) {
                        values.switches[values.switchNames[i]] = true;
                    } else {
                        values.switches[values.switchNames[i]] = false;
                    }
                }
                fs.writeFileSync(__dirname + '/values.json', JSON.stringify(values, null, 4));
            }

            //respond
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(form);

        });

    } else {
        res.writeHead(200);
        res.end();
    };

};


function allOn() {
    console.log("All lights are on");
}

function allOff() {
    console.log("All lights are off");
}

function getJson() {
    return json = JSON.parse(fs.readFileSync(__dirname + '/values.json', 'utf8'));
}

function getValues() {
    var on = "values";

    for (var i = 0; i < values.switchNames.length; i++) {
        var name = values.switchNames[i];
        if (values.switches[name] == true) {
            on += "&" + values.switchNames[i];
        }
    }

    return on;
}



// Create a server that invokes the `handler` function upon receiving a request

http.createServer(handler).listen(8000, "0.0.0.0", function (err) {
    if (err) {
        console.log('Error starting http server');
    } else {
        console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
    };
});