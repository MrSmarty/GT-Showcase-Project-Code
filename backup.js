const { exec } = require("child_process");
const nrc = require("node-run-cmd");

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
