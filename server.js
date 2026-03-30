import fs from 'fs';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { LocalStorage } from 'node-localstorage';
import * as f from './serverfunctions.js';


function loadProfanityFilters() {
  // Cache profanity filters at startup
  let cpfilters = [];
  fs.promises.readFile('./profanityfilters.json', 'utf-8')
  .then((data) => {
    cpfilters = JSON.parse(data).badwords || [];
    console.log(`Loaded ${cpfilters.length} profanity filters`);
    return cpfilters;
  })
  .catch(err => {
    console.error('Error loading profanity filters at startup:', err);
    cpfilters = [];
    return cpfilters;
  });
}

dotenv.config();

if(process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const localStorage = new LocalStorage('./storage/local/chatwarnings');
const cachedProfanityFilters = loadProfanityFilters();

app.use(cors());
app.use(express.json());
app.use('/chat', chatLimiter);

app.post('/chat', async (req, res) => {
  try {
    const maxwarn = 3; 
    const warnExpireTime = f.getWarnTimeExpireCalc(5);

    let warn = parseInt(localStorage.getItem("warningCount")) ?? 0; 

    const prefix = "!", prefixalt = "$";
    const { model, messages } = req.body;
    const dt = "" + new Date().toISOString();
    const objresp = {
      model: model ?? 'gpt-5-nano',
      messages: [
        {
          role: "user",
          content: "",
          timestamp: dt,
        },
      ],
      stream: true,
    };

    const umsgs = messages.filter(x => x.role == "user").map(x => x.content);
    const msg = umsgs[umsgs.length - 1 ?? 0].toString().toLowerCase().trim();

    // prefix stripping and command parsing
    const stripPrefix = m => {
      if (m.startsWith(prefix)) return m.slice(prefix.length).trim();
      if (m.startsWith(prefixalt)) return m.slice(prefixalt.length).trim();
      return m;
    };

    const { cmd, args } = (() => {
      const stripped = stripPrefix(msg);
      const [first, ...rest] = stripped.split(' ');
      return { cmd: first || '', args: rest.join(' ').trim() };
    })();

    const resetWarnings = (keepWarnings = false) => {
      const dtexp = localStorage.getItem("dateTimeWarnExpire");
      if(!keepWarnings && warn >= maxwarn && dtexp && new Date().getTime() >= dtexp) {
        warn = 0;
        localStorage.setItem("warningCount", warn);
        localStorage.removeItem("dateTimeWarnExpire");
      }
    }

    const forceResetWarnings = (keepWarnings = false) => {
      if(keepWarnings && warn > 0) {
        warn = 0;
        localStorage.setItem("warningCount", warn);
        localStorage.removeItem("dateTimeWarnExpire");
      }
    }

    const getClosedChatMsg = (warnExpireTime) => {
      return `<div class="fmessage chatclosed">
        <i class="bi bi-lock-fill chatclosedicon"></i>
        <h2 class="chatclosedtitle">Chat is closed</h2>
        <span class="chatclosedmsg">The chat is currently closed due to reached of max warnings (Reason: <b>inappropriate language behaviour</b>)! The chat will reactivate after ${new Date(new Date().getTime() + warnExpireTime).toLocaleString()}!</span>
      </div>`;
    }
    
    const getProfMsgWarnList = (warni, maxwarn, warnExpireTime) => {
      return (warni >= maxwarn ? getClosedChatMsg(warnExpireTime) : `Please refrain from using inappropriate language. (Warning issued).`);
    }

    const handlers = {
      hello: () => f.getHelloMessageCMD(),
      welcome: () => f.getWelcomeMessage(),
      bye: () => f.getByeMessage(),
      help: () => f.getHelpListCMD(),
      rules: async () => await f.getRulesMessage(),
      feedback: async a => await f.sendFeedbackCMD(a, nodemailer),
      theme: a => f.setThemeCMD(localStorage, a),
      time: a => f.setTimeCMD(a),
      date: a => f.setDateCMD(a),
      datetime: a => f.setDateTimeCMD(a),
      timezone: () => f.getTimeZoneCMD(),
      listtimezones: a => f.getListTimeZonesCMD(a),
      listaimodels: () => f.getListAIModelsCMD(),
      joke: () => f.generateJoke(),
      quote: () => f.generateQuote(),
      mail: () => f.getEMAILAddressCMD(),
      weather: async a => await f.setWeatherCMD(a),
      listgames: async () => await f.getListGames(),
      listmovies: async () => await f.getListMovies(),
      listanimes: async () => await f.getListAnimes(),
      listpodcasts: async () => await f.getListPodcasts(),
      calc: a => f.getCalculatorResult(a),
      calcage: a => f.getCalcAgeResult(a),
      rng: a => f.getRNGCMD(a),
      countdown: a => f.getCountdownCMD(a),
      countup: a => f.getCountUpCMD(a),
      convertdatasize: a => f.getDataSizeConversionCMD(a),
      converttemp: a => f.getTemperatureConversionCMD(a),
      convertlength: a => f.getLengthConversionCMD(a),
      converttime: a => f.getTimeConversionCMD(a),
      convertweight: a => f.getWeightConversionCMD(a),
      convertcurrency: a => f.getCurrencyConversionCMD(a),
      convertvolume: a => f.getVolumeConversionCMD(a),
      convertpressure: a => f.getPressureConversionCMD(a),
      convertspeed: a => f.getSpeedConversionCMD(a),
      convertenergy: a => f.getEnergyConversionCMD(a),
      convert: a => f.getAllConversionsCMD(a),
      radio: async () => await f.getRadioStationsByCountry(),
      youtube: async (a) => await f.getYouTubeSearchResultsCMD(a),
      colorlist: () => f.getColorListHex(),
      inspiredby: () => f.getInspiredBy(),
      motivation: () => f.getMotivation(),
      resetwarnings: () => f.setResetWarningsCMD(forceResetWarnings(true)),
      chatclosed: () => f.setChatClosedCMD(resetWarnings, warn, maxwarn, warnExpireTime),
      translate: async a => await f.setTranslationCMD(a, openai),
      news: async a => await f.setNewsCMD(a),
      spotify: async a => await f.setSpotifyMusicCMD(a),
      video: async a => await f.setVideoCMD(a),
      audio: async a => await f.setAudioCMD(a),
    };

    // Check if message contains profanity (validates against cached filters)
    const containsProfanity = (msg) => {
      const msgLower = msg.toLowerCase().trim();
      if (!msgLower || cachedProfanityFilters.length === 0) return false;

      return cachedProfanityFilters.some(word => {
        const wordLower = word.toLowerCase().trim();
        if (!wordLower) return false;

        const escapedWord = wordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
        return regex.test(msgLower);
      });
    };

    if (!msg) {
      resetWarnings();

      objresp.messages = [
        {
          role: "assistant",
          content: "Please start your message with a command prefix (e.g., '! or $').",
          timestamp: dt,
        },
      ];
    } else if (msg.startsWith(prefix) || msg.startsWith(prefixalt)) {
      if (cmd === "ai") {
        resetWarnings();

        const completion = await openai.chat.completions.create({
          model: objresp.model,
          messages,
          stream: true,
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        for await (const chunk of completion) {
          res.write(chunk.choices[0]?.delta?.content || "");
        }

        res.end();
        return;
      } else if (handlers[cmd]) {
        resetWarnings();

        let result;
        try {
          result = await handlers[cmd](args);
        } catch (error) {
          result = error.message;
          res.status(400);
        }
        objresp.messages = [{ role: "assistant", content: result, timestamp: dt }];
      } else if((msg !== prefixalt && msg !== prefix) && containsProfanity(msg)) {
        resetWarnings();

        const warni = parseInt(warn+1) <= maxwarn ? parseInt(warn + 1) : parseInt((maxwarn-maxwarn));
        
        localStorage.setItem("warningCount", ""+warni);

        if(warni >= maxwarn) {
          localStorage.setItem("dateTimeWarnExpire", ""+(new Date().getTime() + warnExpireTime));
        }

        const resmsgwarn = getProfMsgWarnList(warni, maxwarn, warnExpireTime);

        objresp.messages = [
          {
            role: "assistant",
            content: resmsgwarn,
            timestamp: dt,
          },
        ];
      } else {
        resetWarnings();

        const msgprefix = msg.startsWith(prefix) ? prefix : (msg.startsWith(prefixalt) ? prefixalt : "");
        const isMsgContainsProf = containsProfanity(msgprefix+msg) || localStorage.getItem("warningCount") ? (msg == msgprefix ? false : true) : false;

        const msgcontent = isMsgContainsProf ? "Please refrain from using inappropriate language. (Warning issued)." : (msg == msgprefix ? "Please enter a command after the prefix." : "Command not recognized. Please try again.");

        objresp.messages = [
          {
            role: "assistant",
            content: msgcontent,
            timestamp: dt,
          },
        ];
      }
    } else {
      resetWarnings();

      objresp.messages = [
        {
          role: "assistant",
          content: "Please start your message with a command prefix (e.g., '! or $').",
          timestamp: dt,
        },
      ];
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Accept", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for (const msgo of objresp.messages) {
      res.write(msgo.content || "");
    }

    res.end();
  } catch (error) {
    res.status(500).json({ error: "Error when generating response: " + error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
