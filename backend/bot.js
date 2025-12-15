// ✅ Replace require with import
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // Assuming you have User model imported

// ✅ Load .env
dotenv.config();

// ✅ Create bot
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// ✅ Connect to MongoDB


// ✅ Register side menu commands (persistent) — includes exam_menu and my_results
bot.setMyCommands([
  { command: 'exam_menu', description: '📚 Open Exam Menu' },
  { command: 'my_results', description: '📊 View My Results' },
  { command: 'upgrade_ermp', description: '⚡ Upgrade ERMP exam' },
  { command: 'upgrade_ngat', description: '⚡ Upgrade NGAT exam' }
]);

// ----------------------------------------------------------------------
// --- CORE FUNCTIONS ---
// ----------------------------------------------------------------------

// ✅ Inline menu (web_app buttons/callback buttons for checks)
function getMainMenu(user) {
  return [
    [
      {
        text: '🧠 NGAT',
        // NGAT: Use callback_data to check access first
        callback_data: 'check_ngat_access' 
      },
      {
        text: '🩺 ERMP',
        // ERMP: Use callback_data to check access first
        callback_data: 'check_ermp_access' 
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
        text: '📝 NGAT Sample',
        web_app: {
          url: `${process.env.FRONTEND_URL}/NGAT?sample=true&phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      }
    ],
    [
      {
        text: '📊 View My Results',
        web_app: {
          url: `${process.env.FRONTEND_URL}/result?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
        }
      }],
      [
            {
                text: '📣 Join Channel',
                url: process.env.telegram_chanel // Uses the URL directly from .env
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

// ----------------------------------------------------------------------
// --- COMMAND HANDLERS ---
// ----------------------------------------------------------------------

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
        one_time_keyboard: true,
        remove_keyboard: true
      }
    });
  } catch (err) {
    console.error('/start error:', err);
    await bot.sendMessage(chatId, '❌ Something went wrong. Please try again later.');
  }
});

