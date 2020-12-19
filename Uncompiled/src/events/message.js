const Discord = require("discord.js-plus");
const {
	prefix
} = require('../../kosmos.json');
const fs = require("fs");
module.exports = async (client, message) => {
	if (!message.content.startsWith(prefix)) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	try {
		await client.commands.get(command).execute(client, message, args);
	} catch (error) {
		return;
	}
}
