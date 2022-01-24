// 192.168.1.156
var http = require('http');
var fs = require('fs');
const open = require('open');
const si = require('systeminformation');

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
            
            if (formdata == "allOn") {
                allOn();
                form = "All lights are on";
            } else if (formdata == "allOff") {
                allOff();
                form = "All lights are off";
            } else {
                form = "Input recieved: " + formdata;
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


// Create a server that invokes the `handler` function upon receiving a request

http.createServer(handler).listen(8000, "0.0.0.0", function (err) {
    if (err) {
        console.log('Error starting http server');
    } else {
        console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
    };
});