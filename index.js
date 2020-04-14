const Discord = require('discord.js');
const client = new Discord.Client();
const { parsed: Config } = require('dotenv').config();
const prefix = Config.Prefix;

client.on('ready', () => {
    console.log(`Tag: ${client.user.tag}\nTotal Server: ${client.guilds.cache.size}\nTotal Member ${client.users.cache.size}`);
});

client.on('message', async msg => {
    if (!msg.guild) return;
    if (msg.author.bot) return;
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);
    if (command === 'ping') {
        msg.channel.send('Please wait...')
            .then((msg) => {
                msg.edit(`pong!`);
            })
    }
    else if (command === 'avatar') {
        const attachments = new Discord.MessageAttachment()
            .setFile(msg.author.avatarURL())
            .setName(`${msg.author.username}.png`)
        msg.channel.send(attachments);
    }
    else if (command === 'profile') {
        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.avatarURL())
            .setColor('#FFFFFF')
            .setFooter(client.user.tag, client.user.avatarURL())
            .setThumbnail(msg.author.avatarURL())
            .setTimestamp()
            .addField('ID', msg.author.id)
            .addField('NickName', msg.member.nickname)
            .addField('Join Date', msg.member.joinedAt)
            .addField('Account Created', msg.author.createdAt)
        msg.channel.send(embed);
    }
    else if (command === 'server') {
        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.guild.name, msg.guild.iconURL())
            .setColor('#FFFFFF')
            .setFooter(client.user.tag, client.user.avatarURL())
            .setThumbnail(msg.guild.iconURL())
            .setTimestamp()
            .addField('ID', msg.guild.id)
            .addField('Region', msg.guild.region)
            .addField('Server Created', msg.guild.createdAt)
            .addField('System Channel', msg.guild.systemChannel)
            .addField(`AFK Channel [${msg.guild.afkTimeout / 60}分]`, msg.guild.afkChannel)
            .addField('Verification Level', msg.guild.verificationLevel)
            .addField('Members', msg.guild.memberCount)
            .addField(`Roles`, msg.guild.roles.cache.size)
            .addField('Server Owner', msg.guild.owner)
        msg.channel.send(embed);
    }
    else if (command === 'kick') {
        if (!msg.member.hasPermission('KICK_MEMBERS'))
            return msg.channel.send(`You Don't have permission to "KICK_MEMBERS"`);
        if (msg.mentions.members.size !== 1)
            return msg.channel.send('Please specify one member to Kick');
        const member = await msg.mentions.members.first().kick()
        msg.channel.send(`${member.user.tag}をKickしました`);
    }
    else if (command === 'ban') {
        if (!msg.member.hasPermission('BAN_MEMBERS'))
            return msg.channel.send(`You Don't have permission to "BAN_MEMBERS"`);
        if (msg.mentions.members.size !== 1)
            return msg.channel.send('Please specify one member to BAN');
        const member = await msg.mentions.members.first().ban()
        msg.channel.send(`${member.user.tag}をBANしました`);
    }
    else if (command === 'banlist') {
        const bans = await msg.guild.fetchBans()
        const embed = new Discord.MessageEmbed()
            .addField('Banlist', bans.map(ban => ban.user.tag).join(', ') || 'none')
        msg.channel.send(embed);
    }
});

client.login(process.env.Token);