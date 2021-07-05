const config      = require('../config.json');
// const config      = require('./product.json');
const { Client }  = require('discord.js');
const client      = new Client();

client.on('messageReactionAdd', async (reaction, user) => {
    console.log(reaction.count);
    if(reaction.count == 10){
        reaction.users.remove(user.id);
        reaction.message.channel.send('<@' + user.id + '> 님 해당 모집은 정원이 초과되었습니다. (이 메시지는 60초뒤 삭제됩니다.)').then(msg => {
            setTimeout(() => msg.delete(), 600000)
        })
    } else {
        const emoji     = reaction.emoji;
        const snowflake = emoji.id ? `<:${emoji.name}:${emoji.id}>` : emoji.name;
        const reference = reaction.message.content.split('\n')[0];
        client.channels.cache.get('861620612723769374').send(`<@${user.id}> 님이 "${reference}"에 [${snowflake}]를 표시`);
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    const emoji     = reaction.emoji;
    const snowflake = emoji.id ? `<:${emoji.name}:${emoji.id}>` : emoji.name;
    const reference = reaction.message.content.split('\n')[0];
    client.channels.cache.get('861620612723769374').send(`<@${user.id}> 님이 "${reference}"에 [${snowflake}]를 표시를 삭제함`);
});

client.login(config.token);