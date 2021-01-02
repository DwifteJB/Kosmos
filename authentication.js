// Stuff for Developers
// So basically just Thunder and Dwifte
const version = "0.1";
//
const Discord = require('discord.js');
const client = new Discord.Client();
const prompt = require('prompt-sync')({
    sigint: true
});
const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const checkVersion = async () => {
    const ver = await fetch('https://dwiftejb.github.io/KosmosSite/info.json').then(response => response.json());
    if (ver.version > version) {
        console.log(`Version ${version} -> ${ver.version} available!\nChangelog: ${ver.changelog}\nDownload: ${ver.download_link}`);
        process.exit();
    } else {
        console.log(`You're Currently on Version ${version}`);
    }
}
const checkPassword = async parameter => {
    let key = parameter;
    if (key.toLowerCase() == 'cancel') process.exit();
    while (key == '') {
        key = prompt.hide(`Type 'cancel' to abort the process or try again: `);
        if (key.toLowerCase() == 'cancel') process.exit();
    }
    key = Buffer.from(key).toString('base64');

    const passwordJson = await fetch('https://pastebin.com/raw/cSEvhx0g').then(response => response.json());
    const passwords = passwordJson.passwords;

    if (passwords.indexOf(key) != -1) {
        console.log('Access granted!');
    } else {
        console.log('Access denied.');
        process.exit();
    }
}


const checkToken = async parameter => {
    let token = parameter;
    if (token.toLowerCase() == 'cancel') process.exit();
    while (true) {
        if (token.length > 70) {
            token = prompt.hide(`Invalid token: type 'cancel' to abort the process or try again: `);
            if (token.toLowerCase() == 'cancel') process.exit();
        }
        if (token != '') {
            try {
                await client.login(token);
                console.log('Validated!\n')
                await client.destroy();
                break;
            } catch (err) {
                token = prompt.hide(`Invalid token: type 'cancel' to abort the process or try again: `);
                if (token.toLowerCase() == 'cancel') process.exit();
            }
        } else {
            token = prompt.hide(`No token provided: type 'cancel' to abort the process or try again: `);
            if (token.toLowerCase() == 'cancel') process.exit();
        }
    }

    let prefix = prompt('Prefix: ');
    if (prefix.toLowerCase() == 'cancel') process.exit();
    while (prefix == '') {
        prefix = prompt(`No prefix provided: type 'cancel' to abort the process or try again: `);
        if (prefix.toLowerCase() == 'cancel') process.exit();
    }
    console.log('Registered!')

    return fs.writeFileSync('config.json', `{\n    "token": "${token}",\n    "prefix": "${prefix.toLowerCase()}"\n}`);
}


const terminalFunc = async () => {
    const {
        prefix,
        token
    } = require('./config.json');

    rl.question(`kòsmos://root/${client.user.id}/ ${client.user.username}# `, tContent => {
        const tArgs = tContent.toLowerCase().trim().split(/ +/);
        if (tArgs == undefined) console.log('Invalid argument');

        if (tArgs[0] === 'help') {
            console.log('Commands:\n- servers | Displays the servers you\'ve joined\n- userinfo | Displays some of your informations\n- prefix | Displays the current prefix\n- exit | Ends the current process');
        } else if (tArgs[0] === 'servers') {
            let serversArray = [];
            client.guilds.forEach(guild => {
                serversArray.push(`- ${guild.name} | ${guild.id}`);
            });
            console.log(serversArray.join('\n'));
        } else if (tArgs[0] === 'prefix') {
            console.log(`Current prefix is '${prefix}'`);
        } else if (tArgs[0] === 'userinfo') {
            console.log(`${client.user.username}'s informations:\n- Friends: ${client.user.friends.size}\n- ID: ${client.user.id}`);
        } else if (tArgs[0] === 'exit') {
            process.exit();
        } else if (tArgs[0] === 'clear') {
            console.clear();
        } else console.log('No command has been found with that name');
        terminalFunc();
    });
}



