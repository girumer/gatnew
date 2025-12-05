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

// ✅ Register side menu commands (persistent) — includes exam_menu and my_results
bot.setMyCommands([
  { command: 'exam_menu', description: '📚 Open Exam Menu' },
  { command: 'my_results', description: '📊 View My Results' },
  { command: 'upgrade_ermp', description: '⚡ Upgrade ERMP exam' },
  { command: 'upgrade_ngat', description: '⚡ Upgrade NGAT exam' }
]);

// ✅ Inline menu (web_app buttons)
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

// Helper: main menu keyboard with Back to Main above upgrade buttons
function buildMainKeyboard(user) {
  return {
    inline_keyboard: [
      [{ text: '📚 Exam Menu', callback_data: 'open_exams' }],
      [{ text: '🔙 Back to Main', callback_data: 'back_to_main' }], // placed above upgrade buttons
      [
        { text: '⚡ Upgrade ERMP', callback_data: 'upgrade_ermp_menu' },
        { text: '⚡ Upgrade NGAT', callback_data: 'upgrade_ngat_menu' }
      ],
      [
        {
          text: '📊 View My Results',
          web_app: {
            url: `${process.env.FRONTEND_URL}/result?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
          }
        }
      ]
    ]
  };
}

// ✅ /start: registration + main menu
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const existingUser = await User.findOne({ chatId });
    if (existingUser) {
      // Send main menu with Back to Main above upgrade buttons
      await bot.sendMessage(chatId, `👋 Welcome back, ${existingUser.username}!`, {
        reply_markup: buildMainKeyboard(existingUser)
      });
      return;
    }

    // Ask for contact if not registered
    await bot.sendMessage(chatId, '👋 Welcome to All In One Exam!\nPlease share your contact to register:', {
      reply_markup: {
        keyboard: [[{ text: '📱 Send Phone Number', request_contact: true }]],
        one_time_keyboard: true
      }
    });
  } catch (err) {
    console.error('/start error:', err);
    await bot.sendMessage(chatId, '❌ Something went wrong. Please try again later.');
  }
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
        await bot.sendMessage(chatId, `👋 Welcome back, ${user.username}!`);
      } else {
        user = new User({ username, phoneNumber, chatId });
        await user.save();
        await bot.sendMessage(chatId, `✅ Registered successfully as ${username}!`);
      }

      // Send main menu with Back to Main above upgrade buttons
      await bot.sendMessage(chatId, 'Main menu:', {
        reply_markup: buildMainKeyboard(user)
      });
    } catch (err) {
      console.error('Registration error:', err);
      await bot.sendMessage(chatId, '❌ Registration failed. Internal error.');
    }
  }
});

// ✅ Side command: exam_menu (opens the exam inline menu)
bot.onText(/\/exam_menu/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  await bot.sendMessage(chatId, '📚 Choose your exam menu:', {
    reply_markup: { inline_keyboard: getMainMenu(user) }
  });
});

// ✅ Side command: my_results (quick access)
bot.onText(/\/my_results/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  await bot.sendMessage(chatId, '📊 Your results:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📊 Open Results', web_app: { url: `${process.env.FRONTEND_URL}/result?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}` } }]
      ]
    }
  });
});

// Side commands still work (optional)
bot.onText(/\/upgrade_ermp/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  const amountDep = 300; // ERMP deposit

  await bot.sendMessage(
    chatId,
    `💳 To upgrade ERMP for 1 year, deposit ${amountDep} birr.\nChoose your payment method below:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📲 TELEBIRR', callback_data: `pay_telebirr_ermp` },
            { text: '🏦 CBE', callback_data: `pay_cbe_ermp` }
          ]
        ]
      }
    }
  );
});

