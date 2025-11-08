const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const User = require('./models/User'); // your model
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/exam-bot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Store temporary user states
const userStates = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  userStates[chatId] = { step: 'askName' };
  bot.sendMessage(chatId, '👋 Welcome to All In One Exam!\nPlease enter your full name to register:');
});

bot.on('message', async (msg) => {
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
      const user = new User({ username, phoneNumber });
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
});
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const choice = query.data;

 if (choice === 'menu_NGAT') {
  bot.sendMessage(chatId, '📝 You selected NGAT. Click below to view the exam list:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📄 View NGAT Exams', url: `${process.env.FRONTEND_URL}/vindimate` }]
      ]
    }
  });
}if (choice === 'menu_ERMP') {
  bot.sendMessage(chatId, '📝 You selected ERMP. Click below to view the Vindimate exam list:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📄 View ERMP Exams', url: `${process.env.FRONTEND_URL}/vindimate` }]
      ]
    }
  });
}

});
