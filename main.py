import asyncio
import json

from aiogram import types
from aiogram import Bot, Dispatcher
from aiogram.fsm.context import FSMContext
from aiogram.filters.command import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo

bot = Bot(token="6449618732:AAGxQHGzs00TYuB1qGGMnuFVGsdY45UkDQ4")
dp = Dispatcher()

@dp.message(Command('start'))
async def start(message: types.Message, state: FSMContext):
    user = message.from_user
    username = user.username
    name = user.full_name
    user_id = user.id
    with open("users.txt", "a", encoding='utf-8') as file:
        file.write(f"Username: {username}, Name: {name}, id = {user_id}\n")

    item1 = KeyboardButton(text='Выбрать товар', web_app=WebAppInfo(url='https://exploranss.github.io/'))
    keyboard = ReplyKeyboardMarkup(keyboard=[[item1]], resize_keyboard=True)
    await bot.send_message(message.from_user.id, "Добро пожаловать, Вы можете заказать пасту через бота по кнопке ниже.\nИли напишите менеджеру @lementhet", reply_markup=keyboard, parse_mode="Markdown")

@dp.message()
async def web_app(callback_query: types.CallbackQuery):
    json_data = callback_query.web_app_data.data
    parsed_data = json.loads(json_data)
    message = ""
    for i, item in enumerate(parsed_data['items'], start=1):
        position = int(item['id'].replace('item', ''))
        message += f"Паста {position} - 800 гр.(аналог)\n"
        message += f"Количество: {item['quantity']}\n"
        message += f"Стоимость за единицу: {item['price']} руб.\n"
        message += f"Общая стоимость: {item['price'] * item['quantity']} руб.\n\n"

    message += f"Общая стоимость всех товаров: {parsed_data['totalPrice']} руб."
    user_id = callback_query.from_user.id
    username = callback_query.from_user.username
    await bot.send_message(callback_query.from_user.id, f"""
{message}
Cпасибо за заказ! В ближайшее время с вами свяжется менеджер.
""")

    await bot.send_message('-1002203523203', f"""
новый заказ 
{message}
ID пользователя: {user_id}
Тег пользователя: @{username}
    """)

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())