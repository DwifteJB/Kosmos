const prompt = require('prompt-sync')({
  sigint: true
});
const fetch = require("node-fetch");
const fs = require("fs");
const {
  isRegExp
} = require('util');
console.clear();
console.log(`
Kòsmos.JS
An Advanced and Private Discord Selfbot
`);

//Global variables
let token;
let prefix;

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
    while (!fs.existsSync(`./kosmos.json`)) {
      setTimeout(function() {}, 200);
    }
  }
  setTimeout(function() {}, 3000);
  const json = JSON.parse(fs.readFileSync(`./kosmos.json`, 'utf8'));
  prefix = json.prefix;
  token = json.token;
}

const Login = async keyPrompt => {
  await isKeyValid(keyPrompt);
  await kosmosJson();

  const Discord = require('discord.js-plus');
  const client = new Discord.Client();
  client.commands = new Discord.Collection();
  const folder = fs
    .readdirSync("src/commands")
    .filter(file => {
      return file.endsWith(".js");
    });
  for (const file of folder) {
    try {
      const command = require(`./src/commands/${file}`);
      const boxCmdName = `${command.name}`.padEnd(20);
      client.commands.set(command.name, command);
    } catch (error) {
      const boxCmdName = `${file}`.padEnd(20);
    }
  }

  fs.readdir("./src/events/", (err, files) => {
    if (err) return console.error;
    for (const file of files) {
      if (!file.endsWith(".js")) return;
      const evt = require(`./src/events/${file}`);
      let evtName = file.split(".")[0];
      client.on(evtName, evt.bind(null, client));
    };
  });

  console.clear();
  process.stdout.write("\x1Bc")
  console.log(Array(process.stdout.rows + 1).join('\n'));
  try {
      await client.login(token);
  } catch {
      console.log("The token in kosmos.json was invalid/had an issue."); 
  }
  if (client.token == undefined) return console.log("The token in kosmos.json was invalid and we couldn't connect to the discord api.");
  
  let Terminal = "On";
  console.log("Kòsmos Terminal, type help for commands!\n\nKòsmos created by DwifteJB and Thunder7Yoshi");
  while (terminal == "On") {
    try {
      let cmd = prompt(`kòsmos:/root/${client.user.id} ${client.user.username}# `)
    } catch (err) {
      return console.log("The token in kosmos.json was invalid and we couldn't connect to the discord api.");
    }
    if (cmd.toLowerCase() == "help") {
      console.log("Help: \n\nExit: Exits the Selfbot\nServers: Shows all the servers your in\nPrefix: Shows your prefix");
    } else if (cmd.toLowerCase() == "exit") {
      // by defining terminal as 'off' it will stop the while loop.
      terminal = "Off"
    } else if (cmd.toLowerCase() == "servers") {
      console.log("Servers:");
      client.guilds.cache.forEach(guild => console.log(`${guild.name} | ${guild.members.cache.size} Members | ${guild.id} ID`))
    } else {
      //  if there is no command with the value of 'cmd' it will display an error message.
      console.log("kòsmos: command could not be found: " + cmd);
    }
  }
}
Login(prompt('Enter your login key: '));
