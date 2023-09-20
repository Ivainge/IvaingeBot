require('dotenv').config();
const fs = require('fs');
const TGApi = require('node-telegram-bot-api');
const bot = new TGApi(process.env.BOT_TOKEN, {polling: true});
const {randomNumberGameOptions, againRandomNumberGameOptions} = require('./options')

let myArray = []

let storagejsonraw = fs.readFileSync('./storage.json');
let storagejson = JSON.parse(storagejsonraw);
myArray = storagejson;

console.log(`Всего добавленных юзеров: ${myArray.length}, ${myArray}`);

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадал цифру от 0 до 9, попробуй её отгадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', randomNumberGameOptions);
}

bot.setMyCommands([
    {command: '/info', description: 'Выдать информацию'},
    {command: '/game', description: 'Поиграть в игру'}
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    let startbotflag = 0; 
    let storagejsonraw = fs.readFileSync('./storage.json');
    let storagejson = JSON.parse(storagejsonraw);
    myArray = storagejson;

    if(text === 'Настрой его как нибудь по другому') {
        await bot.sendMessage(chatId, `ИДИ НАХУЙ`);
    }

    if(text === '/info' || text === '/info@IvaingeBot') {
        await bot.sendMessage(chatId, `Я бот от @Ivainge, сделанный по приколу. GitHub: https://github.com/Ivainge/IvaingeTelegramBot`);
    }

    if(text === '/start') {
        await bot.sendMessage(chatId, `Привет! Я бот от @Ivainge, сделанный по преколу. GitHub: https://github.com/Ivainge/IvaingeTelegramBot`);
    }

    if(text === '/game' || text === '/game@IvaingeBot') {
        return startGame(chatId);
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
        console.log(`Новый пользователь добавлен в бд с chatId ${chatId}`);
        console.log(`Всего добавленных юзеров: ${myArray.length}, ${myArray}`);
    }
});

bot.on('callback_query', msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if(data == '/again') {
        startGame(chatId);
    }
    if(data == chats[chatId]) {
        bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againRandomNumberGameOptions);
    } else {
        bot.sendMessage(chatId, `Ты не угадал, была цифра ${chats[chatId]}`, againRandomNumberGameOptions);
    }
    
})