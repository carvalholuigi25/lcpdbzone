import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// app.post("/chat", async (req, res) => {
//   try {
//     const { model, messages } = req.body;

//     const completion = await openai.chat.completions.create({
//       model: model ?? "gpt-5-nano",
//       messages,
//     });

//     res.json(completion.choices[0].message);
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao gerar resposta " + error });
//   }
// });

// app.post('/schat', (req, res) => {
//   try {
//     const {message} = req.body;
//     res.json({ reply: getBotResponse(message) });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

function setHouseNumZero(num = 1) {
  return num < 10 ? '0' + parseInt(num) : parseInt(num);
}

function getTimeNow() {
  const dt = new Date();
  const dtobj = {
    datev: dt.getFullYear() + "-" + setHouseNumZero(dt.getUTCMonth()+1) + "-" + setHouseNumZero(dt.getUTCDate()),
    timev: setHouseNumZero(dt.getUTCHours()) + ":" + setHouseNumZero(dt.getUTCMinutes()) + ":" + setHouseNumZero(dt.getUTCSeconds())
  }
  return dtobj.datev + " " + dtobj.timev;
}

app.post('/chat', async (req, res) => {
  try {
    const prefix = "!", prefixalt = "$";
    const { model, messages } = req.body;
    const objresp = {
      model: model ?? 'gpt-5-nano',
      messages: [{
        role: "user",
        content: ""
      }],
      stream: true
    };

    const umsgs = messages.filter(x => x.role == "user").map(x => x.content);
    const msg = umsgs[umsgs.length-1 ?? 0].toString().toLowerCase().trim();

    if (!msg || typeof msg !== 'string') {
      objresp.messages = [{role: "assistant", content: "I didn't understand that. Please send a valid message."}];
    }

    if (msg.includes(prefix+"ai") || msg.includes(prefixalt+"ai")) {
      const completion = await openai.chat.completions.create({
        model: objresp.model ?? 'gpt-5-nano',
        messages: messages,
        stream: true,
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || '';
        res.write(content);
      }
    } else {
      if (msg.includes('hello') || msg.includes('hi')) {
        objresp.messages = [{role: "assistant", content: "Hello world!"}];
      } else if (msg.includes('time')) {
        objresp.messages = [{role: "assistant", content: "The time is: " + getTimeNow()}];
      } else if (msg.includes('help')) {
        objresp.messages = [{role: "assistant", content: "HELP: Theres list of commands: \r\n!ai || $ai -> for ai chat, \r\nhello -> hello message, \r\ntime -> outputs for time information, \r\nhelp -> help list commands, \r\nbye -> bye message"}];
      } else if (msg.includes('bye')) {
         objresp.messages = [{role: "assistant", content: "Goodbye! Have a great day!"}];
      } else {
         objresp.messages = [{role: "assistant", content: "I'm not sure how to respond to that. Can you rephrase?"}];
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Accept', 'application/json; charset=utf-8');

      for await (const msgo of objresp.messages) {
        res.write(msgo.content || "");
      }
    }

    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar resposta ' + error });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
