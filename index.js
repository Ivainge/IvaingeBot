require('dotenv').config();
const TGApi = require('node-telegram-bot-api')
const bot = new TGApi(process.env.BOT_TOKEN, {polling: true})

bot.on('message', async msg => {
    let text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    let startbotflag = 0; 

    if(text === '/start') {
        await bot.sendMessage(985471998, `${username} Запустил бота`);
        startbotflag = 1;
    }
    if (startbotflag === 0) {
        await bot.sendMessage(985471998, `${username}: "${text}"`);
    }
    console.log(msg);
})