// ✅ Handle registration via contact AND transaction SMS
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let user;

    // --- 1. HANDLE CONTACT REGISTRATION (Priority 1) ---
    if (msg.contact?.phone_number && msg.contact?.first_name) {
        const phoneNumber = msg.contact.phone_number;
        const username = msg.contact.first_name;

        try {
            user = await User.findOne({ phoneNumber });
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
            return;
        } catch (err) {
            console.error('Registration error:', err);
            await bot.sendMessage(chatId, '❌ Registration failed. Internal error.');
            return;
        }
    }

    // --- 2. CHECK FOR REGISTERED USER (Priority 2) ---
    if (!user) {
        user = await User.findOne({ chatId });
    }
    
    if (!user) {
        if (!text || text.startsWith('/')) return;
        return bot.sendMessage(chatId, '⚠️ Please use /start to register first.');
    }
    
    // --- 3. AUTO-CONFIRM TRANSACTION (Priority 3) ---
    if (text && text.length > 20 && !text.startsWith('/')) {
        if (!user.lastDepositIntent) {
            return bot.sendMessage(chatId, 'Please use the /exam_menu or upgrade buttons to begin a transaction.', {
                reply_markup: buildMainKeyboard(user)
            });
        }

        await bot.sendMessage(chatId, '🔍 Checking your transaction details...');

        try {
            const response = await fetch(`${process.env.FRONTEND_URL}/api/transactions/auto-confirm`, {
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
                    data.message, // Use the complete, pre-formatted message string
                    { parse_mode: 'Markdown' }
                );
                
                await bot.sendMessage(chatId, `Your new wallet balance is ${data.wallet} ETB.`);
                
                await User.updateOne({ chatId }, { $unset: { lastDepositIntent: 1 } }); 

            } else {
                await bot.sendMessage(chatId, `❌ **Deposit Failed!**\n\nReason: ${data.error}. Please try again or contact support.`);
            }

        } catch (error) {
            console.error('Backend communication error:', error);
            await bot.sendMessage(chatId, '❌ A connection error occurred. Please try again.');
        }

        return;
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

// 💡 NEW: Side command: /my_results
bot.onText(/\/my_results/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({ chatId });

    if (!user) {
        return bot.sendMessage(chatId, '⚠️ Please register first using /start');
    }

    await bot.sendMessage(chatId, '📊 Tap the button below to view your results on the web app:', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '📊 View My Results',
                    web_app: {
                        url: `${process.env.FRONTEND_URL}/result?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
                    }
                }
            ]]
        }
    });
});

// 💡 NEW: Side command: /upgrade_ermp
bot.onText(/\/upgrade_ermp/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({ chatId });

    if (!user) {
        return bot.sendMessage(chatId, '⚠️ Please register first using /start');
    }
    
    // Check if already upgraded (same logic as callback query)
    if (user.isERMPValid) {
        return bot.sendMessage(chatId, '✅ **ERMP Upgrade Complete!** You already have active access to the ERMP exam.', {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: '🩺 Start ERMP Exam', callback_data: 'check_ermp_access' }]] }
        });
    }

    // Send payment options
    const amountDep = 300;
    const keyboard = {
        inline_keyboard: [[
            { text: '📲 TELEBIRR', callback_data: 'pay_telebirr_ermp' },
            { text: '🏦 CBE', callback_data: 'pay_cbe_ermp' }
        ]]
    };

    await bot.sendMessage(chatId, `💳 To upgrade **ERMP** for 1 year, deposit **${amountDep}** birr.\nChoose your payment method below:`, { 
        reply_markup: keyboard,
        parse_mode: 'Markdown'
    });
});

// 💡 NEW: Side command: /upgrade_ngat
bot.onText(/\/upgrade_ngat/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({ chatId });

    if (!user) {
        return bot.sendMessage(chatId, '⚠️ Please register first using /start');
    }

    // Check if already upgraded (same logic as callback query)
    if (user.isNGATValid) {
        return bot.sendMessage(chatId, '✅ **NGAT Upgrade Complete!** You already have active access to the NGAT exam.', {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: '🧠 Start NGAT Exam', callback_data: 'check_ngat_access' }]] }
        });
    }

    // Send payment options
    const amountDep = 200;
    const keyboard = {
        inline_keyboard: [[
            { text: '📲 TELEBIRR', callback_data: 'pay_telebirr_ngat' },
            { text: '🏦 CBE', callback_data: 'pay_cbe_ngat' }
        ]]
    };

    await bot.sendMessage(chatId, `💳 To upgrade **NGAT** for 1 year, deposit **${amountDep}** birr.\nChoose your payment method below:`, { 
        reply_markup: keyboard,
        parse_mode: 'Markdown'
    });
});


// ----------------------------------------------------------------------
// --- CALLBACK QUERY HANDLER (UNCHANGED BUT COMPLETE) ---
// ----------------------------------------------------------------------

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

    // --- 1. ERMP Access Check (From Main Menu) ---
    if (choice === 'check_ermp_access') {
      await bot.answerCallbackQuery(query.id);

      if (user.isERMPValid) {
        await bot.sendMessage(chatId, '✅ Access granted! Tap to start your **ERMP Exam**:', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{
                text: '🩺 Start ERMP Exam',
                web_app: {
                  url: `${process.env.FRONTEND_URL}/VIDMATE?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
                }
              }]
            ]
          }
        });
      } else {
        await bot.sendMessage(chatId,
          '❌ **Access Denied!** You must purchase the ERMP Exam.\n\nPlease choose a payment method below to upgrade:',
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '⚡ Upgrade ERMP', callback_data: 'upgrade_ermp_menu' }],
                [{ text: '🔙 Back to Menu', callback_data: 'back_to_main' }]
              ]
            }
          }
        );
      }
      return;
    }
    
    // --- 2. NGAT Access Check (From Main Menu) ---
    if (choice === 'check_ngat_access') {
      await bot.answerCallbackQuery(query.id); 

      if (user.isNGATValid) {
        await bot.sendMessage(chatId, '✅ Access granted! Tap to start your **NGAT Exam**:', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{
                text: '🧠 Start NGAT Exam',
                web_app: {
                  url: `${process.env.FRONTEND_URL}/NGAT?phone=${encodeURIComponent(user.phoneNumber)}&username=${encodeURIComponent(user.username)}`
                }
              }]
            ]
          }
        });
      } else {
        await bot.sendMessage(chatId,
          '❌ **Access Denied!** You must purchase the NGAT Exam.\n\nPlease choose a payment method below to upgrade:',
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '⚡ Upgrade NGAT', callback_data: 'upgrade_ngat_menu' }],
                [{ text: '🔙 Back to Menu', callback_data: 'back_to_main' }]
              ]
            }
          }
        );
      }
      return;
    }


    // --- 3. Navigation and General Actions ---

    // Back to Main: send the main keyboard
    if (choice === 'back_to_main') {
      try {
        // Edit the current message to show the main keyboard
        await bot.editMessageText('👋 Main menu:', { 
            chat_id: chatId, 
            message_id: messageId, 
            reply_markup: buildMainKeyboard(user) 
        });
      } catch (err) {
        // Fallback: send a new message if editing fails (e.g., message too old)
        await bot.sendMessage(chatId, '👋 Main menu:', { reply_markup: buildMainKeyboard(user) });
      }
      await bot.answerCallbackQuery(query.id);
      return;
    }

    // Open exam menu (edit in place if possible, fallback to send)
    if (choice === 'open_exams') {
      const examKeyboard = getMainMenu(user);
      try {
        await bot.editMessageText('📚 Choose your exam menu:', { chat_id: chatId, message_id: messageId, reply_markup: { inline_keyboard: examKeyboard } });
      } catch (err) {
        await bot.sendMessage(chatId, '📚 Exams:', { reply_markup: { inline_keyboard: examKeyboard } });
      }
      await bot.answerCallbackQuery(query.id);
      return;
    }

    // --- 4. Upgrade Menu Check (Prevent Re-Purchase for inline buttons) ---

    // Check ERMP Upgrade Status
    if (choice === 'upgrade_ermp_menu') {
      if (user.isERMPValid) {
        await bot.answerCallbackQuery(query.id, { text: 'You already own the ERMP exam!', show_alert: true }); // Show alert
        await bot.sendMessage(chatId, '✅ **ERMP Upgrade Complete!** You already have active access to the ERMP exam.', {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: [[{ text: '🩺 Start ERMP Exam', callback_data: 'check_ermp_access' }]] }
        });
        return;
      }
      // If not valid, execution continues to the payment choice below
    }

    // Check NGAT Upgrade Status
    if (choice === 'upgrade_ngat_menu') {
      if (user.isNGATValid) {
        await bot.answerCallbackQuery(query.id, { text: 'You already own the NGAT exam!', show_alert: true }); // Show alert
        await bot.sendMessage(chatId, '✅ **NGAT Upgrade Complete!** You already have active access to the NGAT exam.', {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: [[{ text: '🧠 Start NGAT Exam', callback_data: 'check_ngat_access' }]] }
        });
        return;
      }
      // If not valid, execution continues to the payment choice below
    }

    // Upgrade menu buttons (Show payment options if not already upgraded)
    if (choice === 'upgrade_ermp_menu' || choice === 'upgrade_ngat_menu') {
      const examName = choice.includes('ermp') ? 'ERMP' : 'NGAT';
      const amountDep = examName === 'ERMP' ? 300 : 200;
      
      const keyboard = {
        inline_keyboard: [[
          { text: '📲 TELEBIRR', callback_data: `pay_telebirr_${examName.toLowerCase()}` },
          { text: '🏦 CBE', callback_data: `pay_cbe_${examName.toLowerCase()}` }
        ]]
      };

      try {
        await bot.editMessageText(`💳 To upgrade **${examName}** for 1 year, deposit **${amountDep}** birr.\nChoose your payment method below:`, { 
            chat_id: chatId, 
            message_id: messageId, 
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
      } catch (err) {
        await bot.sendMessage(chatId, `💳 To upgrade **${examName}** for 1 year, deposit **${amountDep}** birr.\nChoose your payment method below:`, { 
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
      }

      await bot.answerCallbackQuery(query.id);
      return;
    }

    // --- 5. Payment Instruction Branches ---
    let instructionsMsg = '';
    let amountDep = 0;
    let examType = '';

    if (choice.includes('_ermp')) {
        examType = 'ERMP';
        amountDep = 300;
        await user.updateOne({ $set: { lastDepositIntent: examType } });
    } else if (choice.includes('_ngat')) {
        examType = 'NGAT';
        amountDep = 200;
        await user.updateOne({ $set: { lastDepositIntent: examType } });
    }


    if (choice.includes('pay_telebirr')) {
      instructionsMsg = `
📲 **TELEBIRR** Payment for ${examType}
Account: \`${process.env.TELEBIRR_ACCOUNT}\`
Amount: **${amountDep} ብር**

Please send the TeleBirr SMS/transaction ID or screenshot here to confirm your upgrade.`;
    } else if (choice.includes('pay_cbe')) {
      instructionsMsg = `
🏦 **CBE** Payment for ${examType}
Account: \`${process.env.CBE_ACCOUNT}\`
Amount: **${amountDep} ብር**

Please send the bank SMS/transaction ID or screenshot here to confirm your upgrade.`;
    }

    if (instructionsMsg) {
      await bot.sendMessage(chatId, instructionsMsg, { parse_mode: 'Markdown' });
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
export default bot;