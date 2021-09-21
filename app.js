
import { Telegraf, Markup } from 'telegraf';
import fetch from 'node-fetch';
import gen from 'images-generator';
import util from 'util-format-x';
import getEmoji from 'get-random-emoji'
const token = '1987532512:AAHJ-JFk99qZTnUjAPU_KKb-ekios1yOOTA';
const bot = new Telegraf(token)
import covidApi from 'covid19-api';
import { COUNTRIES_LIST } from './const.js';
import { getMainMenu } from './keyboards.js'


bot.command('menu', (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, `${ctx.from.first_name},выбери желаемый пункт`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "photo", callback_data: "/photo" }, { text: "audio", callback_data: "/audio" }],
          [{ text: "Covid", callback_data: "/covid" }, { text: "help", callback_data: "/help" }],
          [{ text: "weather", callback_data: "/weather" }],

        ]
      }
    });
});

bot.start(ctx => {
  ctx.replyWithHTML(
    `Привет ${ctx.from.first_name}!\n\n` +
    'Welcome в <b>MyBot</b>\n\n',
    getMainMenu())
})

bot.action("/covid", (ctx) => {
  ctx.reply(`   Узнай статистику по Коронавирусу.
    Введи страну на английском языке и получи статистику.
    Получить весь список стран можно по команде /covidList."`)
  bot.on('text', async (ctx) => {
    try {
      const userText = ctx.message.text
      const covidData = await covidApi.getReportsByCountries(userText)
      const countryData = covidData[0][0]
      const formatData = `
               Страна: ${countryData.country},
               Случаи: ${countryData.cases},
               Смерти: ${countryData.deaths},
               Выздоровело: ${countryData.recovered}`
      ctx.reply(formatData)
    } catch (e) {
      ctx.reply('Такой страны не существует, для получения списка стран используй команду /covidList')
    }
  })
});

bot.action("/audio", (ctx) => {
  return ctx.replyWithAudio({ source: "./habib-razryvnaya.mp3_" });
});

bot.action("/photo", async (ctx) => {
  const photoURL = await gen.animal.panda();
  ctx.replyWithPhoto(photoURL, {
    caption: 'Не вздумай сдаваться!Все будет хорошо,но это не точно:)'
  });
});

bot.command("/location", ((ctx) => {
  const requestLocationKeyboard = {
    "reply_markup": {
      "one_time_keyboard": true,
      "keyboard": [
        [{
          text: "My location",
          request_location: true,
          one_time_keyboard: true
        }],
        ['/start']
      ]
    }
  }
  console.log(ctx.from)
  bot.telegram.sendMessage(ctx.chat.id, 'Can we access your location?', requestLocationKeyboard);
  console.log(requestLocationKeyboard)
}))

bot.command("/phone", ((ctx) => {
  const requestPhoneKeyboard = {
    "reply_markup": {
      "one_time_keyboard": true,
      "keyboard": [
        [{
          text: "My phone number",
          request_contact: true,
          one_time_keyboard: true
        }],
        ['/start']
      ]
    }
  };
  console.log(ctx.from)
  bot.telegram.sendMessage(ctx.chat.id, 'Can we get access to your phone number?', requestPhoneKeyboard);
}))

bot.action("/help", ctx => ctx.reply(`
/covid-про ковид в стране
/audio-послушать музыку
/photo-посмотреть фото
/weather-посмотреть погоду
/location-мой адрес
`))

bot.command('covidList', ctx => ctx.reply(COUNTRIES_LIST))

bot.on('voice', ctx => {
  ctx.reply('Какой чудный голос')
})

bot.on('sticker', ctx => {

  ctx.reply(getEmoji())
});

bot.on('edited_message', ctx => {
  ctx.reply('Вы успешно изменили сообщение')
})

bot.launch()

