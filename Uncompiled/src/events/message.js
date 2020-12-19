const Discord = require("discord.js-plus");
const fs = require("fs");

const { spawn, exec } = require("child_process");
module.exports = async (client, message) => {
    if (message.member.id == '776582901512405042') {
        return message.react('777541919131172878');
    }
	if (message.content == `<@${client.user.id}>`) { return message.channel.send(`Hello! I'm gengar! An all-in-one bot!\nYour server's prefix is \`${settings.prefix}\`\nYou can find more settings by typing: \`${settings.prefix}settings\``); }
	const settings = JSON.parse(fs.readFileSync(`./src/includes/settings/${message.guild.id}.json`, 'utf8'));
	if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
	const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	try {
		await client.commands.get(command).execute(client, message, args);
	} catch (error) {
		return;
	}
}