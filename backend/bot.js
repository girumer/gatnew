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

// ✅ Continue with your bot logic...

// Store temporary user states
const userStates = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

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
      const existingUser = await User.findOne({ phoneNumber });

      if (existingUser) {
        bot.sendMessage(chatId, `👋 Welcome back, ${existingUser.username}!`);
      } else {
        const user = new User({ username, phoneNumber,chatId });
        await user.save();
        bot.sendMessage(chatId, `✅ Registered successfully as ${username}!`);
      }

      // Show exam menu
      bot.sendMessage(chatId, '📚 Choose your exam menu:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'cheeres', callback_data: 'menu_NGAT' }],
            [{ text: 'ERMP', callback_data: 'menu_ERMP' }]
          ]
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      bot.sendMessage(chatId, '❌ Registration failed. Internal error.');
    }
  } else {
    bot.sendMessage(chatId, '❌ Invalid contact. Please tap "Send Phone Number" to register.');
  }
});



/* bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const state = userStates[chatId];

  if (!state) return;

  if (state.step === 'askName') {
    userStates[chatId].username = msg.text;
    userStates[chatId].step = 'askPhone';

    bot.sendMessage(chatId, '📱 Please share your phone number:', {
      reply_markup: {
        keyboard: [[{ text: 'Send Phone Number', request_contact: true }]],
        one_time_keyboard: true
      }
    });
  }

  else if (state.step === 'askPhone' && msg.contact) {
    const phoneNumber = msg.contact.phone_number;
    const username = userStates[chatId].username;

    try {
      const user = new User({ username, phoneNumber,chatId });
      await user.save();

      bot.sendMessage(chatId, `✅ Registered successfully as ${username}!`);
      userStates[chatId] = null;

      // Show menu
      bot.sendMessage(chatId, '📚 Choose your exam menu:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'NGAT', callback_data: 'menu_NGAT' }],
            [{ text: 'ERMP', callback_data: 'menu_ERMP' }]
          ]
        }
      });
    } catch (err) {
      bot.sendMessage(chatId, '❌ Registration failed. You might already be registered.');
      userStates[chatId] = null;
    }
  }
}); */
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const choice = query.data;
const user = await User.findOne({ chatId });
  if (choice === 'menu_NGAT') {
    bot.sendMessage(chatId, '📝 You selected NGAT. Click below to view the exam list:', {
      reply_markup: {
        inline_keyboard: [
          [{
  text: '📄 View NGAT Exams',
    web_app: { 
              url: `${process.env.FRONTEND_URL}/NGAT?phone=${encodeURIComponent(user?.phoneNumber || '')}`
            }
}]
        ]
      }
    });
  }

  if (choice === 'menu_ERMP') {
    bot.sendMessage(chatId, '📝 You selected ERMP. Click below to view the Vindimate exam list:', {
      reply_markup: {
        inline_keyboard: [
          [{
  text: '📄 View ERMP Exams',
 web_app: { 
              url: `${process.env.FRONTEND_URL}/VIDMATE?phone=${encodeURIComponent(user?.phoneNumber || '')}`
            }
}]
        ]
      }
    });
  }
});