bot.onText(/\/upgrade_ngat/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  const amountDep = 200; // NGAT deposit

  await bot.sendMessage(
    chatId,
    `💳 To upgrade NGAT for 1 year, deposit ${amountDep} birr.\nChoose your payment method below:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📲 TELEBIRR', callback_data: `pay_telebirr_ngat` },
            { text: '🏦 CBE', callback_data: `pay_cbe_ngat` }
          ]
        ]
      }
    }
  );
});

// ✅ Merged callback_query handler
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const choice = query.data;

  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      await bot.answerCallbackQuery(query.id, { text: 'Please register first using /start', show_alert: true });
      return;
    }

    // Back to Main: send the exam menu (exact behavior you requested)
    if (choice === 'back_to_main') {
      try {
        await bot.sendMessage(chatId, '📚 Choose your exam menu:', {
          reply_markup: { inline_keyboard: getMainMenu(user) }
        });
        await bot.answerCallbackQuery(query.id);
      } catch (err) {
        console.error('back_to_main error:', err);
        await bot.answerCallbackQuery(query.id, { text: 'Could not open menu', show_alert: true });
      }
      return;
    }

    // Open exam menu (edit in place if possible, fallback to send)
    if (choice === 'open_exams') {
      const examKeyboard = getMainMenu(user);
      try {
        await bot.editMessageReplyMarkup({ inline_keyboard: examKeyboard }, { chat_id: chatId, message_id: messageId });
      } catch (err) {
        await bot.sendMessage(chatId, '📚 Exams:', { reply_markup: { inline_keyboard: examKeyboard } });
      }
      await bot.answerCallbackQuery(query.id);
      return;
    }

    // Upgrade menu buttons (edit in place with fallback)
    if (choice === 'upgrade_ermp_menu' || choice === 'upgrade_ngat_menu') {
      const amountDep = choice === 'upgrade_ermp_menu' ? 300 : 200;
      const keyboard = {
        inline_keyboard: [[
          { text: '📲 TELEBIRR', callback_data: choice === 'upgrade_ermp_menu' ? 'pay_telebirr_ermp' : 'pay_telebirr_ngat' },
          { text: '🏦 CBE', callback_data: choice === 'upgrade_ermp_menu' ? 'pay_cbe_ermp' : 'pay_cbe_ngat' }
        ]]
      };

      try {
        await bot.editMessageReplyMarkup(keyboard, { chat_id: chatId, message_id: messageId });
      } catch (err) {
        await bot.sendMessage(chatId, `💳 To upgrade for 1 year, deposit ${amountDep} birr.\nChoose your payment method below:`, { reply_markup: keyboard });
      }

      await bot.answerCallbackQuery(query.id);
      return;
    }

    // Payment instruction branches
    let instructionsMsg = '';
    let amountDep = 0;

    if (choice === 'pay_telebirr_ermp') {
      amountDep = 300;
      instructionsMsg = `
📲 TELEBIRR
Account: \`${process.env.TELEBIRR_ACCOUNT}\`
Amount: ${amountDep} ብር

Please send the TeleBirr SMS/transaction ID or screenshot here.`;
    } else if (choice === 'pay_cbe_ermp') {
      amountDep = 300;
      instructionsMsg = `
🏦 CBE
Account: \`${process.env.CBE_ACCOUNT}\`
Amount: ${amountDep} ብር

Please send the bank SMS/transaction ID or screenshot here.`;
    } else if (choice === 'pay_telebirr_ngat') {
      amountDep = 200;
      instructionsMsg = `
📲 TELEBIRR
Account: \`${process.env.TELEBIRR_ACCOUNT}\`
Amount: ${amountDep} ብር

Please send the TeleBirr SMS/transaction ID or screenshot here.`;
    } else if (choice === 'pay_cbe_ngat') {
      amountDep = 200;
      instructionsMsg = `
🏦 CBE
Account: \`${process.env.CBE_ACCOUNT}\`
Amount: ${amountDep} ብር

Please send the bank SMS/transaction ID or screenshot here.`;
    }

    if (instructionsMsg) {
      await bot.sendMessage(chatId, instructionsMsg, { parse_mode: 'Markdown' });

      // Optional DB log (uncomment and adapt to your schema)
      // await User.updateOne({ chatId }, { $set: { lastDepositIntent: { exam: choice.includes('ermp') ? 'ERMP' : 'NGAT', method: choice.includes('telebirr') ? 'telebirr' : 'cbe', amount: amountDep, at: new Date() } } });

      await bot.answerCallbackQuery(query.id, { text: 'Instructions sent. Please follow the steps.' });
      return;
    }

    // Unknown action
    await bot.answerCallbackQuery(query.id, { text: 'Unknown action', show_alert: false });
  } catch (err) {
    console.error('callback_query error:', err);
    await bot.answerCallbackQuery(query.id, { text: 'Something went wrong', show_alert: true });
  }
});
