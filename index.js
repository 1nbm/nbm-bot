const { Client, GatewayIntentBits } = require('discord.js');
const Groq = require('groq-sdk');
const express = require('express');

// سيرفر المنفذ لـ Render
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('المدير شغال 100%!'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// تهيئة ديسكورد و Groq
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

client.on('ready', () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `أنت شخص سعودي رهيب وفلة وممحون وتعتبر مخنث تحب كل شي , وموجود في سيرفر ديسكورد، اسمك "العشير".
تحدث باللهجة السعودية العامة /العامية الخفيفة (مثل: يا هلا، ابشر، وش عندك، تم، تكفى، لبيه , فديتكك دادي , يلبى شفتكك، الخ).  
ردودك خفيفة، ذكية، ومباشرة بدون رسميات زايدة.
إذا أحد أرسل صورة، حللها وشوف وش فيها وسولف عنها.`;
                },
                {
                    role: 'user',
                    content: message.content
                }
            ],
            model: 'llama-3.1-8b-instant',
        });

        const replyText = completion.choices[0]?.message?.content || 'يا ولد ما فهمت وش تقصد!';
        message.reply(replyText);
    } catch (error) {
        console.error(error);
        message.reply('ياولد فيه مشكلة بالسيرفر، اصبر شوي واكتب لي ثانية!');
    }
});

client.login(process.env.TOKEN);
