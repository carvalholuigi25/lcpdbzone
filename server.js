import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function setHouseNumZero(num = 1) {
  return num < 10 ? '0' + parseInt(num) : parseInt(num);
}

function getTimeNow() {
  const dt = new Date();
  const dtobj = {
    datev: dt.getFullYear() + "-" + setHouseNumZero(dt.getUTCMonth()+1) + "-" + setHouseNumZero(dt.getUTCDate()),
    timev: setHouseNumZero(dt.getUTCHours()) + ":" + setHouseNumZero(dt.getUTCMinutes()) + ":" + setHouseNumZero(dt.getUTCSeconds())
  }
  return dtobj.timev;
}

function getDateNow() {
  const dt = new Date();
  return dt.getFullYear() + "-" + setHouseNumZero(dt.getUTCMonth()+1) + "-" + setHouseNumZero(dt.getUTCDate());
}

function getHelpCmds() {
  const {cmds} = JSON.parse(fs.readFileSync('./list_help_cmds.json', 'utf-8'));
  return cmds || [];
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

    if (msg == "" || msg == " " || msg == null || msg == undefined) {
      objresp.messages = [{role: "assistant", content: "Please start your message with a command prefix (e.g., '!' or '$')."}];
    }

    if (msg == prefix+"ai" || msg == prefixalt+"ai") {
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
      const listhelpcmds = getHelpCmds();

      if (msg == prefix+"hello" || msg == prefixalt+"hello") {
        objresp.messages = [{role: "assistant", content: "Hello world!"}];
      } else if (msg == prefix+"welcome" || msg == prefixalt+"welcome") {
        objresp.messages = [{role: "assistant", content: "Welcome to our chatbot! How can I assist you today?"}];
      } else if (msg == prefix+"time" || msg == prefixalt+"time") {
        objresp.messages = [{role: "assistant", content: "The time is: " + getTimeNow()}];
      } else if (msg == prefix+"date" || msg == prefixalt+"date") {
        objresp.messages = [{role: "assistant", content: "Today's date is: " + getDateNow()}];
      } else if (msg == prefix+"timezone" || msg == prefixalt+"timezone") {
        objresp.messages = [{role: "assistant", content: "The current timezone is: " + Intl.DateTimeFormat().resolvedOptions().timeZone}];
      } else if (msg == prefix+"help" || msg == prefixalt+"help") {
        objresp.messages = [{role: "assistant", content: "HELP: Theres list of commands: \r\n" + listhelpcmds.map(x => `${x.cmd} - ${x.description}`).join("\r\n")}];
      } else if (msg == prefix+"bye" || msg == prefixalt+"bye") {
         objresp.messages = [{role: "assistant", content: "Goodbye! Have a great day!"}];
      } else {
        if(!msg.startsWith(prefix) && !msg.startsWith(prefixalt)) {
          objresp.messages = [{role: "assistant", content: "Please start your message with a command prefix (e.g., '!' or '$')."}];
        } else {
           objresp.messages = [{role: "assistant", content: "I'm not sure how to respond to that. Can you rephrase?"}];
        }
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Accept', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

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
