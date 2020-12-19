const prompt = require('prompt-sync')({
  sigint: true
});
const fetch = require("node-fetch");
const fs = require("fs");
console.clear();
console.log(`
Kòsmos.JS
An Advanced and Private Discord Selfbot
`);

const isKeyValid = async key => {

  //Checking if the string isn't empty
  let newKey = '';
  if (key.length > 0) newKey = key;
  while (key.length == 0 && newKey.length == 0) {
    newKey = prompt('You didn\'t enter a key. Try again: ');
  }

  //Checking if the key is equal to the one on the server
  const encryptedKey = Buffer.from(newKey).toString('base64');
  const fetchPromise = await fetch('http://www3.dlpika.ml/codes.json').then(async response => {
    const jsonResponse = await response.json();
    let doWeHaveItOrNot;
    for (key in jsonResponse.keys) {
      jsonResponse.keys.indexOf(encryptedKey) ? doWeHaveItOrNot = false : doWeHaveItOrNot = true;
    }
    if (!doWeHaveItOrNot) {
      console.log('\nInvalid key | Aborting...');
      process.exit();
    } else console.log(`\nWelcome! You have been verified.`);
  })
}

const kosmosJson = async () => {
  if (!fs.existsSync(`./kosmos.json`)) {
    console.log('Since this is your first time using Kósmos, you\'ll have to set it up!');
    const token = prompt("What's your token? ");
    const prefix = prompt('Choose a prefix: ')
    try {
      fs.writeFile(`./kosmos.json`, `{\n  "token": "${token}",\n  "prefix": "${prefix}"\n}\n`, () => {})
    } catch (err) {
      return console.log("\nWe couldn't write to file. Check if you have permission to write in this directory. Otherwise run as root/admin");
    }
  }
}

const Login = async keyPrompt => {
  await isKeyValid(keyPrompt);
  kosmosJson();
}

Login(prompt('Enter your login key: '));