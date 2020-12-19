const Discord = require("discord.js-plus");
const fs = require("fs");

const { spawn, exec } = require("child_process");
module.exports = async (client, message) => {
	if (!message.content.startsWith(settings.prefix)) return;
	const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	try {
		await client.commands.get(command).execute(client, message, args);
	} catch (error) {
		return;
	}
}
