const prompt = require('prompt-sync')({sigint: true});
const fetch = require("node-fetch");
const fs = require("fs");
console.clear();
console.log(`

Kòsmos.JS
An Advanced and Private Discord Selfbot

`);
const unencry = prompt("Enter Your Key: ");
if (unencry.length == 0) { return console.log("You didn't enter anything!"); }
const encrypt = Buffer.from(unencry).toString('base64');
const fetchPromise = fetch("http://www3.dlpika.ml/codes.json");
fetchPromise.then(response => {
  return response.json();
}).then(bruh => {
  console.log("Confirming Identity..");
  for (i in bruh.keys) {
    if (bruh.keys[i] == encrypt) {
       console.clear();
       console.log(`

Kòsmos.JS
An Advanced and Private Discord Selfbot

       `)
       console.log("Welcome! You have been verified.");
       confirm = "yes";
    }
  }
  try { 
    if (confirm == null) { }
  } catch {
    return console.log("We couldn't verify that key");
  }
  if (!fs.existsSync(`./kosmos.json`)) {
    console.log("Welcome to Kósmos Selfbot!\nSince this is your first time using Kósmos, you'll have to set it up!\nToken: ")
    const token = prompt("");
    console.log("Prefix: ")
    const prefix = prompt("");
    fs.writeFile(`./kosmos.json`, `{\n  "token": "${token}",\n  "prefix": "${prefix}"\n}\n`, () => {})
  }
  if (!fs.existsSync(`./kosmos.json`)) { return console.log("\nWe couldn't write to file. Check if you have permission to write in this directory. Otherwise run as root/admin"); }
});
