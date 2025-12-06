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
// ✅ Handle registration via contact AND transaction SMS
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text; // ⬅️ Define 'text' and 'user' at the top of the scope
    let user; // ⬅️ Initialize user here

    // ----------------------------------------------------------------------
    // --- 1. HANDLE CONTACT REGISTRATION (Priority 1) ---
    // ----------------------------------------------------------------------
    if (msg.contact?.phone_number && msg.contact?.first_name) {
        const phoneNumber = msg.contact.phone_number;
        const username = msg.contact.first_name;

        try {
            user = await User.findOne({ phoneNumber }); // Assign to the 'user' variable

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

            // Send main menu
            await bot.sendMessage(chatId, 'Main menu:', {
                reply_markup: buildMainKeyboard(user)
            });
            return; // ⬅️ VITAL: Exit after successful registration
        } catch (err) {
            console.error('Registration error:', err);
            await bot.sendMessage(chatId, '❌ Registration failed. Internal error.');
            return;
        }
    }

    // ----------------------------------------------------------------------
    // --- 2. CHECK FOR REGISTERED USER (Priority 2) ---
    // ----------------------------------------------------------------------
    
    // We only proceed if a user object exists for this chat ID
    if (!user) {
        user = await User.findOne({ chatId });
    }
    
    if (!user) {
        // If the user isn't registered, ignore the message or prompt /start
        if (!text || text.startsWith('/')) return;
        return bot.sendMessage(chatId, '⚠️ Please use /start to register first.');
    }
    
    // ----------------------------------------------------------------------
    // --- 3. AUTO-CONFIRM TRANSACTION (Priority 3) ---
    // ----------------------------------------------------------------------

    // Check if the message is a long text (potential transaction SMS) and not a command
    if (text && text.length > 5000 && !text.startsWith('/')) {
        
        // ⬅️ YOUR TRANSACTION CONFIRMATION LOGIC STARTS HERE 
        
        // Check if the user has a pending intent
        if (!user.lastDepositIntent) {
            // User pasted text without selecting an upgrade option first
            return bot.sendMessage(chatId, 'Please use the /exam_menu or upgrade buttons to begin a transaction.', {
                reply_markup: buildMainKeyboard(user)
            });
        }

        await bot.sendMessage(chatId, '🔍 Checking your transaction details...');

        try {
            // Make sure to import fetch at the top of bot.js if running older Node
            const response = await fetch(`${process.env.BACKEND_URL}/api/transactions/auto-confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    rawMessage: text, 
                    phoneNumber: user.phoneNumber 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await bot.sendMessage(
                    chatId, 
                    `✅ **SUCCESS!** Access to **${data.grantfor}** granted.\n\nTransaction ID: \`${data.transactionNumber}\`\nExpires: ${new Date(data.expires).toLocaleDateString('en-GB')}.\n\nGo to /exam_menu to start.`,
                    { parse_mode: 'Markdown' }
                );
            } else {
                // Handle errors from the backend (e.g., amount mismatch, duplicate)
                await bot.sendMessage(chatId, `❌ **Deposit Failed!**\n\nReason: ${data.error}. Please try again or contact support.`);
            }

        } catch (error) {
            console.error('Backend communication error:', error);
            await bot.sendMessage(chatId, '❌ A connection error occurred. Please try again.');
        }

        return; // ⬅️ VITAL: Exit after processing the potential transaction message
    }

    // ----------------------------------------------------------------------
    // --- 4. CATCH-ALL (Ignore or Default Reply) ---
    // ----------------------------------------------------------------------
    
    // If the message is short, not a command, and not a transaction, we ignore it.
    // return; // Uncomment this if you don't want any further default replies.
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
await user.updateOne({ $set: { lastDepositIntent: 'ERMP' } });
    } else if (choice === 'pay_cbe_ermp') {
      amountDep = 300;
      instructionsMsg = `
🏦 CBE
Account: \`${process.env.CBE_ACCOUNT}\`
Amount: ${amountDep} ብር

Please send the bank SMS/transaction ID or screenshot here.`;
await user.updateOne({ $set: { lastDepositIntent: 'ERMP' } });
    } else if (choice === 'pay_telebirr_ngat') {
      amountDep = 200;
      instructionsMsg = `
📲 TELEBIRR
Account: \`${process.env.TELEBIRR_ACCOUNT}\`
Amount: ${amountDep} ብር

Please send the TeleBirr SMS/transaction ID or screenshot here.`;
await user.updateOne({ $set: { lastDepositIntent: 'NGAT' } });
    } else if (choice === 'pay_cbe_ngat') {
      amountDep = 200;
      instructionsMsg = `
🏦 CBE
Account: \`${process.env.CBE_ACCOUNT}\`
Amount: ${amountDep} ብር

Please send the bank SMS/transaction ID or screenshot here.`;
await user.updateOne({ $set: { lastDepositIntent: 'NGAT' } });
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
