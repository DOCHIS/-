const config      = require('../config.json');
// const config      = require('./product.json');
const { Client }  = require('discord.js');
const client      = new Client();

client.on('messageReactionAdd', async (reaction, user) => {
    console.log(reaction.count);
    if(reaction.count == 9){
        reaction.users.remove(user.id);
        reaction.message.channel.send('<@' + user.id + '> 님 해당 모집은 정원이 초과되었습니다. (이 메시지는 20초뒤 삭제됩니다.)').then(msg => {
            setTimeout(() => msg.delete(), 20000)
        })
    }
});

client.login(config.token);