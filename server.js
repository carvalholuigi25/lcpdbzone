import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import * as f from './serverfunctions.js';
import fs from 'fs';
import { LocalStorage } from 'node-localstorage';
import rateLimit from 'express-rate-limit';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/chat', chatLimiter);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const localStorage = new LocalStorage('./storage/local/chatwarnings');

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
      hello: () => "Hello world!",
      welcome: () => "Welcome to our chatbot! How can I assist you today?",
      time: a => {
        const tz = a.match(/^zone:(.*)/)?.[1]?.trim();
        return "The time is: " + (tz ? f.getTimeByTimezone(tz) : f.getTimeNow());
      },
      date: a => {
        const tz = a.match(/^zone:(.*)/)?.[1]?.trim();
        return "Today's date is: " + (tz ? f.getDateByTimezone(tz) : f.getDateNow());
      },
      datetime: a => {
        const tz = a.match(/^zone:(.*)/)?.[1]?.trim();
        return (
          "The date and time is: " +
          (tz ? f.getDateTimeByTimezone(tz) : f.getDateNow() + " " + f.getTimeNow())
        );
      },
      timezone: () => "The current timezone is: " + f.getTimezone(),
      help: () =>
        "HELP: With prefix (! or $), use this avaliable list of commands: \r\n\n" +
        f.getHelpCmds()
          .map(x => `${x.id}. <b>${x.cmd}</b> - ${x.description}`)
          .join("\r\n"),
      listaimodels: () => "Here are the available models:\n" + f.getListModels(),
      joke: () => f.generateJoke(),
      quote: () => f.generateQuote(),
      mail: () => "You can contact us at: " + process.env.CONTACT_EMAIL,
      weather: async a => {
        const cityMatch = a.match(/^city:(.*)/);
        const city = cityMatch ? cityMatch[1].trim() : process.env.DEFAULT_CITY || "New York";
        return await f.getWeather("city", city);
      },
      listgames: async () => await f.getListGames(),
      listmovies: async () => await f.getListMovies(),
      listanimes: async () => await f.getListAnimes(),
      listpodcasts: async () => await f.getListPodcasts(),
      calc: a => f.getCalculatorResult(a),
      calcage: a => f.getCalcAgeResult(parseInt(a, 10)),
      rng: a => {
        const matchvalue = a.match(/number:(\d+)/gim)[0].split(":")[1].toString();
        const num = matchvalue && typeof parseInt(matchvalue) === "number" ? parseInt(""+matchvalue) : 10;
        return f.shuffleNums(num);
      },
      countdown: a => {
        const matchto = a.match(/^to:(.*)/);
        const date = matchto ? matchto[1].trim() : 1;
        return f.getCountdownResult(date);
      },
      countup: a => {
        const matchfrom = a.match(/^from:(.*)/);
        const date = matchfrom ? matchfrom[1].trim() : 1;
        return f.getCountupResult(date);
      },
      convertdatasize: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const size = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "MB";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "GB";

        // Validation
        const validUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (isNaN(size) || size <= 0) throw new Error("Invalid value: must be a positive number.");
        if (!validUnits.includes(unit.toUpperCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toUpperCase())) throw new Error("Invalid to unit.");

        console.log("Converting data size:", { a, unit, tounit });
        return f.getDataSizeConversion(size, unit, tounit);
      },
      converttemp: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const temp = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "C";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "F";

        // Validation
        const validUnits = ['C', 'F', 'K'];
        if (isNaN(temp)) throw new Error("Invalid value: must be a number.");
        if (!validUnits.includes(unit.toUpperCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toUpperCase())) throw new Error("Invalid to unit.");

        console.log("Converting temperature:", { a, unit, tounit });
        return f.getTemperatureConversion(temp, unit, tounit);
      },
      convertlength: a => {
       const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const length = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "m";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "ft";

        // Validation
        const validUnits = ['m', 'km', 'mi', 'ft'];
        if (isNaN(length) || length <= 0) throw new Error("Invalid value: must be a positive number.");
        if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

        console.log("Converting length:", { a, unit, tounit });
        return f.getLengthConversion(length, unit, tounit);
      },
      converttime: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const time = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "sec";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "min";

        // Validation
        const validUnits = ['milisec', 'sec', 'min', 'hour', 'day', 'week', 'month', 'year'];
        if (isNaN(time) || time <= 0) throw new Error("Invalid value: must be a positive number.");
        if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

        console.log("Converting time:", { a, unit, tounit });
        return f.getTimeConversion(time, unit, tounit);
      },
      convertweight: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const weight = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "kg";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "lb";

        // Validation
        const validUnits = ['g', 'kg', 'lb', 'oz'];
        if (isNaN(weight) || weight <= 0) throw new Error("Invalid value: must be a positive number.");
        if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

        console.log("Converting weight:", { a, unit, tounit });
        return f.getWeightConversion(weight, unit, tounit);
      },
      convertcurrency: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const amount = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const from = matchvalue ? matchvalue[1].split(":")[1]: "USD";
        const to = matchvalue ? matchvalue[2].split(":")[1] : "EUR";

        // Validation
        if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount: must be a positive number.");
        if (!/^[A-Z]{3}$/.test(from)) throw new Error("Invalid from currency code.");
        if (!/^[A-Z]{3}$/.test(to)) throw new Error("Invalid to currency code.");

        console.log("Converting currency:", { a, amount, from, to });
        return f.getCurrencyConversion(amount, from, to);
      },
      convertvolume: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const volume = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "L";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "mL";

        // Validation
        const validUnits = ['l', 'ml', 'gal', 'cup'];
        if (isNaN(volume) || volume <= 0) throw new Error("Invalid value: must be a positive number.");
        if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

        console.log("Converting volume:", { a, unit, tounit });
        return f.getVolumeConversion(volume, unit, tounit);
      },
      convertpressure: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const pressure = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "Pa";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "atm";

        // Validation
        const validUnits = ['pa', 'kpa', 'bar', 'psi'];
        if (isNaN(pressure) || pressure <= 0) throw new Error("Invalid value: must be a positive number.");
        if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

        console.log("Converting pressure:", { a, unit, tounit });
        return f.getPressureConversion(pressure, unit, tounit);
      },
      convertspeed: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const speed = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "km/h";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "mph";

        // Validation
        const validUnits = ['m/s', 'km/h', 'mph'];
        if (isNaN(speed) || speed < 0) throw new Error("Invalid value: must be a non-negative number.");
        if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

        console.log("Converting speed:", { a, unit, tounit });
        return f.getSpeedConversion(speed, unit, tounit);
      },
      convertenergy: a => {
        const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
        const energy = matchvalue ? matchvalue[0].split(":")[1] : 1;
        const unit = matchvalue ? matchvalue[1].split(":")[1]: "J";
        const tounit = matchvalue ? matchvalue[2].split(":")[1] : "kWh";

        // Validation
        const validUnits = ['j', 'kj', 'cal', 'kcal'];
        if (isNaN(energy) || energy <= 0) throw new Error("Invalid value: must be a positive number.");
        if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
        if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

        console.log("Converting energy:", { a, unit, tounit });
        return f.getEnergyConversion(energy, unit, tounit);
      },
      radio: async () => await f.getRadioStationsByCountry(),
      youtube: async (a) => {
        const queryMatch = a.match(/^search:(\w+)/gim);
        const query = queryMatch ? queryMatch[0].split(":")[1] : "angular";
        return await f.getYoutubeSearch(query);
      },
      colorlist: () => f.getColorListHex(),
      inspiredby: () => f.getInspiredBy(),
      motivation: () => f.getMotivation(),
      resetwarnings: () => {
        forceResetWarnings(true);
        return warn > 0 ? "The warnings were reseted!" : "The warnings already reseted!";
      },
      chatclosed: () => {
        resetWarnings();
        warn = localStorage.getItem("warningCount") ? parseInt(localStorage.getItem("warningCount")) : 0;
        return getProfMsgWarnList(warn, maxwarn, warnExpireTime);
      },
      bye: () => "Goodbye! Have a great day!",
    };

    const profanityList = (msg) => {
      return fs.promises.readFile('./profanityfilters.json', 'utf-8')
        .then((data) => JSON.parse(data).badwords || [])
        .then(filters => filters.some(word => word.toLowerCase().includes(msg.toLowerCase())))
        .catch(err => {
          console.error('Error reading profanity filters:', err);
          return [];
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
      } else if((msg !== prefixalt && msg !== prefix) && profanityList(msg)) {
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

        objresp.messages = [
          {
            role: "assistant",
            content: "I'm not sure how to respond to that. Can you rephrase?",
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
    res.status(500).json({ error: "Erro ao gerar resposta " + error });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
