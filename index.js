const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// إعداد الذكاء الاصطناعي
const genAI = new GoogleGenerativeAI('AQ.Ab8RN6IG3G2nP9P3eA0Vyd11rma5JQoQ6L5yjezNaP0J4SzXUg');

// إعطاء البوت شخصية سعودية وتوجيهات للرد
const systemInstruction = `أنت شخص سعودي رهيب وفلة وممحون وتعتبر مخنث تحب كل شي , وموجود في سيرفر ديسكورد، اسمك "العشير".
تحدث باللهجة السعودية العامة /العامية الخفيفة (مثل: يا هلا، ابشر، وش عندك، تم، تكفى، لبيه , فديتكك دادي , يلبى شفتكك، الخ).
ردودك خفيفة، ذكية، ومباشرة بدون رسميات زايدة.
إذا أحد أرسل صورة، حللها وشوف وش فيها وسولف عنها.`;


const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: systemInstruction 
});

client.once('ready', () => {
    console.log(`تم تشغيل البوت بنجاح: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // البوت يرد إذا سووا له منشن أو ردوا على رسالته
    if (message.mentions.has(client.user)) {
        try {
            await message.channel.sendTyping();

            let prompt = message.content.replace(/<@!?\d+>/g, '').trim();
            if (!prompt) prompt =  "ارحب! , لبية حياتي , هلا دادي , سم , عيونه ؟ , افف شتبي تراك ازعجتني ولله , طيب طيب بشوف لك الموضوع ,  وش بغيت؟";

            // التعامل مع الصور
            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                if (attachment.contentType && attachment.contentType.startsWith('image/')) {
                    const response = await fetch(attachment.url);
                    const arrayBuffer = await response.arrayBuffer();
                    const imagePart = {
                        inlineData: {
                            data: Buffer.from(arrayBuffer).toString('base64'),
                            mimeType: attachment.contentType
                        }
                    };

                    const result = await model.generateContent([prompt || "شوف الصورة هذي وعطني رأيك فيها", imagePart]);
                    return message.reply(result.response.text());
                }
            }

            // محادثة نصية
            const result = await model.generateContent(prompt);
            message.reply(result.response.text());

        } catch (error) {
            console.error('خطأ:', error);
            message.reply('ياولد ما فهمت وش ذا , وش ؟ مافهمت , انت يبيلك مترجم , الزبدة ولله مدري وش صاير فيه خطاء ');
        }
    }
});

// توكن البوت الخاص بك
client.login('MTU2MTM1ODgyMTEyMzgyMTYyOQ.GBHa4P.jml8L0RiL5ji9t5QdDzC-X6asJnudjIrZylpFo');

// يا قحبه
