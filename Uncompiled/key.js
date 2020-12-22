const fetch = require("node-fetch");

 const prompt = require('prompt-sync')({
   sigint: true		
 });

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fs = require("fs");
const Discord = require('discord.js-plus');
const {
  isRegExp
} = require('util');
const client = new Discord.Client();

client.commands = new Discord.Collection();

console.clear();
console.log(`
Kòsmos.JS
An Advanced and Private Discord Selfbot
`);

//Global variables
let token;
let cmd;
let cmdarg;
let purecmd;
let prefix;

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

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
      await fs.writeFile(`./kosmos.json`, `{\n  "token": "${token}",\n  "prefix": "${prefix}"\n}\n`, () => {});
      console.log("Saved your token and prefix")
    } catch (err) {
      return console.log("\nWe couldn't write to file. Check if you have permission to write in this directory. Otherwise run as root/admin");
    }
  }
  const json = JSON.parse(fs.readFileSync(`./kosmos.json`, 'utf8'));
  prefix = json.prefix;
  token = json.token;
}

const isTokenValid = async token => {
  try {
  await client.login(token);
  //
  } catch {
  //
  }
  if (client.token == undefined) return console.log('Invalid token');

const folder = fs
  .readdirSync("src/commands")
    .filter(file => {
      return file.endsWith(".js");
    });
  console.log("╭────────────────────┬──╮");
  for (const file of folder) {
    try {
    const command = require(`./src/commands/${file}`);
    const boxCmdName = `${command.name}`.padEnd(20);
    console.log(`│${boxCmdName}│✅│`);
    console.log('├────────────────────┼──┤');
    client.commands.set(command.name, command);
    } catch (error) {
      const boxCmdName = `${file}`.padEnd(20);
      console.log(`│${boxCmdName}│❌│`);
      console.log(error)
    }
  }
console.log('╰────────────────────┴──╯');

fs.readdir("./src/events/", (err, files) => {
  if (err) return console.error;
  for (const file of files) {
    if (!file.endsWith(".js")) return;
    const evt = require(`./src/events/${file}`);
    let evtName = file.split(".")[0];
    client.on(evtName, evt.bind(null, client));
  };
  console.log(`Loaded ${files.length} events`)
})

}
const terminal = async () => {
  rl.question(`kòsmos:/root/${client.user.id} ${client.user.username}# `, function(terminalContent) {
  const terminalArgs = terminalContent.toLowerCase().trim().split(/ +/);

  if (terminalArgs == undefined) terminalContent;

  if (terminalArgs.length == 0) {
    console.log(" ");
  } else if (terminalArgs == "help") {
    console.log("Exit: Exits the Selfbot\nServers: Shows all the servers your in\nPrefix: Shows your prefix\nUserinfo: Shows info about you");
  } else if (terminalArgs == "exit") {
    process.exit();
    // literally just dies 
  } else if (terminalArgs == "servers") {
    console.log("Servers:");
    client.guilds.cache.forEach(guild => console.log(`${guild.name} | ${guild.id} ID`))
  } else if (terminalArgs == "prefix") {
    console.log("Prefix: " + prefix);
  } else if (terminalArgs == "userinfo") {
    console.log(`${client.user.username} Info:\nFriends ${client.user.friends.size}\nID: ${client.user.id}\nServers: (use the command servers)`);
  } else {
    //  if there is no command with the value of 'cmd' it will display an error message.
    console.log("kòsmos: command could not be found: " + terminalArgs[0]);
  }
  terminal();
  });
}

const Login = async keyPrompt => {
  await isKeyValid(keyPrompt);
  await kosmosJson();
  await isTokenValid(token);
  //await process.stdout.write("\x1Bc")
  //await console.log(Array(process.stdout.rows + 1).join('\n'));
  await console.log("Kòsmos Terminal, type help for commands!\n\nKòsmos created by DwifteJB and Thunder7Yoshi");
  await terminal();
}

Login(prompt("Login Key: "))
