const Discord = require('discord.js-plus');
module.exports = {
	name: 'ping',
	description: 'Ping!',
	async execute(client, message, args) {
		message.channel.send('Ping?');
	},
};
