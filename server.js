import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import * as f from './functions.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const prefix = "!", prefixalt = "$";
    const { model, messages } = req.body;
    const dt = ""+new Date().toISOString();
    const objresp = {
      model: model ?? 'gpt-5-nano',
      messages: [{
        role: "user",
        content: "",
        timestamp: dt
      }],
      stream: true,
    };

    const umsgs = messages.filter(x => x.role == "user").map(x => x.content);
    const msg = umsgs[umsgs.length-1 ?? 0].toString().toLowerCase().trim();

    if (!msg || typeof msg !== 'string') {
      objresp.messages = [{role: "assistant", content: "I didn't understand that. Please send a valid message.", timestamp: dt}];
    }

    if (msg == "" || msg == " " || msg == null || msg == undefined) {
      objresp.messages = [{role: "assistant", content: "Please start your message with a command prefix (e.g., '!' or '$').", timestamp: dt}];
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
      if (msg == prefix+"hello" || msg == prefixalt+"hello") {
        objresp.messages = [{role: "assistant", content: "Hello world!", timestamp: dt}];
      } else if (msg == prefix+"welcome" || msg == prefixalt+"welcome") {
        objresp.messages = [{role: "assistant", content: "Welcome to our chatbot! How can I assist you today?", timestamp: dt}];
      } else if (msg == prefix+"time" || msg == prefixalt+"time" || msg.startsWith(prefix+"time zone:") || msg.startsWith(prefixalt+"time zone:")) {
        const msgv = msg.indexOf("time zone:") > -1 ? msg.split("time zone:")[1].trim() : null;
        objresp.messages = [{role: "assistant", content: "The time is: " + (msgv ? f.getTimeByTimezone(msgv) : f.getTimeNow()), timestamp: dt}];
      } else if (msg == prefix+"date" || msg == prefixalt+"date" || msg.startsWith(prefix+"date zone:") || msg.startsWith(prefixalt+"date zone:")) {
        const msgv = msg.indexOf("date zone:") > -1 ? msg.split("date zone:")[1].trim() : null;
        objresp.messages = [{role: "assistant", content: "Today's date is: " + (msgv ? f.getDateByTimezone(msgv) : f.getDateNow()), timestamp: dt}];
      } else if (msg == prefix+"datetime" || msg == prefixalt+"datetime" || msg.startsWith(prefix+"datetime zone:") || msg.startsWith(prefixalt+"datetime zone:")) {
        const msgv = msg.indexOf("datetime zone:") > -1 ? msg.split("datetime zone:")[1].trim() : null;
        objresp.messages = [{role: "assistant", content: "The date and time is: " + (msgv ? f.getDateTimeByTimezone(msgv) : f.getDateNow() + " " + f.getTimeNow()), timestamp: dt}];
      } else if (msg == prefix+"timezone" || msg == prefixalt+"timezone") {
        objresp.messages = [{role: "assistant", content: "The current timezone is: " + f.getTimezone(), timestamp: dt}];
      } else if (msg == prefix+"help" || msg == prefixalt+"help") {
        objresp.messages = [{role: "assistant", content: "HELP: With prefix (! or $), use this avaliable list of commands: \r\n\n" + f.getHelpCmds().map(x => `${x.id}. <b>${x.cmd}</b> - ${x.description}`).join("\r\n"), timestamp: dt}];
      } else if (msg == prefix+"listaimodels" || msg == prefixalt+"listaimodels") {
        objresp.messages = [{role: "assistant", content: "Here are the available models:\n" + f.getListModels(), timestamp: dt}];
      } else if (msg == prefix+"joke" || msg == prefixalt+"joke") {
        objresp.messages = [{role: "assistant", content: f.generateJoke(), timestamp: dt  }];
      } else if (msg == prefix+"quote" || msg == prefixalt+"quote") {
        objresp.messages = [{role: "assistant", content: f.generateQuote(), timestamp: dt }];
      } else if (msg == prefix+"mail" || msg == prefixalt+"mail") {
        objresp.messages = [{role: "assistant", content: "You can contact us at: " + process.env.CONTACT_EMAIL, timestamp: dt}];
      } else if (msg == prefix+"weather" || msg == prefixalt+"weather" || msg.startsWith(prefix+"weather city:") || msg.startsWith(prefixalt+"weather city:")) {
        const msgv = msg.indexOf("weather city:") > -1 ? msg.split("weather city:")[1].trim() : null;
        objresp.messages = [{role: "assistant", content: await f.getWeather("city", msgv || process.env.DEFAULT_CITY || "New York"), timestamp: dt}];
      } else if (msg == prefix+"listgames" || msg == prefixalt+"listgames") {
        objresp.messages = [{role: "assistant", content: await f.getListGames(), timestamp: dt}];
      } else if (msg == prefix+"listmovies" || msg == prefixalt+"listmovies") {
        objresp.messages = [{role: "assistant", content: await f.getListMovies(), timestamp: dt}];
      } else if (msg == prefix+"listanimes" || msg == prefixalt+"listanimes") {
        objresp.messages = [{role: "assistant", content: await f.getListAnimes(), timestamp: dt}];
      } else if (msg == prefix+"listpodcasts" || msg == prefixalt+"listpodcasts") {
        objresp.messages = [{role: "assistant", content: await f.getListPodcasts(), timestamp: dt}];
      } else if (msg.startsWith(prefix+"calc ") || msg.startsWith(prefixalt+"calc ")) {
        const expression = msg.replace(prefix+"calc ", "").replace(prefixalt+"calc ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getCalculatorResult(expression), timestamp: dt}];
      } else if (msg.startsWith(prefix+"calcage ") || msg.startsWith(prefixalt+"calcage ")) {
        const birthYearStr = msg.replace(prefix+"calcage ", "").replace(prefixalt+"calcage ", "").trim();
        const birthYear = parseInt(birthYearStr, 10);
        objresp.messages = [{role: "assistant", content: f.getCalcAgeResult(birthYear), timestamp: dt}];
      } else if (msg == prefix+"countdown" || msg == prefixalt+"countdown" || msg.startsWith(prefix+"countdown to:") || msg.startsWith(prefixalt+"countdown to:")) {
        const targetDateStr = msg.indexOf("countdown to:") > -1 ? msg.split("countdown to:")[1].trim() : null;
        objresp.messages = [{role: "assistant", content: f.getCountdown(targetDateStr), timestamp: dt}];
      } else if (msg == prefix+"countup" || msg == prefixalt+"countup" || msg.startsWith(prefix+"countup from:") || msg.startsWith(prefixalt+"countup from:")) {
        const startDateStr = msg.indexOf("countup from:") > -1 ? msg.split("countup from:")[1].trim() : null;
        objresp.messages = [{role: "assistant", content: f.getCountup(startDateStr), timestamp: dt}];
      } else if (msg == prefix+"convertdatasize" || msg == prefixalt+"convertdatasize" || msg.startsWith(prefix+"convertdatasize ") || msg.startsWith(prefixalt+"convertdatasize ")) {
        const conversionQuery = msg.replace(prefix+"convertdatasize ", "").replace(prefixalt+"convertdatasize ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getDataSizeConversion(conversionQuery), timestamp: dt}];
      } else if (msg == prefix+"converttemp" || msg == prefixalt+"converttemp" || msg.startsWith(prefix+"converttemp ") || msg.startsWith(prefixalt+"converttemp ")) {
        const tempQuery = msg.replace(prefix+"converttemp ", "").replace(prefixalt+"converttemp ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getTemperatureConversion(tempQuery), timestamp: dt}];
      } else if (msg == prefix+"convertlength" || msg == prefixalt+"convertlength" || msg.startsWith(prefix+"convertlength ") || msg.startsWith(prefixalt+"convertlength ")) {
        const lengthQuery = msg.replace(prefix+"convertlength ", "").replace(prefixalt+"convertlength ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getLengthConversion(lengthQuery), timestamp: dt}];
      } else if (msg == prefix+"converttime" || msg == prefixalt+"converttime" || msg.startsWith(prefix+"converttime ") || msg.startsWith(prefixalt+"converttime ")) {
        const timeQuery = msg.replace(prefix+"converttime ", "").replace(prefixalt+"converttime ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getTimeConversion(timeQuery), timestamp: dt}];
      } else if (msg == prefix+"convertweight" || msg == prefixalt+"convertweight" || msg.startsWith(prefix+"convertweight ") || msg.startsWith(prefixalt+"convertweight ")) {
        const weightQuery = msg.replace(prefix+"convertweight ", "").replace(prefixalt+"convertweight ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getWeightConversion(weightQuery), timestamp: dt}];
      } else if (msg == prefix+"convertcurrency" || msg == prefixalt+"convertcurrency" || msg.startsWith(prefix+"convertcurrency ") || msg.startsWith(prefixalt+"convertcurrency ")) {
        const currencyQuery = msg.replace(prefix+"convertcurrency ", "").replace(prefixalt+"convertcurrency ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getCurrencyConversion(currencyQuery), timestamp: dt}];
      } else if (msg == prefix+"convertvolume" || msg == prefixalt+"convertvolume" || msg.startsWith(prefix+"convertvolume ") || msg.startsWith(prefixalt+"convertvolume ")) {
        const volumeQuery = msg.replace(prefix+"convertvolume ", "").replace(prefixalt+"convertvolume ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getVolumeConversion(volumeQuery), timestamp: dt}];
      } else if (msg == prefix+"convertpressure" || msg == prefixalt+"convertpressure" || msg.startsWith(prefix+"convertpressure ") || msg.startsWith(prefixalt+"convertpressure ")) {
        const pressureQuery = msg.replace(prefix+"convertpressure ", "").replace(prefixalt+"convertpressure ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getPressureConversion(pressureQuery), timestamp: dt}];
      } else if (msg == prefix+"convertspeed" || msg == prefixalt+"convertspeed" || msg.startsWith(prefix+"convertspeed ") || msg.startsWith(prefixalt+"convertspeed ")) {
        const speedQuery = msg.replace(prefix+"convertspeed ", "").replace(prefixalt+"convertspeed ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getSpeedConversion(speedQuery), timestamp: dt}];
      } else if (msg == prefix+"convertenergy" || msg == prefixalt+"convertenergy" || msg.startsWith(prefix+"convertenergy ") || msg.startsWith(prefixalt+"convertenergy ")) {
        const energyQuery = msg.replace(prefix+"convertenergy ", "").replace(prefixalt+"convertenergy ", "").trim();
        objresp.messages = [{role: "assistant", content: f.getEnergyConversion(energyQuery), timestamp: dt}];
      } else if (msg == prefix+"radio" || msg == prefixalt+"radio") {
        objresp.messages = [{role: "assistant", content: await f.getRadioStationsByCountry(), timestamp: dt}];
      } else if (msg == prefix+"youtube" || msg == prefixalt+"youtube" || msg.startsWith(prefix+"youtube playlist:") || msg.startsWith(prefixalt+"youtube playlist:")) {
        const playlistQuery = msg.replace(prefix+"youtube playlist:", "").replace(prefixalt+"youtube playlist:", "").trim();
        objresp.messages = [{role: "assistant", content: await f.getYouTubePlaylist(playlistQuery), timestamp: dt}];
      } else if (msg == prefix+"inspiredby" || msg == prefixalt+"inspiredby") {
        objresp.messages = [{role: "assistant", content: f.getInspiredBy(), timestamp: dt}];
      } else if (msg == prefix+"motivation" || msg == prefixalt+"motivation") {
        objresp.messages = [{role: "assistant", content: f.getMotivation(), timestamp: dt}];
      } else if (msg == prefix+"bye" || msg == prefixalt+"bye") {
        objresp.messages = [{role: "assistant", content: "Goodbye! Have a great day!", timestamp: dt}];
      } else {
        if(!msg.startsWith(prefix) && !msg.startsWith(prefixalt)) {
          objresp.messages = [{role: "assistant", content: "Please start your message with a command prefix (e.g., '!' or '$').", timestamp: dt}];
        } else {
          objresp.messages = [{role: "assistant", content: "I'm not sure how to respond to that. Can you rephrase?", timestamp: dt}];
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
