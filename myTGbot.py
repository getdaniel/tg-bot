from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext, CallbackQueryHandler

TOKEN = "6325001638:AAGsGO6U5ePRhNxlRENJreiH8TFCznhwSvk"

def start(update: Update, context: CallbackContext) -> None:
    user_id = update.effective_user.id
    context.user_data.setdefault(user_id, {})

    update.message.reply_text("Hello! I am DanielBot. Type /help for a list of commands.",
                              reply_markup=get_menu_keyboard())

def help_command(update: Update, context: CallbackContext) -> None:
    update.message.reply_text("You can use the following commands:\n\n"
                              "/help - Display this help message\n"
                              "/start - Start the bot",
                              reply_markup=get_menu_keyboard())

def menu(update: Update, context: CallbackContext) -> None:
    update.message.reply_text("For further assistance, please select one of the options below:", reply_markup=get_inline_menu_keyboard())

def about_daniel(update: Update, context: CallbackContext) -> None:
    about_daniel_text = (
        "Daniel is a software engineer. He graduated from Bahir Dar University with a BSc in Software Engineering. "
        "He has backend skills and is certified in backend web development from ALX."
    )
    # Check if the message content or reply markup has changed
    if (update.callback_query.message.text != about_daniel_text or
            update.callback_query.message.reply_markup != get_inline_menu_keyboard()):
        update.callback_query.edit_message_text(about_daniel_text, reply_markup=get_inline_menu_keyboard())
    else:
        # If there's no change, do nothing to avoid the BadRequest error
        pass

def get_menu_keyboard():
    keyboard = [
        [KeyboardButton("Menu")],
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

def get_inline_menu_keyboard():
    keyboard = [
        [InlineKeyboardButton("Chat with Daniel", url="https://t.me/dgety")],
        [InlineKeyboardButton("About Daniel", callback_data="about_daniel")],
    ]
    return InlineKeyboardMarkup(keyboard, resize_keyboard=True)

def button_callback(update: Update, context: CallbackContext) -> None:
    query = update.callback_query
    query.answer()

    if query.data == "about_daniel":
        about_daniel(update, context)

def main() -> None:
    updater = Updater(TOKEN)
    dispatcher = updater.dispatcher

    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("help", help_command))
    dispatcher.add_handler(MessageHandler(Filters.regex('^(Menu)$'), menu))
    dispatcher.add_handler(CallbackQueryHandler(button_callback))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
