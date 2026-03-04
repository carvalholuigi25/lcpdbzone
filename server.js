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
      countdown: a => {
        const match = a.match(/^to:(.*)/);
        const date = match ? match[1].trim() : null;
        return f.getCountdownResult(date);
      },
      countup: a => {
        const match = a.match(/^from:(.*)/);
        const date = match ? match[1].trim() : null;
        return f.getCountupResult(date);
      },
      convertdatasize: a => {
        const matchsize = a.match(/^size:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const size = matchsize ? matchsize[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "MB";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "GB";
        console.log("Converting data size:", { a, unit, tounit });
        return f.getDataSizeConversion(size, unit, tounit);
      },
      converttemp: a => {
        const matchtemp = a.match(/^temp:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const temp = matchtemp ? matchtemp[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "C";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "F";
        console.log("Converting temperature:", { a, unit, tounit });
        return f.getTemperatureConversion(temp, unit, tounit);
      },
      convertlength: a => {
        const matchlen = a.match(/^length:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const length = matchlen ? matchlen[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "m";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "ft";
        console.log("Converting length:", { a, unit, tounit });
        return f.getLengthConversion(length, unit, tounit);
      },
      converttime: a => {
        const matchtime = a.match(/^time:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const time = matchtime ? matchtime[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "s";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "min";
        console.log("Converting time:", { a, unit, tounit });
        return f.getTimeConversion(time, unit, tounit);
      },
      convertweight: a => {
        const matchweight = a.match(/^weight:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const weight = matchweight ? matchweight[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "kg";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "lb";
        console.log("Converting weight:", { a, unit, tounit });
        return f.getWeightConversion(weight, unit, tounit);
      },
      convertcurrency: a => {
        const matchamount = a.match(/^amount:(.*)/);
        const matchfrom = a.match(/^from:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const amount = matchamount ? matchamount[1].trim().split(/\s+/)[0] : null;
        const from = matchfrom ? matchfrom[1].trim().split(/\s+/)[0] : "USD";
        const to = matchto ? matchto[1].trim().split(/\s+/)[0] : "EUR";
        console.log("Converting currency:", { a, amount, from, to });
        return f.getCurrencyConversion(amount, from, to);
      },
      convertvolume: a => {
        const matchvolume = a.match(/^volume:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const volume = matchvolume ? matchvolume[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "L";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "mL";
        console.log("Converting volume:", { a, unit, tounit });
        return f.getVolumeConversion(volume, unit, tounit);
      },
      convertpressure: a => {
        const matchpressure = a.match(/^pressure:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const pressure = matchpressure ? matchpressure[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "Pa";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "atm";
        console.log("Converting pressure:", { a, unit, tounit });
        return f.getPressureConversion(pressure, unit, tounit);
      },
      convertspeed: a => {
        const matchspeed = a.match(/^speed:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const speed = matchspeed ? matchspeed[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "km/h";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "mph";
        console.log("Converting speed:", { a, unit, tounit });
        return f.getSpeedConversion(speed, unit, tounit);
      },
      convertenergy: a => {
        const matchenergy = a.match(/^energy:(.*)/);
        const match = a.match(/^unit:(.*)/);
        const matchto = a.match(/^to:(.*)/);
        const energy = matchenergy ? matchenergy[1].trim().split(/\s+/)[0] : null;
        const unit = match ? match[1].trim().split(/\s+/)[0] : "J";
        const tounit = matchto ? matchto[1].trim().split(/\s+/)[0] : "kWh";
        console.log("Converting energy:", { a, unit, tounit });
        return f.getEnergyConversion(energy, unit, tounit);
      },
      radio: async () => await f.getRadioStationsByCountry(),
      youtube: async a => {
        const m = a.match(/^playlist:(.*)/);
        return await f.getYouTubePlaylist(m ? m[1].trim() : "");
      },
      inspiredby: () => f.getInspiredBy(),
      motivation: () => f.getMotivation(),
      bye: () => "Goodbye! Have a great day!",
    };

    if (!msg) {
      objresp.messages = [
        {
          role: "assistant",
          content: "Please start your message with a command prefix (e.g., '! or $').",
          timestamp: dt,
        },
      ];
    } else if (msg.startsWith(prefix) || msg.startsWith(prefixalt)) {
      if (cmd === "ai") {
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
        const result = await handlers[cmd](args);
        objresp.messages = [{ role: "assistant", content: result, timestamp: dt }];
      } else {
        objresp.messages = [
          {
            role: "assistant",
            content: "I'm not sure how to respond to that. Can you rephrase?",
            timestamp: dt,
          },
        ];
      }
    } else {
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
