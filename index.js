require('dotenv').config();
const fs = require('fs');
const TGApi = require('node-telegram-bot-api');
const bot = new TGApi(process.env.BOT_TOKEN, {polling: true});

let myArray = []

let storagejsonraw = fs.readFileSync('./storage.json');
let storagejson = JSON.parse(storagejsonraw);
myArray = storagejson;

console.log(`Всего добавленных юзеров: ${myArray.length}, ${myArray}`);

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    let startbotflag = 0; 
    let storagejsonraw = fs.readFileSync('./storage.json');
    let storagejson = JSON.parse(storagejsonraw);
    myArray = storagejson;

    if(text === '/start') {
        await bot.sendMessage(985471998, `${username} Запустил бота`);
        startbotflag = 1;
    }

    // if (startbotflag === 0) {
    //     await bot.sendMessage(985471998, `${username}: "${text}"`);
    // }

    let flag = 0;
    for(var i=0; i<myArray.length; i++) {
        if(chatId == myArray[i]) {
            flag = 1;
        }
    }

    if(flag == 0) {
        myArray.push(chatId);
        fs.writeFile('./storage.json', JSON.stringify(myArray),
            function (err) {
                if (err) {
                    console.error('Crap happens');
                }
            }
        );
        console.log(`Новый пользователь добавлен в бд с chatId ${chatId}`)
    } else {
        bot.sendMessage(chatId, 'Вы уже добавленны в бд')
    }

    console.log(`Всего добавленных юзеров: ${myArray.length}, ${myArray}`);
});