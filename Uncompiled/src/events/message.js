const Discord = require("discord.js-plus");
const {
	prefix
} = require('../../kosmos.json');
const fs = require("fs");
module.exports = async (client, message) => {
	if (!message.content.startsWith(prefix)) return;
        if (!message.member.id === message.member.id) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
        console.log(command);
	try {
		await client.commands.get(command).execute(client, message, args);
	} catch (error) {
		console.log(error);
	}
}
