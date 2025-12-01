// ✅ Replace require with import
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
// ✅ Load .env
dotenv.config();

// ✅ Create bot
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/exam-bot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
/* function getMainMenu(user) {
  return [
    [{ text: 'cheeres', callback_data: 'menu_NGAT' }],
    [{ text: 'ERMP', callback_data: 'menu_ERMP' }],
    [{
      text: '📊 View My Results',
      web_app: {
        url: `${process.env.FRONTEND_URL}/result?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
      }
    }]
  ];
} */
// ✅ Continue with your bot logic...
function getMainMenu(user) {
  return [
    [
      {
        text: '🧠 NGAT',
        web_app: {
          url: `${process.env.FRONTEND_URL}/NGAT?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      },
      {
        text: '🩺 ERMP',
        web_app: {
          url: `${process.env.FRONTEND_URL}/VIDMATE?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      }
    ],
    [
      {
        text: '🧪 ERMP Sample',
        web_app: {
          url: `${process.env.FRONTEND_URL}/VIDMATE?sample=true&phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      },
      {
        text: '📊 View My Results',
        web_app: {
          url: `${process.env.FRONTEND_URL}/result?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      }
    ]
  ];
}


// Store temporary user states
const userStates = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // ✅ Check if user already exists
  const existingUser = await User.findOne({ chatId });

  if (existingUser) {
    // ✅ User already registered → show menu immediately
    return bot.sendMessage(chatId, `👋 Welcome back, ${existingUser.username}!`, {
      reply_markup: {
        inline_keyboard: getMainMenu(existingUser)
      }
    });
  }

  // ✅ New user → ask for phone number
  bot.sendMessage(chatId, '👋 Welcome to All In One Exam!\nPlease share your contact to register:', {
    reply_markup: {
      keyboard: [[{ text: '📱 Send Phone Number', request_contact: true }]],
      one_time_keyboard: true
    }
  });
});


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.contact && msg.contact.phone_number && msg.contact.first_name) {
    const phoneNumber = msg.contact.phone_number;
    const username = msg.contact.first_name;

    try {
      let user = await User.findOne({ phoneNumber });

      if (user) {
        // ✅ Update old users missing chatId
        if (!user.chatId) {
          user.chatId = chatId;
          await user.save();
        }

        bot.sendMessage(chatId, `👋 Welcome back, ${user.username}!`);
      } else {
        // ✅ Register new user
        user = new User({ username, phoneNumber, chatId });
        await user.save();
        bot.sendMessage(chatId, `✅ Registered successfully as ${username}!`);
      }

      // ✅ MAIN MENU WITH RESULTS BUTTON
    bot.sendMessage(chatId, '📚 Choose your exam menu:', {
  reply_markup: {
    inline_keyboard: getMainMenu(user)
  }
});


    } catch (err) {
      console.error('Registration error:', err);
      bot.sendMessage(chatId, '❌ Registration failed. Internal error.');
    }
  }
});

/* bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const choice = query.data;

  // ✅ Load user safely
  let user = await User.findOne({ chatId });
  if (!user) {
    return bot.sendMessage(chatId, "⚠️ Please register first using /start");
  }

  // ✅ Main menu (first 2 rows)
 const mainMenu = getMainMenu(user);


  // ✅ Spacer row (visual only)
  const spacerRow = [{ text: '────────', callback_data: 'spacer' }];

  // ✅ Child menus
  let childButtons = [];

  if (choice === 'menu_NGAT') {
    childButtons = [
      [{
        text: '📄 View NGAT Exams',
        web_app: {
          url: `${process.env.FRONTEND_URL}/NGAT?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      }]
    ];
  }

  if (choice === 'menu_ERMP') {
    childButtons = [
      [{
        text: '📄 View ERMP Exams',
        web_app: {
          url: `${process.env.FRONTEND_URL}/VIDMATE?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      }]
    ];
  }

  // ✅ Merge keyboard: main menu + spacer + child menu
  const newKeyboard = [...mainMenu, spacerRow, ...childButtons];

  // ✅ Update the message
  await bot.editMessageReplyMarkup(
    { inline_keyboard: newKeyboard },
    { chat_id: chatId, message_id: messageId }
  );

  // ✅ Remove loading animation
  bot.answerCallbackQuery(query.id);
});
 */


