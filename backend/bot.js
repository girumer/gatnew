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
  { command: 'upgrade_ermp', description: '⚡ Upgrade ERMP exam' },
  { command: 'upgrade_ngat', description: '⚡ Upgrade NGAT exam' }
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
  // ✅ Replace require with import

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
  { command: 'upgrade_ermp', description: '⚡ Upgrade ERMP exam' },
  { command: 'upgrade_ngat', description: '⚡ Upgrade NGAT exam' }
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
// inside /start when user exists
return bot.sendMessage(chatId, 'Main menu:', {
  reply_markup: {
    inline_keyboard: [
      // top row: Exam Menu
      [{ text: '📚 Exam Menu', callback_data: 'open_exams' }],

      // second row: Upgrade buttons
      [
        { text: '⚡ Upgrade ERMP', callback_data: 'upgrade_ermp_menu' },
        { text: '⚡ Upgrade NGAT', callback_data: 'upgrade_ngat_menu' }
      ],

      // third row: results (web_app)
      [
        {
          text: '📊 View My Results',
          web_app: {
            url: `${process.env.FRONTEND_URL}/result?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
          }
        }
      ]
    ]
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

bot.onText(/\/upgrade_ermp/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  const amountDep = 300; // ERMP deposit

  bot.sendMessage(
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



// ✅ Side menu command: Upgrade NGAT
bot.onText(/\/upgrade_ngat/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  const amountDep = 200; // NGAT deposit

  bot.sendMessage(
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
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const choice = query.data;

  try {
    // Load user
    const user = await User.findOne({ chatId });
    if (!user) {
      await bot.answerCallbackQuery(query.id, { text: 'Please register first using /start', show_alert: true });
      return;
    }

    // Open exam menu and replace keyboard
    if (choice === 'open_exams') {
      const examKeyboard = getMainMenu(user);
      try {
        await bot.editMessageReplyMarkup(
          { inline_keyboard: examKeyboard },
          { chat_id: chatId, message_id: messageId }
        );
      } catch (err) {
        // If edit fails (old message or other), send a new message with the exam keyboard
        await bot.sendMessage(chatId, '📚 Exams:', { reply_markup: { inline_keyboard: examKeyboard } });
      }
      await bot.answerCallbackQuery(query.id);
      return;
    }

    // Payment instructions builder
    let instructionsMsg = '';
    let amountDep = 0;
    let exam = '';
    let method = '';

    // ERMP — TeleBirr
    if (choice === 'pay_telebirr_ermp') {
      exam = 'ERMP';
      method = 'telebirr';
      amountDep = 300;
      instructionsMsg = `
📲 ማኑዋል ዲፖዚት መመሪያ ቴሌብር
Account: \`${process.env.TELEBIRR_ACCOUNT}\`
ዲፖዚት መጠን: ${amountDep} ብር

1\\. ከላይ ባለው ቁጥር TeleBirr በመጠቀም ${amountDep} ብር ያስገቡ
2\\. ብሩን ስትልኩ የከፈላችሁበትን መረጃ የያዘ sms ይደርሳችኋል
3\\. የደረሳችሁን ትራንዛክሸን ቁጥር ብቻ ኮፒ አርጋችሁ ወደዚህ ቦት ይላኩ
⚠️ አስፈላጊ ማሳሰቢያ:
• ከTeleBirr የደረሳችሁን sms ሙሉዉን መላክ ያረጋግጡ
[እዚህ ይጫኑ](${process.env.SUPPORT_GROUP}) ለእገዛ ቪዲዮ`;
    }

    // ERMP — CBE
    if (choice === 'pay_cbe_ermp') {
      exam = 'ERMP';
      method = 'cbe';
      amountDep = 300;
      instructionsMsg = `
🏦 ማኑዋል ዲፖዚት መመሪያ CBE
Account: \`${process.env.CBE_ACCOUNT}\`
ዲፖዚት መጠን: ${amountDep} ብር

1\\. ከላይ ባለው ቁጥር CBE በመጠቀም ${amountDep} ብር ያስገቡ
2\\. ብሩን ስትልኩ የከፈላችሁበትን መረጃ የያዘ sms ይደርሳችኋል
3\\. የደረሳችሁን ትራንዛክሸን ቁጥር ብቻ ኮፒ አርጋችሁ ወደዚህ ቦት ይላኩ
⚠️ አስፈላጊ ማሳሰቢያ:
• ከCBE sms ሙሉዉን መላክ ያረጋግጡ
[እዚህ ይጫኑ](${process.env.SUPPORT_GROUP}) ለእገዛ ቪዲዮ`;
    }

    // NGAT — TeleBirr
    if (choice === 'pay_telebirr_ngat') {
      exam = 'NGAT';
      method = 'telebirr';
      amountDep = 200;
      instructionsMsg = `
📲 ማኑዋል ዲፖዚት መመሪያ ቴሌብር
Account: \`${process.env.TELEBIRR_ACCOUNT}\`
ዲፖዚት መጠን: ${amountDep} ብር

1\\. ከላይ ባለው ቁጥር TeleBirr በመጠቀም ${amountDep} ብር ያስገቡ
2\\. ብሩን ስትልኩ የከፈላችሁበትን መረጃ የያዘ sms ይደርሳችኋል
3\\. የደረሳችሁን ትራንዛክሸን ቁጥር ብቻ ኮፒ አርጋችሁ ወደዚህ ቦት ይላኩ
⚠️ አስፈላጊ ማሳሰቢያ:
• ከTeleBirr የደረሳችሁን sms ሙሉዉን መላክ ያረጋግጡ
[እዚህ ይጫኑ](${process.env.SUPPORT_GROUP}) ለእገዛ ቪዲዮ`;
    }

    // NGAT — CBE
    if (choice === 'pay_cbe_ngat') {
      exam = 'NGAT';
      method = 'cbe';
      amountDep = 200;
      instructionsMsg = `
🏦 ማኑዋል ዲፖዚት መመሪያ CBE
Account: \`${process.env.CBE_ACCOUNT}\`
ዲፖዚት መጠን: ${amountDep} ብር

1\\. ከላይ ባለው ቁጥር CBE በመጠቀም ${amountDep} ብር ያስገቡ
2\\. ብሩን ስትልኩ የከፈላችሁበትን መረጃ የያዘ sms ይደርሳችኋል
3\\. የደረሳችሁን ትራንዛክሸን ቁጥር ብቻ ኮፒ አርጋችሁ ወደዚህ ቦት ይላኩ
⚠️ አስፈላጊ ማሳሰቢያ:
• ከCBE sms ሙሉዉን መላክ ያረጋግጡ
[እዚህ ይጫኑ](${process.env.SUPPORT_GROUP}) ለእገዛ ቪዲዮ`;
    }

    // If a payment branch matched, send instructions and optionally log to DB
    if (instructionsMsg) {
      await bot.sendMessage(chatId, instructionsMsg, { parse_mode: 'Markdown' });

      // Optional: record user's intent in DB for tracking
      // await User.updateOne(
      //   { chatId },
      //   { $set: { lastDepositIntent: { exam, method, amount: amountDep, at: new Date() } } }
      // );

      // Acknowledge selection (removes spinner)
      await bot.answerCallbackQuery(query.id, { text: 'Instructions sent. Please follow the steps.' });
      return;
    }

    // If we reach here, unknown callback_data
    await bot.answerCallbackQuery(query.id, { text: 'Unknown action', show_alert: false });
  } catch (err) {
    console.error('callback_query error:', err);
    await bot.answerCallbackQuery(query.id, { text: 'Something went wrong', show_alert: true });
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

bot.onText(/\/upgrade_ermp/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  const amountDep = 300; // ERMP deposit

  bot.sendMessage(
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



// ✅ Side menu command: Upgrade NGAT
bot.onText(/\/upgrade_ngat/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, '⚠️ Please register first using /start');
  }

  const amountDep = 200; // NGAT deposit

  bot.sendMessage(
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
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const choice = query.data;

  try {
    // Load user
    const user = await User.findOne({ chatId });
    if (!user) {
      await bot.answerCallbackQuery(query.id, { text: 'Please register first using /start', show_alert: true });
      return;
    }

    // Open exam menu and replace keyboard
    if (choice === 'open_exams') {
      const examKeyboard = getMainMenu(user);
      try {
        await bot.editMessageReplyMarkup(
          { inline_keyboard: examKeyboard },
          { chat_id: chatId, message_id: messageId }
        );
      } catch (err) {
        // If edit fails (old message or other), send a new message with the exam keyboard
        await bot.sendMessage(chatId, '📚 Exams:', { reply_markup: { inline_keyboard: examKeyboard } });
      }
      await bot.answerCallbackQuery(query.id);
      return;
    }

    // Payment instructions builder
    let instructionsMsg = '';
    let amountDep = 0;
    let exam = '';
    let method = '';

    // ERMP — TeleBirr
    if (choice === 'pay_telebirr_ermp') {
      exam = 'ERMP';
      method = 'telebirr';
      amountDep = 300;
      instructionsMsg = `
📲 ማኑዋል ዲፖዚት መመሪያ ቴሌብር
Account: \`${process.env.TELEBIRR_ACCOUNT}\`
ዲፖዚት መጠን: ${amountDep} ብር

1\\. ከላይ ባለው ቁጥር TeleBirr በመጠቀም ${amountDep} ብር ያስገቡ
2\\. ብሩን ስትልኩ የከፈላችሁበትን መረጃ የያዘ sms ይደርሳችኋል
3\\. የደረሳችሁን ትራንዛክሸን ቁጥር ብቻ ኮፒ አርጋችሁ ወደዚህ ቦት ይላኩ
⚠️ አስፈላጊ ማሳሰቢያ:
• ከTeleBirr የደረሳችሁን sms ሙሉዉን መላክ ያረጋግጡ
[እዚህ ይጫኑ](${process.env.SUPPORT_GROUP}) ለእገዛ ቪዲዮ`;
    }

    // ERMP — CBE
    if (choice === 'pay_cbe_ermp') {
      exam = 'ERMP';
      method = 'cbe';
      amountDep = 300;
      instructionsMsg = `
🏦 ማኑዋል ዲፖዚት መመሪያ CBE
Account: \`${process.env.CBE_ACCOUNT}\`
ዲፖዚት መጠን: ${amountDep} ብር

1\\. ከላይ ባለው ቁጥር CBE በመጠቀም ${amountDep} ብር ያስገቡ
2\\. ብሩን ስትልኩ የከፈላችሁበትን መረጃ የያዘ sms ይደርሳችኋል
3\\. የደረሳችሁን ትራንዛክሸን ቁጥር ብቻ ኮፒ አርጋችሁ ወደዚህ ቦት ይላኩ
⚠️ አስፈላጊ ማሳሰቢያ:
• ከCBE sms ሙሉዉን መላክ ያረጋግጡ
[እዚህ ይጫኑ](${process.env.SUPPORT_GROUP}) ለእገዛ ቪዲዮ`;
    }

    // NGAT — TeleBirr
    if (choice === 'pay_telebirr_ngat') {
      exam = 'NGAT';
      method = 'telebirr';
      amountDep = 200;
      instructionsMsg = `
📲 ማኑዋል ዲፖዚት መመሪያ ቴሌብር
Account: \`${process.env.TELEBIRR_ACCOUNT}\`
ዲፖዚት መጠን: ${amountDep} ብር

1\\. ከላይ ባለው ቁጥር TeleBirr በመጠቀም ${amountDep} ብር ያስገቡ
2\\. ብሩን ስትልኩ የከፈላችሁበትን መረጃ የያዘ sms ይደርሳችኋል
3\\. የደረሳችሁን ትራንዛክሸን ቁጥር ብቻ ኮፒ አርጋችሁ ወደዚህ ቦት ይላኩ
⚠️ አስፈላጊ ማሳሰቢያ:
• ከTeleBirr የደረሳችሁን sms ሙሉዉን መላክ ያረጋግጡ
[እዚህ ይጫኑ](${process.env.SUPPORT_GROUP}) ለእገዛ ቪዲዮ`;
    }

    // NGAT — CBE
    if (choice === 'pay_cbe_ngat') {
      exam = 'NGAT';
      method = 'cbe';
      amountDep = 200;
      instructionsMsg = `
🏦 ማኑዋል ዲፖዚት መመሪያ CBE
Account: \`${process.env.CBE_ACCOUNT}\`
ዲፖዚት መጠን: ${amountDep} ብር

1\\. ከላይ ባለው ቁጥር CBE በመጠቀም ${amountDep} ብር ያስገቡ
2\\. ብሩን ስትልኩ የከፈላችሁበትን መረጃ የያዘ sms ይደርሳችኋል
3\\. የደረሳችሁን ትራንዛክሸን ቁጥር ብቻ ኮፒ አርጋችሁ ወደዚህ ቦት ይላኩ
⚠️ አስፈላጊ ማሳሰቢያ:
• ከCBE sms ሙሉዉን መላክ ያረጋግጡ
[እዚህ ይጫኑ](${process.env.SUPPORT_GROUP}) ለእገዛ ቪዲዮ`;
    }

    // If a payment branch matched, send instructions and optionally log to DB
    if (instructionsMsg) {
      await bot.sendMessage(chatId, instructionsMsg, { parse_mode: 'Markdown' });

      // Optional: record user's intent in DB for tracking
      // await User.updateOne(
      //   { chatId },
      //   { $set: { lastDepositIntent: { exam, method, amount: amountDep, at: new Date() } } }
      // );

      // Acknowledge selection (removes spinner)
      await bot.answerCallbackQuery(query.id, { text: 'Instructions sent. Please follow the steps.' });
      return;
    }

    // If we reach here, unknown callback_data
    await bot.answerCallbackQuery(query.id, { text: 'Unknown action', show_alert: false });
  } catch (err) {
    console.error('callback_query error:', err);
    await bot.answerCallbackQuery(query.id, { text: 'Something went wrong', show_alert: true });
  }
});


