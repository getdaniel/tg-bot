export default {
    async fetch(request, env, ctx) {
        if (request.method === "POST") {
            const payload = await request.json();
            let response;
            if ('message' in payload && 'text' in payload.message) {
                const chatId = payload.message.chat.id;
                const input = payload.message.text.trim().toLowerCase();
                const user_firstname = payload.message.from.first_name;

                switch (input) {
                    case '/start':
                        const startKeyboard = {
                            keyboard: [
                                [{ text: 'Menu' }]
                            ],
                            resize_keyboard: true
                        };
                        response = `Hello, ${user_firstname}! Welcome to Daniel's Bot! Use /help to explore the bot.`;
                        await this.sendMessageWithCustomKeyboard(env.API_KEY, chatId, response, startKeyboard);
                        return new Response('OK');

                    case '/help':
                        // Provide help information
                        response = `Here are some available commands:\n\n` +
                                   `   /start - Start the bot\n` +
                                   `   /menu - Display the menu\n` +
                                   `   /chatwithdaniel - Leave a message for Daniel\n` +
                                   `   /aboutdaniel - Learn more about Daniel\n` +
                                   `   /help - Display this help message`;
                        await this.sendMessage(env.API_KEY, chatId, response);
                        return new Response('OK');

                    case 'menu':
                        const menuKeyboard = {
                            inline_keyboard: [
                                [{ text: 'Leave Message to Daniel', callback_data: 'chat' }],
                                [{ text: 'Wanna Know About Daniel', callback_data: 'about' }]
                            ]
                        };
                        response = `Choose an option from the menu to proceed further.`;
                        await this.sendMessageWithInlineKeyboard(env.API_KEY, chatId, response, menuKeyboard);
                        return new Response('OK');

                    case 'chat with daniel':
                        // Provide a professional link to the Telegram user @dgety
                        response = `Use https://t.me/dgety to leave a message to Daniel.`;
                        await this.sendMessage(env.API_KEY, chatId, response);
                        return new Response('OK');

                    case 'about daniel':
                        // Provide information about Daniel
                        response = `Daniel is a software engineer.`;
                        await this.sendMessage(env.API_KEY, chatId, response);
                        return new Response('OK');

                    default:
                        // Handle other commands or text input here
                        response = `Sorry, I don't understand that command. Click 'Menu' to see more options.`;
                        await this.sendMessage(env.API_KEY, chatId, response);
                        return new Response('OK');
                }
            } else if ('callback_query' in payload) {
                // Handle callback query from inline keyboard
                const chatId = payload.callback_query.message.chat.id;
                const data = payload.callback_query.data;

                if (data === 'chat') {
                    // Provide a professional link to the Telegram user @dgety
                    response = `Use https://t.me/dgety to leave message to Daniel.`;
                } else if (data === 'about') {
                    // Provide information about Daniel
                    response = `Daniel is a software engineer.`;
                }

                await this.sendMessage(env.API_KEY, chatId, response);
                return new Response('OK');
            }
        }
        return new Response('OK');
    },

    async sendMessage(apiKey, chatId, text) {
        const url = `https://api.telegram.org/bot${apiKey}/sendMessage?chat_id=${chatId}&text=${text}`;
        const data = await fetch(url).then(resp => resp.json());
    },

    async sendMessageWithCustomKeyboard(apiKey, chatId, text, keyboard) {
        const url = `https://api.telegram.org/bot${apiKey}/sendMessage`;
        const body = JSON.stringify({
            chat_id: chatId,
            text: text,
            reply_markup: JSON.stringify(keyboard),
        });

        const headers = {
            'Content-Type': 'application/json',
        };

        const data = await fetch(url, { method: 'POST', headers, body }).then(resp => resp.json());
    },

    async sendMessageWithInlineKeyboard(apiKey, chatId, text, keyboard) {
        const url = `https://api.telegram.org/bot${apiKey}/sendMessage`;
        const body = JSON.stringify({
            chat_id: chatId,
            text: text,
            reply_markup: keyboard,
        });

        const headers = {
            'Content-Type': 'application/json',
        };

        const data = await fetch(url, { method: 'POST', headers, body }).then(resp => resp.json());
    }
};