const selfbotCode = async () => {

    const {
        prefix,
        token
    } = require('./config.json');

    client.on('message', async message => {

        //Large filter: if the message doesn't start with the prefix or if the author of the message isn't you we'll return
        if (!message.content.startsWith(prefix) || message.author.id !== client.user.id) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        //If command === 'ping'
        if (command === 'ping') {
            //We edited the message we just sent to actually display the client ping
            message.edit(`Latency is ${client.ping}ms.`);
        }

        //Literally the same as dmspam below, LOL
        if (command === 'spam') {
            let times = args[0];
            if (times > 100) times = 100;
            const msg = args.slice(1).join(' ');

            await message.delete(80);

            let i;
            for (i = 0; i < times; i++) {
                message.channel.send(msg);
            }
        }

        if (command === 'massivespam') {
            const msg = args.slice(1).join(' ');

            await message.delete(80);

            let i;
            for (i = 0; i < 9999; i++) {
                message.channel.send(msg);
            }
        }

        //If the command === one of these things != return
        if (command === 'dmspam' || command === 'spamdm' || command === 'pmspam' || command === 'spampm') {
            //Letting member;
            let user;
            //If we have an argument and if it starts without a number member will be equal to the first mention
            if (args[0] && isNaN(args[0])) user = message.mentions.users.first();
            //If we have an argument and if it starts with a number member will be equal to the ID of user provided
            if (args[0] && !isNaN(args[0])) {
                //Defining the member by using ID
                user = client.users.get(args[0]);
            }
            //Defining times and it's equal to the second argument (beacuse the first is the mentioned user)
            let times = args[1];
            //If times is higher than 100, it'll be 100
            if (times > 100) times = 100;
            //The actual text we want to spam will be starting with the second argument
            const msg = args.slice(2).join(' ');

            //Deleting the message
            await message.delete(80);

            //Loop with for
            let i;
            for (i = 0; i < times; i++) {
                //the message will be sending to the user for the desired number of times
                user.send(msg);
            }
        }

        //If the command === one of these things != return
        if (command === 'massivedmspam') {
            //Letting member;
            let user;
            //If we have an argument and if it starts without a number member will be equal to the first mention
            if (args[0] && isNaN(args[0])) user = message.mentions.users.first();
            //If we have an argument and if it starts with a number member will be equal to the ID of user provided
            if (args[0] && !isNaN(args[0])) {
                //Defining the member by using ID
                user = client.users.get(args[0]);
            }
            //The actual text we want to spam will be starting with the second argument
            const msg = args.slice(1).join(' ');

            //Deleting the message
            await message.delete(80);

            //Loop with for
            let i;
            for (i = 0; i < 9999; i++) {
                //the message will be sending to the user for the desired number of times
                user.send(msg);
            }
        }

        //Sends a message and deletes it right after (aka ghostpinging)
        if (command === 'ghostping' || command === 'gp') return message.delete(90);

        if (command === 'avatar' || command === 'av') {
            //Letting member;
            let member;
            //If no args were provided member will be equal to the message author
            if (!args[0]) member = message.author;
            //If we have an argument and if it starts without a number member will be equal to the first mention
            if (args[0] && isNaN(args[0])) member = message.mentions.users.first();
            //If we have an argument and if it starts with a number member will be equal to the ID of user provided
            if (args[0] && !isNaN(args[0])) {
                //Defining the member by using ID
                member = client.users.get(args[0]);
            }

            //Simple embed
            const avatarembed = new Discord.RichEmbed()
                .setColor('#2f3136')
                .setImage(member.displayAvatarURL)
                .setTimestamp()
                .setAuthor(member.tag, member.avatarURL);

            //Sending the embed in the current channel
            return message.channel.send(avatarembed);
        }

        if (command === 'presence') {
            let type;
            //type = args (first argument)
            if (!args[0]) {
              type = '1';
            } else {
              type = args[0];
            }

            ///Checks if the first argument is equal to any of the numbers below, if so it sets the respective Activity type
            if (type === '1') type = 'PLAYING';
            if (type === '2') type = 'STREAMING';
            if (type === '3') type = 'LISTENING';
            if (type === '4') type = 'WATCHING';
            if (type === args[0]) type = 'PLAYING';
            //CHECKING THE ACTIVITY TYPE END

            //What we actually want as Activity (Not type)
            let activity;
            if (!args[1]) {
              activity = 'with myself';
            } else {
              activity = args.slice(1).join(' ');
            }

            //Checks if the first argument is equal to 'reset', if so it sets the Activity to null, (removes it).
            if (args[0] === 'reset') {
                client.user.setActivity(null);
                message.react('✅');
            }

            //Finally sets Activity
            client.user.setActivity(activity, {
                type: type
            })
            message.react('✅');
        }

        if (command === '8ball') {
            //Defining the question using args
            const question = args.join(' ');
            //Defined an Array of possible answers
            const answers = ['It is certain', 'Without a doubt', 'You may rely on it', 'Yes definitely', 'It is decidedly so', 'As I see it, yes', 'Most likely', 'Yes', 'Outlook good', 'Signs point to yes', 'Reply hazy try again', 'Better not tell you now', 'Ask again later', 'Cannot predict now', 'Concentrate and ask again', 'Don’t count on it', 'Outlook not so good', 'My sources say no', 'Very doubtful', 'My reply is no']
            //Randomly choosing one of the answers in the array
            const answer = answers[Math.floor(Math.random() * (answers.length) - 1)];
            //The embed with all the informations
            const eightballembed = new Discord.RichEmbed()
                //This makes it look like the embed doesn't have a border
                .setColor('#2f3136')
                .setDescription(`**${message.author.username}** asked: ${question}\n--------\n🎱 | ${answer}`);
            //If a question wasn't provided we'll reply with the below.
            if (!question) return console.log('Ask me something -_-');
            message.channel.send(eightballembed);
        }

        if (command === 'purge' || command === 'clear') {

            let messagecount = parseInt(args, 10)
            //Fetching up to 100 messages in the current channel
            message.channel.fetchMessages({
                    limit: 100
                })
                .then(messages => {
                    //Defining an array of messages
                    let messageArray = messages.array()
                    messageArray = messageArray.filter(m => m.author.id === config.selfbotid)
                    messageArray.length = messagecount + 1
                    messageArray.map(m => m.delete().catch(console.error))
                })
        }

        if (command === 'uptime' || command === 'up') {

            let totalSeconds = (client.uptime / 1000);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
            const uptime = `${hours}h ${minutes}m ${seconds}s`;

            const uptimeembed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setThumbnail(message.author.displayAvatarURL)
                .setColor('#2f3136')
                .addField('Current uptime:', uptime)
                .addField('Start time:', client.readyAt.toLocaleString())
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp();
            return message.channel.send(uptimeembed);
        }

        if (command === 'eval') {
            const code = args.join(' ')

            try {
                let evaled = eval(code)
                if (typeof evaled !== 'string') {
                    evaled = require('util').inspect(evaled, {
                        depth: 0
                    })
                }
                message.edit(message.content + '\n```js\n' + clean(evaled) + '\n```')
            } catch (err) {
                message.edit(message.content + '\n```css\nERROR:\n' + clean(err) + '\n```')
            }
        }

        function clean(text) {
            if (typeof (text) === 'string') {
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
            } else {
                return text
            }
        }

        if (command === 'google') {
            message.delete(100);
            const googleembed = new Discord.RichEmbed()
                .setTitle('Google Search')
                .setColor('#2f3136')
                .setDescription('[' + args.toString().replace(/,/g, ' ') + '](https://www.google.com/search?hl=en_US&q=' + args.toString().replace(/,/g, '+') + ')');
            message.channel.send(googleembed);
        }

        if (command === 'help') {
            const helpEmbed = new Discord.RichEmbed()
                .setTitle(`${message.author.username}'s commands`)
                .setDescription('**ALL**')
                .addField(`${prefix}spamdm <user/id> <times|max = 100> <message>`, 'DM spams someone')
                .addField(`${prefix}massivedmspam <user/id> <message>`, 'DM spams someone the message 9999 times')
                .addField(`${prefix}spam <times|max = 100> <message>`, 'Spams a message in the current channel')
                .addField(`${prefix}spam <message>`, 'Spams a message in the current channel 9999 times')
                .addField(`${prefix}8ball <question>`, 'Asks the 8ball a question')
                .addField(`${prefix}google <term>`, 'Googles the specified term')
                .addField(`${prefix}avatar [user/id]`, 'Displays someone\'s avatar')
                .addField(`${prefix}uptime`, 'Displays the client\'s uptime')
                .addField(`${prefix}ping`, 'Displays the client\'s ping')
                .addField(`${prefix}ghostping [mention]`, 'Ghostpings a member')
                .addField(`${prefix}eval <code>`, 'Evaluates any string as javascript code')
                .addField(`${prefix}purge/clear <number between 1 and 100>`, 'Deletes the number of messages provided')
                .addField(`${prefix}presence <1/2/3/4> <something>`, `Sets a custom Activity\n**1** = 'PLAYING'\n**2** = 'STREAMING'\n**3** = 'LISTENING'\n**4** = 'WATCHING'`)
                .addField(`${prefix}presence <reset>`, 'Resets the previously set Activity')
                .addField(`${prefix}purge/clear <number from 1 to 99>`, 'Deletes the number of messages you defined from the channel you sent this in')
                .addField(`${prefix}stop`, 'Ends the process')
                .setColor('#2f3136')
                .setThumbnail(message.author.displayAvatarURL)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp();

            message.delete(100);

            message.channel.send(helpEmbed);
        }


        //Ends the bot process by using process.exit();
        if (command === 'stop' || command === 'off') return process.exit();
    });
}


const Main = async () => {
    console.log(`
   __ __                      
  / //_/__  ___ __ _  ___  ___
 / ,< / _ \(_-</  ' \/ _ \(_-<
/_/|_|\___/___/_/_/_/\___/___/
                              
Created by DwifteJB and Thunder7Yoshi`);
    await checkVersion();
    await checkPassword(prompt.hide('Password: '));
    if (!fs.existsSync('./config.json')) {
        console.log('\nSince this is your first time authenticating you must provide some informations.\n');
        await checkToken(prompt.hide('Token: '));
    }
    const {
        token
    } = require('./config.json');
    await client.login(token);
    console.clear();
    terminalFunc();
    selfbotCode();
}
Main();