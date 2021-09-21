
// import {Markup} from 'telegraf/markup.js'
import {  Markup } from 'telegraf';

export function getMainMenu() {
  return Markup.keyboard([
      ['/start'],
      ['/menu'],
      ['/location'],
      ['/phone']
  ]).resize()
}

