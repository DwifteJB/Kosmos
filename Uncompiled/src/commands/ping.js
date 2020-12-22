const Discord = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Ping!',
	async execute(client, message, args) {
		const msg = await message.channel.send('Ping?');
		msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms.`)
	},
};
