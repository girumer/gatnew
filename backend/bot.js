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
mongoose.connect('mongodb://localhost:27017/examdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ✅ Register side menu commands (persistent)
bot.setMyCommands([
  { command: 'upgrade_ermp', description: '⚡ Upgrade ERMP exam (300 birr, 1 year)' },
  { command: 'upgrade_ngat', description: '⚡ Upgrade NGAT exam (200 birr, 1 year)' }
]);

// ✅ Inline menu (optional). If you want only side menu, you can remove getMainMenu and its usage.
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
          // NOTE: Consider changing /VIDMATE to /ERMP if that was a placeholder.
          url: `${process.env.FRONTEND_URL}/ERMP?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      }
    ],
    [
      {
        text: '🧪 ERMP Sample',
        web_app: {
          url: `${process.env.FRONTEND_URL}/ERMP?sample=true&phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
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

// ✅ /start: registration + optional inline menu
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const existingUser = await User.findOne({ chatId });
  if (existingUser) {
    return bot.sendMessage(chatId, `👋 Welcome back, ${existingUser.username}!`, {
      reply_markup: { inline_keyboard: getMainMenu(existingUser) } // Remove if you want only side menu
    });
  }

  bot.sendMessage(chatId, '👋 Welcome to All In One Exam!\nPlease share your contact to register:', {
    reply_markup: {
      keyboard: [[{ text: '📱 Send Phone Number', request_contact: true }]],
      one_time_keyboard: true
    }
  });
});

// ✅ Handle registration via contact
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.contact?.phone_number && msg.contact?.first_name) {
    const phoneNumber = msg.contact.phone_number;
    const username = msg.contact.first_name;

    try {
      let user = await User.findOne({ phoneNumber });

      if (user) {
        if (!user.chatId) {
          user.chatId = chatId;
          await user.save();
        }
        bot.sendMessage(chatId, `👋 Welcome back, ${user.username}!`);
      } else {
        user = new User({ username, phoneNumber, chatId });
        await user.save();
        bot.sendMessage(chatId, `✅ Registered successfully as ${username}!`);
      }

      // Optional: show inline menu. If you want only side menu, remove this block.
      bot.sendMessage(chatId, '📚 Choose your exam menu:', {
        reply_markup: { inline_keyboard: getMainMenu(user) }
      });
    } catch (err) {
      console.error('Registration error:', err);
      bot.sendMessage(chatId, '❌ Registration failed. Internal error.');
    }
  }
});

// ✅ Side menu command: Upgrade ERMP
bot.onText(/\/upgrade_ermp/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  bot.sendMessage(
    chatId,
    '💳 To upgrade ERMP for 1 year, deposit 300 birr.\nOnce paid, send your receipt or payment confirmation.'
  );
});

// ✅ Side menu command: Upgrade NGAT
bot.onText(/\/upgrade_ngat/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  bot.sendMessage(
    chatId,
    '💳 To upgrade NGAT for 1 year, deposit 200 birr.\nOnce paid, send your receipt or payment confirmation.'
  );
});
